/**
 * Soligo Air — Lead Capture Function
 * Netlify serverless function
 *
 * Phase 1: GHL webhook + Resend email notification + Meta CAPI
 * Phase 2: Add SMS confirmation (Twilio), booking (Calendly), CRM enrichment
 *
 * Environment variables required — see .env.example
 */

const ALLOWED_ORIGINS = ['https://soligoair.shop', 'https://www.soligoair.shop'];

const corsHeaders = (origin) => ({
  'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
});

// HTML escape utility — prevents HTML injection in email templates
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Input validation
function validateLead(body) {
  const errors = [];

  // Accept both `name` (new schema) and `fullName` (legacy schema)
  const nameValue = (body.name || body.fullName || '').trim();
  if (nameValue.length < 2) errors.push('Missing required field: name');

  if (!body.phone || String(body.phone).trim() === '') {
    errors.push('Missing required field: phone');
  } else {
    const digits = String(body.phone).replace(/\D/g, '');
    if (digits.length !== 10) errors.push('Invalid phone number');
  }

  if (body.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email.trim())) {
      errors.push('Invalid email address');
    }
  }

  // ZIP is optional for legacy forms; if present, validate
  if (body.zip && !/^\d{5}$/.test(String(body.zip).trim())) {
    errors.push('Invalid ZIP code');
  }

  const MAX_LENGTH = 500;
  for (const field of Object.keys(body)) {
    if (body[field] && String(body[field]).length > MAX_LENGTH) {
      errors.push(`Field too long: ${field}`);
    }
  }

  return errors;
}

exports.handler = async (event) => {
  const origin = event.headers.origin || event.headers.Origin || '';
  const headers = corsHeaders(origin);

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ success: false, message: 'Method not allowed' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'Invalid JSON' }) };
  }

  // Validate input
  const validationErrors = validateLead(body);
  if (validationErrors.length > 0) {
    return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: validationErrors[0] }) };
  }

  // Normalize: prefer `name`, fall back to legacy `fullName`
  const rawName = (body.name || body.fullName || '').trim();
  const rawPhone = String(body.phone || '').replace(/\D/g, '');

  // Soft value mapping per service — must match client serviceToValue()
  const serviceToValue = (service) => {
    const s = String(service || '').toLowerCase();
    if (s.includes('replacement') || s.includes('installation')) return 250;
    if (s.includes('repair')) return 75;
    if (s.includes('membership') || s.includes('air care')) return 60;
    if (s.includes('tune')) return 25;
    if (s.includes('iaq') || s.includes('air quality')) return 40;
    return 25;
  };

  const lead = {
    fullName: escapeHtml(rawName),
    name: escapeHtml(rawName),
    phone: escapeHtml(rawPhone),
    zip: escapeHtml(String(body.zip || '').trim()),
    email: escapeHtml(body.email?.trim() || ''),
    service: escapeHtml(body.service?.trim() || 'Not specified'),
    message: escapeHtml(body.message?.trim() || ''),
    source: escapeHtml(body.source?.trim() || 'Website'),
    homeType: escapeHtml(body.homeType?.trim() || ''),
    systemType: escapeHtml(body.systemType?.trim() || ''),
    issue: escapeHtml(body.issue?.trim() || ''),
    timeline: escapeHtml(body.timeline?.trim() || ''),
    timestamp: new Date().toISOString(),
    ip: event.headers['x-forwarded-for'] || 'unknown',
    // Tracking context from client (for Meta CAPI dedup + attribution)
    eventId: String(body.event_id || '').trim(),
    eventSourceUrl: String(body.event_source_url || event.headers.referer || 'https://soligoair.shop').trim(),
    fbp: String(body.fbp || '').trim(),
    fbc: String(body.fbc || '').trim(),
    value: serviceToValue(body.service)
  };

  const results = { ghl: false, email: false, meta: false };

  try {
    // ─── Phase 1: GoHighLevel Webhook ───────────────────────────────
    if (process.env.GHL_WEBHOOK_URL) {
      try {
        const ghlRes = await fetch(process.env.GHL_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            first_name: lead.name.split(' ')[0],
            last_name: lead.name.split(' ').slice(1).join(' ') || '',
            phone: lead.phone,
            email: lead.email,
            postal_code: lead.zip,
            custom_fields: {
              service: lead.service,
              zip: lead.zip,
              issue: lead.issue,
              system_type: lead.systemType,
              home_type: lead.homeType,
              timeline: lead.timeline,
              message: lead.message,
              source: lead.source
            }
          })
        });
        results.ghl = ghlRes.ok;
      } catch (err) {
        console.error('GHL error:', err.message);
      }
    }

    // ─── Phase 1: Resend Email Notification ─────────────────────────
    if (process.env.RESEND_API_KEY && process.env.NOTIFY_EMAIL) {
      try {
        const emailRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: process.env.FROM_EMAIL || 'leads@soligoair.shop',
            to: [process.env.NOTIFY_EMAIL],
            subject: `🔥 New Lead: ${lead.name} — ${lead.service}`,
            html: `
              <h2>New Lead from soligoair.shop</h2>
              <table>
                <tr><td><strong>Name:</strong></td><td>${lead.name}</td></tr>
                <tr><td><strong>Phone:</strong></td><td>${lead.phone}</td></tr>
                <tr><td><strong>ZIP:</strong></td><td>${lead.zip || 'Not provided'}</td></tr>
                <tr><td><strong>Email:</strong></td><td>${lead.email || 'Not provided'}</td></tr>
                <tr><td><strong>Service:</strong></td><td>${lead.service}</td></tr>
                ${lead.issue ? `<tr><td><strong>Issue:</strong></td><td>${lead.issue}</td></tr>` : ''}
                ${lead.systemType ? `<tr><td><strong>System Type:</strong></td><td>${lead.systemType}</td></tr>` : ''}
                ${lead.homeType ? `<tr><td><strong>Home Type:</strong></td><td>${lead.homeType}</td></tr>` : ''}
                ${lead.timeline ? `<tr><td><strong>Timeline:</strong></td><td>${lead.timeline}</td></tr>` : ''}
                <tr><td><strong>Message:</strong></td><td>${lead.message || 'None'}</td></tr>
                <tr><td><strong>Source:</strong></td><td>${lead.source}</td></tr>
                <tr><td><strong>Time:</strong></td><td>${lead.timestamp}</td></tr>
              </table>
            `
          })
        });
        results.email = emailRes.ok;
      } catch (err) {
        console.error('Resend error:', err.message);
      }
    }

    // ─── Phase 1: Meta Conversions API ──────────────────────────────
    if (process.env.META_PIXEL_ID && process.env.META_CAPI_TOKEN) {
      try {
        const crypto = await import('crypto');
        const sha256 = (v) => crypto.createHash('sha256').update(String(v).trim().toLowerCase()).digest('hex');

        const phoneDigits = lead.phone.replace(/\D/g, '');
        const hashPhone = phoneDigits ? sha256(phoneDigits) : null;
        const hashEmail = lead.email ? sha256(lead.email) : null;
        const [firstName, ...rest] = lead.name.split(' ');
        const lastName = rest.join(' ');
        const hashFn = firstName ? sha256(firstName) : null;
        const hashLn = lastName ? sha256(lastName) : null;
        const hashZip = lead.zip ? sha256(lead.zip) : null;

        const userData = {
          client_ip_address: lead.ip,
          client_user_agent: event.headers['user-agent'] || ''
        };
        if (hashPhone) userData.ph = [hashPhone];
        if (hashEmail) userData.em = [hashEmail];
        if (hashFn) userData.fn = [hashFn];
        if (hashLn) userData.ln = [hashLn];
        if (hashZip) userData.zp = [hashZip];
        if (lead.fbp) userData.fbp = lead.fbp;
        if (lead.fbc) userData.fbc = lead.fbc;

        const capiEvent = {
          event_name: 'Lead',
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'website',
          event_source_url: lead.eventSourceUrl,
          user_data: userData,
          custom_data: {
            content_name: lead.service,
            content_category: lead.source,
            currency: 'USD',
            value: lead.value
          }
        };
        if (lead.eventId) capiEvent.event_id = lead.eventId;

        const capiRes = await fetch(`https://graph.facebook.com/v19.0/${process.env.META_PIXEL_ID}/events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: [capiEvent],
            ...(process.env.META_TEST_EVENT_CODE && { test_event_code: process.env.META_TEST_EVENT_CODE }),
            access_token: process.env.META_CAPI_TOKEN
          })
        });
        results.meta = capiRes.ok;
        if (!capiRes.ok) {
          const errBody = await capiRes.text();
          console.error('Meta CAPI non-2xx:', capiRes.status, errBody);
        }
      } catch (err) {
        console.error('Meta CAPI error:', err.message);
      }
    }

    // ─── Phase 2 hooks (uncomment when ready) ───────────────────────
    // await sendSmsConfirmation(lead);     // Twilio
    // await createBooking(lead);           // Calendly
    // await enrichCrmContact(lead);        // GHL API (not webhook)
    // await trackConversion(lead);         // Google Ads

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, message: 'Thank you! A specialist will contact you shortly.' })
    };

  } catch (err) {
    console.error('submit-lead fatal error:', err.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, message: 'Something went wrong. Please call us directly at (321) 384-7868.' })
    };
  }
};
