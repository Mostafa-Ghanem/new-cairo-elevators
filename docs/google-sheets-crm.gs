/**
 * New Cairo Elevators — Google Sheets CRM receiver.
 * Paste into Extensions → Apps Script of the CRM sheet, then Deploy → New deployment → Web app
 * (Execute as: Me, Who has access: Anyone). Put the /exec URL in components/site-footer.html
 * (data-sheet-endpoint on lead-form.js).
 */
var SHEET_NAME = 'Leads';
var HEADERS = ['التاريخ', 'النوع', 'الاسم', 'الموبايل', 'المنطقة', 'ملاحظات', 'تفاصيل أخرى', 'الصفحة', 'عنوان الصفحة',
  'المصدر (referrer)', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid', 'الحالة', 'متابعة'];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = getSheet_();
    var p = (e && e.parameter) || {};
    var clean = function (v) { v = String(v || '').slice(0, 1000); return /^[=+\-@]/.test(v) ? "'" + v : v; };
    sheet.appendRow([
      new Date(), clean(p.type), clean(p.name), clean(p.phone), clean(p.area), clean(p.notes), clean(p.details),
      clean(p.page), clean(p.page_title), clean(p.referrer), clean(p.utm_source), clean(p.utm_medium), clean(p.utm_campaign),
      clean(p.utm_term), clean(p.utm_content), clean(p.gclid), clean(p.fbclid), p.type === 'form' ? 'جديد' : '', ''
    ]);
    if (p.type === 'form') notify_(p);
    return ContentService.createTextOutput('ok');
  } finally {
    lock.releaseLock();
  }
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#0B1F33').setFontColor('#E9D8B4');
    sheet.setRightToLeft(true);
    var status = SpreadsheetApp.newDataValidation().requireValueInList(['جديد', 'تم التواصل', 'معاينة محددة', 'عرض سعر', 'تم التعاقد', 'غير مهتم']).build();
    sheet.getRange(2, 18, 5000, 1).setDataValidation(status);
  }
  return sheet;
}

// Optional email alert for every new form lead (to the sheet owner).
function notify_(p) {
  try {
    MailApp.sendEmail(Session.getEffectiveUser().getEmail(), 'طلب معاينة جديد — ' + (p.name || ''),
      'الاسم: ' + (p.name || '') + '\nالموبايل: ' + (p.phone || '') + '\nالمنطقة: ' + (p.area || '') +
      '\nملاحظات: ' + (p.notes || '') + '\nتفاصيل: ' + (p.details || '') + '\nالصفحة: ' + (p.page || ''));
  } catch (err) { /* email is optional */ }
}
