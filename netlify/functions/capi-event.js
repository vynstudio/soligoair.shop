/**
 * Soligo Air — Generic Meta CAPI Relay
 * Netlify serverless function
 *
 * Receives mid/bottom-funnel events from GoHighLevel workflows (Schedule,
 * Purchase, InitiateCheckout) and forwards them to the Meta Conversions API.
 *
 * Browser-side Lead events are deduped via the matching `event_id` that was
 * stored on the GHL contact at lead-creation time.
 *
 * Auth: shared secret in `CAPI_RELAY_SECRET` env var, sent by GHL as
 * `x-capi-secret` header.
 *
 * Required env vars:
 *   META_PIXEL_ID         — same pixel ID as the browser tag
 *   META_CAPI_TOKEN       — Conversions API access token
 *   CAPI_RELAY_SECRET     — shared secret to authenticate GHL → this fn
 *   META_TEST_EVENT_CODE  — (optional) test_event_code for Events Manager testing
 */

const ALLOWED_EVENTS = new Set([
  'Lead',
  'Schedule',
  'Purchase',
  'InitiateCheckout',
  'CompleteRegistration'
]);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-capi-secret',
  'Content-Type': 'application/json'
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ success: false, message: 'Method not allowed' }) };
  }

  // Shared-secret auth (GHL workflows send this header)
  const providedSecret = event.headers['x-capi-secret'] || event.headers['X-Capi-Secret'];
  if (!process.env.CAPI_RELAY_SECRET || providedSecret !== process.env.CAPI_RELAY_SECRET) {
    return { statusCode: 401, headers: corsHeaders, body: JSON.stringify({ success: false, message: 'Unauthorized' }) };
  }

  if (!process.env.META_PIXEL_ID || !process.env.META_CAPI_TOKEN) {
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ success: false, message: 'CAPI not configured' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ success: false, message: 'Invalid JSON' }) };
  }

  const eventName = String(body.event_name || '').trim();
  if (!ALLOWED_EVENTS.has(eventName)) {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ success: false, message: `event_name must be one of: ${[...ALLOWED_EVENTS].join(', ')}` }) };
  }

  const crypto = await import('crypto');
  const sha256 = (v) => crypto.createHash('sha256').update(String(v).trim().toLowerCase()).digest('hex');
  const digitsOnly = (v) => String(v || '').replace(/\D/g, '');

  // Build user_data with hashed identifiers (Meta requires SHA-256)
  const userData = {};

  const phone = digitsOnly(body.phone);
  if (phone) userData.ph = [sha256(phone)];

  if (body.email) userData.em = [sha256(body.email)];
  if (body.first_name) userData.fn = [sha256(body.first_name)];
  if (body.last_name) userData.ln = [sha256(body.last_name)];
  if (body.zip) userData.zp = [sha256(String(body.zip).trim())];
  if (body.city) userData.ct = [sha256(body.city)];
  if (body.state) userData.st = [sha256(body.state)];
  if (body.country) userData.country = [sha256(body.country)];

  // Click attribution — must come from the original page-side cookies stored
  // on the GHL contact when the lead was created
  if (body.fbp) userData.fbp = String(body.fbp);
  if (body.fbc) userData.fbc = String(body.fbc);

  // Server-side events have no IP/UA — that's fine, dedup is by event_id
  if (body.client_ip_address) userData.client_ip_address = String(body.client_ip_address);
  if (body.client_user_agent) userData.client_user_agent = String(body.client_user_agent);

  if (Object.keys(userData).length === 0) {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ success: false, message: 'At least one user identifier (phone/email/etc) is required' }) };
  }

  const customData = {
    currency: body.currency || 'USD'
  };
  if (body.value !== undefined && body.value !== null && body.value !== '') {
    customData.value = Number(body.value) || 0;
  }
  if (body.service) customData.content_name = String(body.service);
  if (body.source) customData.content_category = String(body.source);
  if (body.order_id) customData.order_id = String(body.order_id);

  const capiEvent = {
    event_name: eventName,
    event_time: body.event_time ? Number(body.event_time) : Math.floor(Date.now() / 1000),
    action_source: 'website',
    event_source_url: body.event_source_url || 'https://soligoair.shop',
    user_data: userData,
    custom_data: customData
  };
  if (body.event_id) capiEvent.event_id = String(body.event_id);

  try {
    const capiRes = await fetch(`https://graph.facebook.com/v19.0/${process.env.META_PIXEL_ID}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [capiEvent],
        ...(process.env.META_TEST_EVENT_CODE && { test_event_code: process.env.META_TEST_EVENT_CODE }),
        access_token: process.env.META_CAPI_TOKEN
      })
    });

    const responseBody = await capiRes.text();
    if (!capiRes.ok) {
      console.error('Meta CAPI relay non-2xx:', capiRes.status, responseBody);
      return {
        statusCode: 502,
        headers: corsHeaders,
        body: JSON.stringify({ success: false, status: capiRes.status, error: responseBody })
      };
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ success: true, event: eventName, response: JSON.parse(responseBody) })
    };
  } catch (err) {
    console.error('Meta CAPI relay error:', err.message);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, message: err.message })
    };
  }
};
