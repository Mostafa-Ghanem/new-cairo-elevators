/* Shared lead handling (static site, no backend):
   1) every lead form is saved as a row in the Google Sheet CRM (Apps Script web app, see docs/google-sheets-crm.md);
   2) the visitor lands on thank-you.html, which offers the same lead as a ready WhatsApp message;
   3) WhatsApp / call button clicks are logged to the same sheet. */
(function () {
  var WHATSAPP = '201276611628';
  var script = document.currentScript || document.querySelector('script[data-sheet-endpoint]');
  var ENDPOINT = (script && script.getAttribute('data-sheet-endpoint')) || '';

  function utm() {
    var params = new URLSearchParams(window.location.search);
    var out = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'].forEach(function (key) {
      var value = params.get(key);
      if (value) out[key] = value;
    });
    return out;
  }

  function send(payload) {
    if (!ENDPOINT) return;
    var body = new URLSearchParams(Object.assign({
      page: window.location.pathname,
      page_title: document.title,
      referrer: document.referrer
    }, utm(), payload));
    try {
      if (navigator.sendBeacon && navigator.sendBeacon(ENDPOINT, body)) return;
    } catch (e) { /* fall through to fetch */ }
    fetch(ENDPOINT, { method: 'POST', mode: 'no-cors', body: body, keepalive: true }).catch(function () {});
  }

  function labelFor(field, form) {
    if (field.id) {
      var l = form.querySelector('label[for="' + field.id + '"]');
      if (l) return l.textContent.replace(/—.*$/, '').trim();
    }
    var wrap = field.closest('.field');
    var label = wrap && wrap.querySelector('label');
    return label ? label.textContent.replace(/—.*$/, '').trim() : (field.placeholder || field.name || '');
  }

  function kind(label) {
    if (/اسم/.test(label)) return 'name';
    if (/موبايل|هاتف|تليفون|رقم/.test(label)) return 'phone';
    if (/منطقة|عنوان/.test(label)) return 'area';
    if (/ملاحظ|رسالة|تفاصيل/.test(label)) return 'notes';
    return '';
  }

  // Egyptian mobile: accepts Arabic-Indic digits, spaces, +20 / 0020 prefixes.
  function normalizePhone(value) {
    var digits = String(value || '').replace(/[٠-٩]/g, function (d) { return String(d.charCodeAt(0) - 1632); })
      .replace(/[۰-۹]/g, function (d) { return String(d.charCodeAt(0) - 1776); })
      .replace(/[^0-9]/g, '');
    if (digits.indexOf('0020') === 0) digits = digits.slice(4);
    else if (digits.indexOf('20') === 0 && digits.length === 12) digits = digits.slice(2);
    if (digits.length === 10 && digits.charAt(0) === '1') digits = '0' + digits;
    return digits;
  }

  function enhance(form) {
    form.querySelectorAll('input[type="tel"]').forEach(function (input) {
      input.setAttribute('autocomplete', 'tel');
      input.setAttribute('dir', 'ltr');
      input.addEventListener('input', function () { input.setCustomValidity(''); });
      input.addEventListener('blur', function () {
        if (input.value) input.value = normalizePhone(input.value);
      });
    });
    var first = form.querySelector('input[type="text"], input:not([type])');
    if (first && !first.hasAttribute('autocomplete')) first.setAttribute('autocomplete', 'name');
  }
  document.querySelectorAll('form[data-lead-form]').forEach(enhance);

  // Back button from thank-you.html restores the page from cache: re-enable the forms.
  window.addEventListener('pageshow', function () {
    document.querySelectorAll('form[data-lead-form] button[disabled]').forEach(function (button) {
      button.disabled = false;
      if (button.dataset.label) button.textContent = button.dataset.label;
    });
  });

  function validPhones(form) {
    var ok = true;
    form.querySelectorAll('input[type="tel"]').forEach(function (input) {
      if (!input.value) return;
      input.value = normalizePhone(input.value);
      if (!/^01[0125][0-9]{8}$/.test(input.value)) {
        input.setCustomValidity('اكتب رقم موبايل مصري صحيح من 11 رقمًا يبدأ بـ 010 أو 011 أو 012 أو 015');
        ok = false;
      }
    });
    return ok;
  }

  document.addEventListener('submit', function (event) {
    var form = event.target;
    if (!form.matches('form[data-lead-form]')) return;
    event.preventDefault();
    validPhones(form);
    if (!form.reportValidity()) return;
    var button = form.querySelector('button[type="submit"], button:not([type])');
    if (button && button.disabled) return;

    var lines = ['طلب معاينة من الموقع — ' + document.title];
    var lead = { type: 'form' };
    var details = [];
    form.querySelectorAll('input, select, textarea').forEach(function (field) {
      var value = (field.value || '').trim();
      if (!value || field.type === 'hidden') return;
      var label = labelFor(field, form);
      lines.push(label + ': ' + value);
      var key = kind(label);
      if (key && !lead[key]) lead[key] = value; else details.push(label + ': ' + value);
    });
    lead.details = details.join(' | ');
    send(lead);

    var url = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(lines.join('\n'));
    try { sessionStorage.setItem('nce_lead_whatsapp', url); } catch (e) { /* thank-you page falls back to a generic message */ }
    var status = form.querySelector('[data-form-status]');
    if (status) status.textContent = 'تمام، بنبعت طلبك…';
    if (button) { button.dataset.label = button.dataset.label || button.textContent; button.disabled = true; button.textContent = 'جاري الإرسال…'; }
    // Give the Sheets beacon a moment, then show the thank-you page (conversion page for ads).
    setTimeout(function () { window.location.href = 'thank-you.html'; }, 250);
  });

  document.addEventListener('click', function (event) {
    var link = event.target.closest && event.target.closest('a[href^="https://wa.me/"], a[href^="tel:"]');
    if (!link || link.closest('form')) return;
    send({ type: link.href.indexOf('tel:') === 0 ? 'call_click' : 'whatsapp_click', details: link.textContent.trim().slice(0, 80) });
  });
})();
