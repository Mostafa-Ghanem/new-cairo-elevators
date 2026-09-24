/* Shared lead handling (static site, no backend):
   1) every lead form is saved as a row in the Google Sheet CRM (Apps Script web app, see docs/google-sheets-crm.md);
   2) the same lead opens as a ready WhatsApp message;
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

  document.addEventListener('submit', function (event) {
    var form = event.target;
    if (!form.matches('form[data-lead-form]')) return;
    event.preventDefault();
    if (!form.reportValidity()) return;

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
    var status = form.querySelector('[data-form-status]');
    var win = window.open(url, '_blank', 'noopener');
    if (!win) window.location.href = url;
    if (status) status.textContent = 'تم استلام طلبك ✓ — وتم فتح واتساب لتأكيده، اضغط «إرسال» في المحادثة. أو اتصل بنا: 01060781020.';
    form.reset();
  });

  document.addEventListener('click', function (event) {
    var link = event.target.closest && event.target.closest('a[href^="https://wa.me/"], a[href^="tel:"]');
    if (!link || link.closest('form')) return;
    send({ type: link.href.indexOf('tel:') === 0 ? 'call_click' : 'whatsapp_click', details: link.textContent.trim().slice(0, 80) });
  });
})();
