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

    [nameInput, phoneInput, zipInput].forEach(clearFieldError);

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

    return ok;
  }

  function buildPayload(form) {
    function val(name) {
      var el = form.querySelector('[name="' + name + '"]');
      return el ? trim(el.value) : '';
    }

    return {
      name: val('name'),
      phone: digitsOnly(val('phone')),
      zip: val('zip'),
      email: val('email'),
      service: val('service'),
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

    // Live-clear errors as user types
    ['name', 'phone', 'zip'].forEach(function (n) {
      var el = form.querySelector('[name="' + n + '"]');
      if (el) el.addEventListener('input', function () { clearFieldError(el); });
    });

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
          var successMsg = form.getAttribute('data-success-message') ||
            "Thanks! We'll call you shortly.";
          setMessage(form, successMsg, 'success');
          if (btn) { btn.disabled = false; btn.textContent = defaultBtnText; }
          form.dataset.submitting = '0';
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
