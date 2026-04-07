/**
 * Soligo Air — Lead form handler (v2)
 *
 * Auto-attaches to any <form data-lead-form>.
 *
 * Required input names: name, phone, zip, service, source
 * Optional input names: email
 *
 * On submit:
 *   - Validates name (>=2 chars), phone (10 digits), zip (5 digits)
 *   - Captures page URL + UTM/click ID query params
 *   - POSTs to /.netlify/functions/lead
 *   - Fires Meta Lead event and Google Ads conversion on success
 *   - Shows inline message in [data-form-message]
 *   - Optional redirect via data-success-url on the form
 *
 * Optional form attributes:
 *   data-success-url="/thank-you"
 *   data-success-message="Thanks! We'll call you shortly."
 *
 * Vanilla JS, no dependencies. Safe on plain static HTML pages.
 */
(function () {
  'use strict';

  var ENDPOINT = '/.netlify/functions/lead';
  var GOOGLE_CONVERSION = 'AW-17179141807/SI3SCMmOyf8bEK_N0_8_';

  // Canonical service catalog — must match the <option> values in the form select.
  var SERVICE_OPTIONS = [
    'AC Installation',
    'AC Repair',
    'AC Replacement',
    'Mini Split Installation',
    'Heat Pump Installation',
    'Indoor Air Quality',
    'Ductwork / Airflow',
    'Maintenance'
  ];

  // Keyword → canonical service mapping.
  // Patterns are tested against a hyphen-padded normalized string so they
  // match equally well in plain values ("ac"), compound values ("ac-install"),
  // and ad-tracking strings ("utm_campaign=ac_orlando_install").
  // Order matters: more specific intent (install/repair/replace) is matched
  // before the bare "ac" keyword so "ac-install" → AC Installation, not AC.
  var KEYWORD_PATTERNS = [
    { pattern: /-(mini-?split|ductless)-/, value: 'Mini Split Installation' },
    { pattern: /-(heat-?pump)-/, value: 'Heat Pump Installation' },
    { pattern: /-(iaq|air-quality|indoor-air)-/, value: 'Indoor Air Quality' },
    { pattern: /-(ductwork|airflow|ducts|duct)-/, value: 'Ductwork / Airflow' },
    { pattern: /-(maintenance|tune-?up|tuneup)-/, value: 'Maintenance' },
    { pattern: /-(replacement|replace|change-?out)-/, value: 'AC Replacement' },
    { pattern: /-(repair|fix|no-cool|not-cooling|broken-ac)-/, value: 'AC Repair' },
    { pattern: /-(installation|install|new-ac|new-system|ac-install)-/, value: 'AC Installation' },
    { pattern: /-(ac|a-c|aircon|air-conditioner|hvac)-/, value: 'AC Installation' }
  ];

  // Normalize an arbitrary service hint (param value, ad name, attribute, etc.)
  // into a canonical SERVICE_OPTIONS value. Returns '' if no match.
  function normalizeService(value) {
    if (!value) return '';
    var raw = String(value).trim();
    if (!raw) return '';

    // Exact canonical match (case-insensitive)
    for (var i = 0; i < SERVICE_OPTIONS.length; i++) {
      if (raw.toLowerCase() === SERVICE_OPTIONS[i].toLowerCase()) return SERVICE_OPTIONS[i];
    }

    // Normalize separators: lowercase, treat _ . / \ space as hyphens
    var normalized = raw.toLowerCase().replace(/[_./\\\s]+/g, '-');
    // Pad with hyphens so word-boundary patterns work uniformly
    var padded = '-' + normalized + '-';

    for (var j = 0; j < KEYWORD_PATTERNS.length; j++) {
      if (KEYWORD_PATTERNS[j].pattern.test(padded)) {
        return KEYWORD_PATTERNS[j].value;
      }
    }

    return '';
  }

  // Resolve a service value using priority:
  // (a) ?service= query param
  // (b) ?utm_campaign= or ?ad_name= query param (if it contains a known keyword)
  // (c) data-service-default attribute on the form
  // (d) existing non-empty field value
  // (e) final fallback: 'AC Installation'
  function resolveDefaultService(form) {
    var fromQs = normalizeService(getQueryParam('service'));
    if (fromQs) return fromQs;

    var fromCampaign = normalizeService(getQueryParam('utm_campaign'));
    if (fromCampaign) return fromCampaign;

    var fromAdName = normalizeService(getQueryParam('ad_name'));
    if (fromAdName) return fromAdName;

    var fromAttr = normalizeService(form.getAttribute('data-service-default'));
    if (fromAttr) return fromAttr;

    var existing = form.querySelector('[name="service"]');
    if (existing && existing.value) {
      var fromExisting = normalizeService(existing.value);
      if (fromExisting) return fromExisting;
      // Existing value didn't normalize — accept it as-is if non-empty
      if (existing.value.trim()) return existing.value.trim();
    }

    return 'AC Installation';
  }

  var STYLE_ID = 'lead-form-styles';
  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent =
      '.lead-form-error{display:block;font-size:12px;color:#d93025;font-weight:600;margin-top:4px;line-height:1.3}' +
      '.lead-form-input--invalid{border-color:#d93025!important;box-shadow:0 0 0 3px rgba(217,48,37,.08)!important}' +
      '[data-form-message]{font-size:14px;line-height:1.5;margin-top:12px}' +
      '[data-form-message].is-success{color:#137333;font-weight:600}' +
      '[data-form-message].is-error{color:#d93025;font-weight:600}';
    document.head.appendChild(s);
  }

  function digitsOnly(v) {
    return String(v || '').replace(/\D/g, '');
  }

  function trim(v) {
    return String(v || '').trim();
  }

  function getQueryParam(key) {
    try {
      return new URLSearchParams(window.location.search).get(key) || '';
    } catch (e) {
      return '';
    }
  }

  function clearFieldError(input) {
    if (!input) return;
    input.classList.remove('lead-form-input--invalid');
    var next = input.nextElementSibling;
    if (next && next.classList && next.classList.contains('lead-form-error')) {
      next.remove();
    }
  }

  function showFieldError(input, message) {
    if (!input) return;
    clearFieldError(input);
    input.classList.add('lead-form-input--invalid');
    var err = document.createElement('div');
    err.className = 'lead-form-error';
    err.textContent = message;
    input.parentNode.insertBefore(err, input.nextSibling);
  }

  function setMessage(form, text, kind) {
    var msg = form.querySelector('[data-form-message]');
    if (!msg) return;
    msg.textContent = text;
    msg.classList.remove('is-success', 'is-error');
    if (kind) msg.classList.add('is-' + kind);
  }

  function fireMetaLead(service, source) {
    if (typeof window.fbq === 'function') {
      try {
        window.fbq('track', 'Lead', {
          content_name: service,
          lead_source: source
        });
      } catch (e) { /* swallow */ }
    }
  }

  function fireGoogleConversion() {
    if (typeof window.gtag === 'function') {
      try {
        window.gtag('event', 'conversion', {
          send_to: GOOGLE_CONVERSION,
          value: 1.0,
          currency: 'USD'
        });
      } catch (e) { /* swallow */ }
    }
  }

  function validate(form) {
    var nameInput = form.querySelector('[name="name"]');
    var phoneInput = form.querySelector('[name="phone"]');
    var zipInput = form.querySelector('[name="zip"]');
    var serviceInput = form.querySelector('[name="service"]');

    [nameInput, phoneInput, zipInput, serviceInput].forEach(clearFieldError);

    var ok = true;

    if (!nameInput || trim(nameInput.value).replace(/\s/g, '').length < 2) {
      showFieldError(nameInput, 'Enter your full name.');
      ok = false;
    }

    if (!phoneInput || digitsOnly(phoneInput.value).length !== 10) {
      showFieldError(phoneInput, 'Enter a valid 10-digit phone number.');
      ok = false;
    }

    if (!zipInput || !/^\d{5}$/.test(trim(zipInput.value))) {
      showFieldError(zipInput, 'Enter a valid 5-digit ZIP code.');
      ok = false;
    }

    // Service is required. Hidden inputs skip the visible error UI.
    if (!serviceInput || !trim(serviceInput.value)) {
      if (serviceInput && serviceInput.type !== 'hidden') {
        showFieldError(serviceInput, 'Please choose a service.');
      }
      ok = false;
    }

    return ok;
  }

  function buildPayload(form) {
    function val(name) {
      var el = form.querySelector('[name="' + name + '"]');
      return el ? trim(el.value) : '';
    }

    // Hard safety net: service must never be blank in the payload.
    // Fall back to data-service-default, then "AC Installation".
    var serviceValue = val('service');
    if (!serviceValue) {
      serviceValue = trim(form.getAttribute('data-service-default')) || 'AC Installation';
    }

    return {
      name: val('name'),
      phone: digitsOnly(val('phone')),
      zip: val('zip'),
      email: val('email'),
      service: serviceValue,
      source: val('source'),
      page_url: window.location.href,
      utm_source: getQueryParam('utm_source'),
      utm_medium: getQueryParam('utm_medium'),
      utm_campaign: getQueryParam('utm_campaign'),
      utm_content: getQueryParam('utm_content'),
      utm_term: getQueryParam('utm_term'),
      fbclid: getQueryParam('fbclid'),
      gclid: getQueryParam('gclid')
    };
  }

  function initForm(form) {
    if (form.dataset.leadFormBound === '1') return;
    form.dataset.leadFormBound = '1';

    var btn = form.querySelector('button[type="submit"], [type="submit"]');
    var defaultBtnText = btn ? btn.textContent : '';

    // Smart service auto-selection (visible select or hidden input)
    var serviceField = form.querySelector('[name="service"]');
    if (serviceField) {
      var defaultService = resolveDefaultService(form);
      if (defaultService) {
        if (serviceField.tagName === 'SELECT') {
          // Only set if option exists in the select
          var hasOption = false;
          for (var i = 0; i < serviceField.options.length; i++) {
            if (serviceField.options[i].value === defaultService) {
              hasOption = true;
              break;
            }
          }
          if (hasOption) serviceField.value = defaultService;
        } else {
          serviceField.value = defaultService;
        }
      }
    }

    // Live-clear errors as user types
    ['name', 'phone', 'zip'].forEach(function (n) {
      var el = form.querySelector('[name="' + n + '"]');
      if (el) el.addEventListener('input', function () { clearFieldError(el); });
    });
    if (serviceField && serviceField.tagName === 'SELECT') {
      serviceField.addEventListener('change', function () { clearFieldError(serviceField); });
    }

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (form.dataset.submitting === '1') return;

      if (!validate(form)) {
        var firstInvalid = form.querySelector('.lead-form-input--invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      form.dataset.submitting = '1';
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
      setMessage(form, '', null);

      var payload = buildPayload(form);

      try {
        var res = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        var json = await res.json();

        if (res.ok && json.ok) {
          // Fire tracking pixels
          fireMetaLead(payload.service, payload.source);
          fireGoogleConversion();

          // Optional redirect
          var redirect = form.getAttribute('data-success-url');
          if (redirect) {
            window.location.href = redirect;
            return;
          }

          // Inline success
          // NEW: restore button + submitting flag for inline success
          if (btn) {
            btn.disabled = false;
            btn.textContent = defaultBtnText;
          }
          form.dataset.submitting = '0';

          var successMsg = form.getAttribute('data-success-message') ||
            "Thanks! We'll call you shortly.";
          setMessage(form, successMsg, 'success');
          form.reset();
        } else {
          var errMsg = (json && json.error) || 'Something went wrong. Please call (321) 384-7868.';
          setMessage(form, errMsg, 'error');
          if (btn) { btn.disabled = false; btn.textContent = defaultBtnText; }
          form.dataset.submitting = '0';
        }
      } catch (err) {
        setMessage(form, 'Network error. Please call (321) 384-7868.', 'error');
        if (btn) { btn.disabled = false; btn.textContent = defaultBtnText; }
        form.dataset.submitting = '0';
      }
    });
  }

  function init() {
    injectStyles();
    document.querySelectorAll('form[data-lead-form]').forEach(initForm);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
