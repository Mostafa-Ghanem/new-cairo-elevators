/* Shared lead-form handler: sends the filled form as a WhatsApp message (static site, no backend). */
(function () {
  var WHATSAPP = '201276611628';

  function labelFor(field, form) {
    if (field.id) {
      var l = form.querySelector('label[for="' + field.id + '"]');
      if (l) return l.textContent.trim();
    }
    var wrap = field.closest('.field');
    var label = wrap && wrap.querySelector('label');
    return label ? label.textContent.replace(/—.*$/, '').trim() : (field.placeholder || field.name || '');
  }

  document.addEventListener('submit', function (event) {
    var form = event.target;
    if (!form.matches('form[data-lead-form]')) return;
    event.preventDefault();
    if (!form.reportValidity()) return;

    var lines = ['طلب معاينة من الموقع — ' + document.title];
    form.querySelectorAll('input, select, textarea').forEach(function (field) {
      var value = (field.value || '').trim();
      if (value && field.type !== 'hidden') lines.push(labelFor(field, form) + ': ' + value);
    });

    var url = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(lines.join('\n'));
    var status = form.querySelector('[data-form-status]');
    var win = window.open(url, '_blank', 'noopener');
    if (!win) window.location.href = url;
    if (status) status.textContent = 'تم تجهيز طلبك على واتساب — اضغط «إرسال» في المحادثة لإتمامه، أو اتصل بنا على 01060781020.';
  });
})();
