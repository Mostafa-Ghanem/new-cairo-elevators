# Changelog

كل تعديل فعلي على المشروع يجب توثيقه هنا في نفس الـcommit.

## 2026-09-25

### Changed — Unified Egyptian-colloquial tone
- إعادة صياغة النصوص الظاهرة في كل الصفحات والـheader/footer بالعامية المصرية المهذبة (العناوين والفقرات والأسئلة الشائعة والأزرار والنماذج ورسالة واتساب الافتتاحية). عنوان الصفحة و`meta description` باقيين بالفصحى لأجل SEO، و`privacy-policy.html` بقيت بالفصحى لأنها نص قانوني.
- إصلاح خطأ من تعديل سابق حوّل «المصعد الكهربائي» إلى «الكهرباءئي» في `electric-elevator.html`.

### Added — Thank-you page
- `thank-you.html` (noindex، مستبعدة من sitemap وrobots) بعد إرسال أي نموذج: تأكيد، زر «أكّد طلبك على واتساب» بالرسالة الجاهزة، الخطوات الجاية، وحدث تحويل `generate_lead` لـdataLayer/gtag وMeta `Lead`.
- `assets/js/lead-form.js` v1.3: يحفظ الطلب في Google Sheet ثم يحوّل لصفحة الشكر (بدل فتح واتساب مباشرة)، ويعيد تفعيل الزر عند الرجوع بزر Back.

## 2026-09-24

### Fixed — Arabic copy review (2026-09-24)
- تصحيح «مصعد كهربا» إلى «مصعد كهرباء» في العناوين والنصوص والـmeta (مع الإبقاء على المصطلح العامي بين «» مرة واحدة في `electric-elevator.html` لأغراض البحث).
- «اختار» → «اختر»، «ارسل» → «أرسل»، «لائمت» → «لاءمت»، «20+ عام خبرة» → «20+ عامًا من الخبرة»، وتوحيد «الكبينة» إلى «الكابينة».
- حذف نصوص داخلية كانت ظاهرة للزوار: «ملاحظة تنفيذية» في سياسة الخصوصية، «المناطق المذكورة من العميل» (FAQ ومناطق الخدمة)، «المرجع المؤكد للشركة»، «فورم مختصر مناسب للحملات الإعلانية»، «نفس المسار سيظهر في جميع صفحات المنتجات»، و«Premium Corporate · Alexandria Arabic UI» في الفوتر.
- تصحيح الدومين في سياسة الخصوصية إلى `newcairoelevators.com`، وتصحيح شريط الرئيسية من «5 حلول… درام، هوم ليفت» إلى الحلول الفعلية الثمانية.
- استبدال «Premium» داخل النص العربي بـ«فاخرة».

### Changed — Form & mobile UX
- `assets/js/lead-form.js` v1.2: تحقق من رقم الموبايل المصري برسالة عربية، قبول الأرقام العربية (٠١٠…) و+20، `autocomplete` للاسم والهاتف، ومنع الإرسال المزدوج مع حالة «تم الإرسال ✓».
- `assets/css/global.css`: روابط الفوتر على الموبايل بمساحة لمس 40px، وتحسين تباين نصوص الفوتر وتكبير سطر الحقوق إلى 12px.

### Changed — Local images only + WebP
- إزالة كل الصور المستضافة على مواقع خارجية (liftquotes, otis, gooecloud, archiexpo, liftronic, dhakaintbd, tle.com.vn, newcairoelevators.com/img) من كل الصفحات و`components/site-header.html` (Mega Menu)، واستبدالها بصور المنتجات المحلية المطابقة لكل منتج.
- تحويل صور المنتجات من PNG/JPG إلى WebP بنفس الأبعاد (quality 82): الحجم من ~15.3MB إلى ~2.2MB، مع حذف الأصول الثقيلة (موجودة في Git history).
- إضافة `loading="lazy"`/`decoding="async"` للصور غير الأولى، وتصحيح alt «مصعد كهربا».

### Added — Open Graph / Twitter / canonical
- `scripts/build.mjs` يحقن canonical وOpen Graph وTwitter Card لكل صفحة عامة من `<title>` و`meta description` الخاصة بها.
- صور مشاركة 1200×630: `assets/images/products/<slug>/og.jpg` لكل منتج و`assets/images/brand/og-default.jpg` لباقي الصفحات.
- فاحص الروابط في الـbuild يتجاهل الروابط المطلقة (`https:`).

### Changed — WhatsApp + Google Sheets CRM
- توحيد كل روابط واتساب (بما فيها `wa.me/message/...`) إلى `wa.me/201276611628` مع رسالة افتتاحية جاهزة.
- `assets/js/lead-form.js` v1.1: يحفظ كل طلب في Google Sheet (مع الصفحة وUTM وgclid/fbclid) ويفتح واتساب بنفس البيانات، ويسجّل ضغطات واتساب/الاتصال.
- إضافة `docs/google-sheets-crm.gs` (Apps Script) و`docs/google-sheets-crm.md` (خطوات التفعيل). الـendpoint يُضبط في `data-sheet-endpoint` داخل `components/site-footer.html`.

## 2026-09-23

### Fixed — UI/UX & site audit
- نماذج طلب المعاينة في 11 صفحة كانت «ديمو» ولا ترسل أي طلب (ضياع Leads): استبدال `onsubmit` الوهمي بـ`data-lead-form` ومعالج مشترك جديد `assets/js/lead-form.js` (محمّل من `components/site-footer.html`) يرسل بيانات النموذج كرسالة واتساب جاهزة مع رسالة حالة `aria-live`.
- ربط كل `<label>` بحقله (`for`/`id`) في نماذج الصفحات لتحسين الوصولية والضغط على العنوان في الموبايل.
- إصلاح روابط `href="#"` الميتة: Breadcrumb (الرئيسية / الخدمات) وكروت «منتجات أخرى» في صفحات المنتجات صارت تشير لصفحات حقيقية.
- حذف نص داخلي ظاهر للزوار «في النسخ التالية من التمبلت…» من صفحات المنتجات، وتصحيح «مصعد كهربا» إلى «مصعد كهرباء».
- إضافة `rel="noopener"` لكل روابط `target="_blank"`.
- تكبير رسالة حالة نموذج الرئيسية من 9px إلى 12px.

### Added — SEO basics
- `scripts/build.mjs` يولّد `dist/sitemap.xml` و`dist/robots.txt` (مع استبعاد الصفحات الداخلية).
- `noindex` لصفحتي `review-pages.html` و`design-system-preview.html` الداخليتين.

## 2026-09-21

### Added — Product media imported from Drive
- نقل صور وفيديوهات المنتجات من فولدر Google Drive المعتمد إلى مسارات الميديا المنظمة داخل `assets/images/products/` و`assets/videos/products/`.
- اعتماد أسماء صفحات الموقع المنشورة كمرجع للمجلدات: `gearless-elevator`, `gearbox-elevator`, `gearbox-automatic-doors`, `electric-elevator`, `hydraulic-panoramic-elevator`, `hospital-elevator`, `outdoor-elevator`, `elevator-maintenance`.
- ربط ملفات فولدر Drive «مصاعد بضائع» بمجلد `electric-elevator` وفق اسم صفحة الموقع الحالية، بدون إنشاء slug أو صفحة جديدة.
- إعادة تسمية الملفات بأسماء Web نظيفة (`hero`, `gallery-XX`, `overview`) مع الإبقاء على الملفات الأصلية من حيث المحتوى دون تعديل أو ضغط في هذه المرحلة.
- لم يتم بعد إدراج الصور أو الفيديوهات داخل HTML؛ هذه المرحلة تخص نقل وتنظيم الأصول فقط تمهيدًا لمرحلة دمج الميديا في الصفحات.
- اكتمل نقل الفيديوهات الأصلية بدون إعادة ضغط، وتم التحقق من SHA-256 لكل فيديو وتشغيل `npm run check` بنجاح قبل تثبيتها على `main`.
- حذف أداة الاستيراد المؤقتة بعد نجاح النقل؛ لا توجد Workflow دائمة مطلوبة لإدارة هذه الميديا.

## 2026-09-20

### Changed — New production brand logo
- اعتماد الشعار الجديد المرفوع بصيغة WebP كشعار الموقع الأساسي، وإعادة تسميته إلى `assets/images/brand/logo.webp` بدل اسم الملف الطويل المولّد تلقائيًا.
- تحديث الـShared Header والـShared Footer لاستخدام `logo.webp` مباشرة، مع الحفاظ على أبعاد الصورة الأصلية 1254×1254 ونفس الـresponsive styling الحالي.
- حذف الملف ذي الاسم المؤقت `ChatGPT Image Sep 20, 2026, 04_59_23 PM.webp` بعد نقله للاسم النهائي.

### Added — Product media upload folders
- إضافة مجلد مستقل للصور لكل صفحة منتج تحت `assets/images/products/<product-slug>/`.
- إضافة مجلد مستقل للفيديو لكل صفحة منتج تحت `assets/videos/products/<product-slug>/`.
- إضافة ملفات `.gitkeep` فقط للحفاظ على المجلدات الفارغة في Git حتى يتم رفع أصول المنتجات الفعلية.

### Changed — Brand logo in shared header/footer
- نقل ملف الشعار الأصلي من `assets/Logo.png` إلى `assets/images/brand/logo-source.png` لتنظيم أصول الهوية داخل مسار مخصص.
- إنشاء نسخة Web محسنة `assets/images/brand/logo.png` بمقاس 384×384 بدل تحميل الأصل 1254×1254 في كل صفحة؛ الحجم انخفض من نحو 1.52MB إلى نحو 192KB.
- استبدال أيقونة الـplaceholder في `components/site-header.html` و`components/site-footer.html` بالشعار الفعلي مع الحفاظ على اسم الشركة النصي وAccessible label.
- ضبط عرض الشعار كعلامة دائرية Responsive من خلال `assets/css/global.css` بدون CSS خاص داخل الصفحات.

## 2026-09-14

### Fixed — Mobile Elevators full-row trigger
- إزالة CSS/JS القديم الخاص بـ`.mobile-menu` من صفحات الموقع؛ كان selector عام مثل `.mobile-menu summary` يفرض `46px × 46px` وborder/radius على `summary` الداخلي الخاص بـ«المصاعد».
- نقل ملكية سلوك وشكل الـMobile Navigation بالكامل للـShared Header/`global.css`/`site-navigation.js` لمنع تعارضات الصفحات.
- تحويل صف «المصاعد» إلى `mobile-products-trigger` بعرض 100%؛ الكلمة والفراغ وعلامة `+` كلها داخل نفس الـ`summary` وبالتالي كامل الصف Click/Tap target واحد.
- إزالة الـboxed shape من حاوية «المصاعد»، مع إبقاء حالة open/focus واضحة بدون حدود زائدة.
- توثيق Shared Shell ownership invariant في `docs/ARCHITECTURE.md` و`AGENTS.md`.

### Fixed — Mega Menu Preview + Responsive QA
- إصلاح السبب الفعلي لقص الـLive Preview: `white-space: nowrap` الموروث من الـDesktop navigation كان يفرض min-content أعرض من عمود الـPreview ويجعل المحتوى الداخلي ~746px داخل Card بعرض ~340px.
- جعل الـMega Menu يعيد `white-space: normal`، وتقييد Grid track والـchildren بـ`min-width: 0` حتى الصورة والنص والأزرار تحترم عرض الـCard.
- ضبط صورة الـPreview بنسبة `16:9` مع `object-fit: cover` و`object-position: center` بدل صف ثابت قد يسبب crop غير متوازن.
- إزالة الـdefault image zoom الذي كان يضيف ~2px إلى `scrollWidth` داخل الـPreview؛ التكبير البسيط أصبح فقط أثناء انتقال الصورة.
- زيادة عمود الـPreview إلى 360px على الشاشات الواسعة و340px في نطاق 1181–1260px للحفاظ على توازن القائمة.
- جعل زري الـPreview عمودين متساويين ومنع النصوص من الخروج أو القص.
- تحسين Header على الشاشات الصغيرة لمنع اسم البراند من الضغط على زر القائمة، مع الحفاظ على Mobile Accordion مستقل عن Desktop Mega Menu.

### Fixed — Header clean rebuild
- إعادة بناء CSS الخاص بالـHeader وMega Menu بالكامل بدل إضافة overrides فوق النسخة المكسورة.
- إصلاح سبب فساد الواجهة: إزالة محارف `\n` الحرفية التي دخلت داخل بلوك Option C وأفسدت Parsing للـCSS.
- إزالة سهم/pseudo-element أعلى الـMega Menu نهائيًا لتجنب أي artifact بصري.
- تثبيت الـMega Menu على عرض `header-inner` بالكامل بدل حسابات translate/centering الهشة.
- فصل سلوك Desktop عن Mobile بوضوح: Mega Menu + Live Preview على Desktop، وAccordion مستقل على Mobile.
- تبسيط JavaScript وإزالة تعارض `focus-within`/`focusin` الذي كان يمكن أن يعيد فتح القائمة بعد `Escape`.
- الحفاظ على Alexandria وRTL وPremium Corporate/Navy & Champagne وفق Design System المشروع.
- الملفات المتأثرة: `assets/css/global.css`, `assets/js/site-navigation.js`.

### Changed — Mega Menu Option C
- استبدال Mega Menu المكتظة بنسخة **Option C**: قائمة منتجات من عمودين مع Preview كبير ديناميكي للصورة والعنوان والوصف ورابط التفاصيل.
- الـPreview يتغير على `hover` و`keyboard focus` مع preload للصورة وحالة fallback عند فشل التحميل.
- تحسين سلوك فتح القائمة على Desktop للـhover/click/focus ودعم `Escape` وclick-outside.
- إعادة ضبط Responsive Navigation: Mobile menu بعرض آمن، Grid من عمودين على التابلت وعمود واحد على الشاشات الصغيرة، بدون Preview معتمد على hover.
- مراجعة Typography حسب قواعد المشروع: `Alexandria` فقط، أوزان 400/500/600/700، RTL، وPremium Corporate / Navy & Champagne.
- الملفات المتأثرة: `components/site-header.html`, `assets/css/global.css`, `assets/js/site-navigation.js`.


### Added
- إضافة Mega Menu احترافية RTL لأنواع المصاعد، مع أيقونات ووصف مختصر وروابط مباشرة لكل صفحات المنتجات.
- إضافة نسخة Mobile Accordion للـMega Menu مع active states ودعم click / Escape / outside-click.
- إضافة `components/site-header.html` كمصدر واحد للـTopbar والـHeader والمنيو.
- إضافة `components/site-footer.html` كمصدر واحد للفوتر.
- إضافة `assets/js/site-navigation.js` لإدارة active navigation وسلوك القوائم.
- إضافة `scripts/build.mjs` لتجميع الـshared components داخل جميع صفحات HTML وقت الـbuild والتحقق من الروابط المحلية.
- إضافة `package.json` بأوامر `npm run build` و`npm run check`.
- إضافة `docs/ARCHITECTURE.md` لتوثيق المعمارية وخطة التحويل إلى Astro.
- إضافة `AGENTS.md` لفرض قواعد التطوير وتوثيق أي تعديل مستقبلي.

### Changed
- ربط الـHeader والـFooter بكل صفحات HTML الـ19 من مصدر مشترك بدل النسخ المكررة.
- إصلاح روابط الـBreadcrumb القديمة في صفحات المنتجات من `#` إلى الصفحات الفعلية.
- تحديث `README.md` من نموذج No-Build/GitHub Pages إلى Build-time Components/Cloudflare Pages.
- إضافة `dist/` و`node_modules/` و`.wrangler/` إلى `.gitignore`.

### Deployment
- Cloudflare Pages يجب أن يستخدم `npm run build` و`dist` كـoutput directory.
