/**
 * Soligo Air — Lead capture (v2)
 * POST /.netlify/functions/lead
 *
 * Validates payload, normalizes phone, forwards to GoHighLevel webhook.
 * Returns { ok: true } on success or { ok: false, error } on failure.
 *
 * Environment variables required:
 *   - GHL_WEBHOOK_URL  (private — never exposed to client)
 */

// Same CORS headers used on every response (preflight, success, error).
// Forms submit from the same site, so '*' is simple and safe — no
// credentials are sent and the function only accepts JSON POST.
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
  'Content-Type': 'application/json'
};

function respond(statusCode, body) {
  return {
    statusCode,
    headers: CORS_HEADERS,
    body: typeof body === 'string' ? body : JSON.stringify(body)
  };
}

function digitsOnly(v) {
  return String(v || '').replace(/\D/g, '');
}

function trim(v) {
  return String(v || '').trim();
}

function validate(body) {
  const name = trim(body.name);
  if (name.replace(/\s/g, '').length < 2) return 'Enter your full name.';

  const phone = digitsOnly(body.phone);
  if (phone.length !== 10) return 'Enter a valid 10-digit phone number.';

  const zip = trim(body.zip);
  if (!/^\d{5}$/.test(zip)) return 'Enter a valid 5-digit ZIP code.';

  if (!trim(body.service)) return 'Service is required.';
  if (!trim(body.source)) return 'Source is required.';

  return null;
}

exports.handler = async (event) => {
  // CORS preflight — always respond with headers, no body
  if (event.httpMethod === 'OPTIONS') {
    return respond(204, '');
  }

  if (event.httpMethod !== 'POST') {
    return respond(405, { ok: false, error: 'Method not allowed' });
  }

  if (!process.env.GHL_WEBHOOK_URL) {
    return respond(500, { ok: false, error: 'Server misconfigured' });
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return respond(400, { ok: false, error: 'Invalid JSON' });
  }

  const error = validate(body);
  if (error) {
    return respond(400, { ok: false, error });
  }

  // Build clean payload for GHL
  // GHL workflow maps "Services Needed" to {{inboundWebhookRequest.service_needed}},
  // so we always send both `service` and `service_needed` with the same canonical value.
  const canonicalService = trim(body.service) || trim(body.service_needed);

  const lead = {
    name: trim(body.name),
    phone: digitsOnly(body.phone),
    zip: trim(body.zip),
    email: trim(body.email),
    service: canonicalService,
    service_needed: canonicalService,
    source: trim(body.source),
    page_url: trim(body.page_url),
    utm_source: trim(body.utm_source),
    utm_medium: trim(body.utm_medium),
    utm_campaign: trim(body.utm_campaign),
    utm_content: trim(body.utm_content),
    utm_term: trim(body.utm_term),
    fbclid: trim(body.fbclid),
    gclid: trim(body.gclid),
    submitted_at: new Date().toISOString(),
    ip: event.headers['x-forwarded-for'] || '',
    user_agent: event.headers['user-agent'] || ''
  };

  // GHL convenience: split name into first/last
  const parts = lead.name.split(/\s+/);
  lead.first_name = parts[0] || '';
  lead.last_name = parts.slice(1).join(' ');

  try {
    const res = await fetch(process.env.GHL_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead)
    });

    if (!res.ok) {
      return respond(502, { ok: false, error: 'Lead service error' });
    }

    return respond(200, { ok: true });
  } catch (err) {
    return respond(500, { ok: false, error: 'Network error' });
  }
};
