# Changelog

كل تعديل فعلي على المشروع يجب توثيقه هنا في نفس الـcommit.

## 2026-09-20

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
