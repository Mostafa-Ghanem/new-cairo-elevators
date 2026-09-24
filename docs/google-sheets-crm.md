# Google Sheets CRM + WhatsApp leads

كل نموذج على الموقع (`form[data-lead-form]`) يعمل عبر `assets/js/lead-form.js`:

1. يحفظ الطلب كسطر في Google Sheet (الاسم، الموبايل، المنطقة، الملاحظات، الصفحة، UTM / gclid / fbclid).
2. يفتح واتساب `201276611628` برسالة جاهزة بنفس البيانات.
3. يسجّل ضغطات أزرار واتساب والاتصال في نفس الشيت (`whatsapp_click` / `call_click`).

## التفعيل (مرة واحدة، مجاني)

1. أنشئ Google Sheet جديد باسم «CRM — القاهرة الجديدة للمصاعد».
2. Extensions → Apps Script، والصق محتوى `docs/google-sheets-crm.gs` ثم Save.
3. Deploy → New deployment → Web app — Execute as: **Me**، Who has access: **Anyone** → Deploy ووافق على الصلاحيات.
4. انسخ رابط `/exec` وضعه في `components/site-footer.html` داخل `data-sheet-endpoint="..."`.
5. `npm run check` ثم ادفع للـ`main`.

- يتم إنشاء تبويب `Leads` تلقائيًا بعناوين عربية، وعمود «الحالة» بقائمة (جديد / تم التواصل / معاينة محددة / عرض سعر / تم التعاقد / غير مهتم).
- يصل إيميل تنبيه لصاحب الشيت مع كل طلب جديد.
- لو `data-sheet-endpoint` فارغ، النماذج تستمر في إرسال الطلب على واتساب فقط.
