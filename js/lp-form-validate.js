/**
 * Soligo Air — Shared Lead Form Validator
 * Used on all lp-meta-* paid funnel pages.
 *
 * Auto-initializes any <form data-lp-form data-source="..."> on the page.
 *
 * Required fields: name (≥2 chars trimmed), phone (exactly 10 digits after strip), zip (5 digits), service.
 *
 * On submit: builds normalized payload { name, phone, zip, service, source, ...rest }
 * and POSTs to /.netlify/functions/submit-lead.
 *
 * Error display: injects <div class="lp-form-error"> below each invalid input.
 * Styles are auto-injected on first init.
 */
(function () {
  'use strict';

  var STYLE_ID = 'lp-form-validate-styles';
  var ENDPOINT = '/.netlify/functions/submit-lead';

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent =
      '.lp-form-error{font-size:12px;color:#d93025;font-weight:600;margin-top:-4px;padding:0 2px;line-height:1.3}' +
      '.lp-input.lp-input--invalid{border-color:#d93025!important;box-shadow:0 0 0 3px rgba(217,48,37,.08)!important}';
    document.head.appendChild(style);
  }

  function digitsOnly(str) {
    return String(str || '').replace(/\D/g, '');
  }

  function clearError(input) {
    input.classList.remove('lp-input--invalid');
    var next = input.nextElementSibling;
    if (next && next.classList && next.classList.contains('lp-form-error')) {
      next.remove();
    }
  }

  function showError(input, message) {
    clearError(input);
    input.classList.add('lp-input--invalid');
    var err = document.createElement('div');
    err.className = 'lp-form-error';
    err.textContent = message;
    input.parentNode.insertBefore(err, input.nextSibling);
  }

  function validateForm(form) {
    var errors = [];
    var nameInput = form.querySelector('[name="name"]') || form.querySelector('[name="fullName"]');
    var phoneInput = form.querySelector('[name="phone"]');
    var zipInput = form.querySelector('[name="zip"]');
    var serviceInput = form.querySelector('[name="service"]');

    [nameInput, phoneInput, zipInput].forEach(function (i) { if (i) clearError(i); });

    if (!nameInput || nameInput.value.trim().length < 2) {
      showError(nameInput, 'Enter your full name.');
      errors.push('name');
    }

    if (!phoneInput || digitsOnly(phoneInput.value).length !== 10) {
      showError(phoneInput, 'Enter a valid 10-digit phone number.');
      errors.push('phone');
    }

    if (!zipInput || !/^\d{5}$/.test(zipInput.value.trim())) {
      showError(zipInput, 'Enter a valid 5-digit ZIP code.');
      errors.push('zip');
    }

    if (!serviceInput || !serviceInput.value.trim()) {
      // Service must always exist (hidden on single-purpose, select on multi)
      errors.push('service');
    }

    return errors;
  }

  function buildPayload(form) {
    var data = {};
    var fd = new FormData(form);
    fd.forEach(function (value, key) { data[key] = value; });

    // Normalize: prefer name, fallback to fullName
    data.name = (data.name || data.fullName || '').trim();
    delete data.fullName;

    // Normalize phone to digits-only
    data.phone = digitsOnly(data.phone);

    // Trim ZIP
    if (data.zip) data.zip = data.zip.trim();

    // Source from data-source attribute on form
    data.source = form.getAttribute('data-source') || data.source || 'unknown';

    // Service is required — fallback to data-service attr if needed
    if (!data.service) data.service = form.getAttribute('data-service') || 'Not specified';

    return data;
  }

  function showSuccess(form, message) {
    form.innerHTML =
      '<div style="text-align:center;padding:32px 0;">' +
      '<div style="font-size:48px;margin-bottom:12px">✓</div>' +
      '<div style="color:#002C6D;font-weight:800;font-size:18px;margin-bottom:6px">Got it!</div>' +
      '<div style="color:#8a96aa;font-size:14px">' + message + '</div>' +
      '</div>';
    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function initForm(form) {
    var btn = form.querySelector('button[type="submit"]');
    var defaultBtnText = btn ? btn.textContent : '';
    var successMsg = form.getAttribute('data-success') || "We'll call you in the next few minutes.";

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var errors = validateForm(form);
      if (errors.length > 0) {
        // Focus the first invalid field
        var firstInvalid = form.querySelector('.lp-input--invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      if (btn) { btn.disabled = true; btn.textContent = 'Sending\u2026'; }

      var payload = buildPayload(form);

      try {
        var res = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        var json = await res.json();
        if (json.success) {
          showSuccess(form, successMsg);
        } else {
          throw new Error(json.message || 'Submission failed');
        }
      } catch (err) {
        if (btn) { btn.disabled = false; btn.textContent = defaultBtnText; }
        alert('Something went wrong. Please call us at (321) 384-7868.');
      }
    });

    // Live-clear errors as user types
    ['name', 'fullName', 'phone', 'zip'].forEach(function (n) {
      var el = form.querySelector('[name="' + n + '"]');
      if (el) el.addEventListener('input', function () { clearError(el); });
    });
  }

  function init() {
    injectStyles();
    var forms = document.querySelectorAll('form[data-lp-form]');
    forms.forEach(initForm);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
