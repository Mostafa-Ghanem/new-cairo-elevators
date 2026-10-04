# Changelog

كل تعديل فعلي على المشروع يجب توثيقه هنا في نفس الـcommit.

## 2026-10-04 — Electric elevator image

### Changed
- صورة المصعد الكهرباء (`public/assets/images/products/electric-elevator/hero.*` و`hero-720.*` و`og.jpg`) كانت مصعد بضائع؛ اتبدلت بصورة باب مصعد ركاب من صاحب المشروع. بتظهر في كارت الرئيسية والخدمات والهيرو وقسم «عن المصعد» والـMega Menu. AVIF والنسخ الصغيرة والـLQIP اتولدوا بـ`npm run images`. الفيديو (poster بضائع) لسه زي ما هو لحد قرار.

## 2026-10-03 — Content fixes

### Fixed
- تصحيح typo «مصعد كهرباءء» → «مصعد كهرباء» (breadcrumb وkicker وalt) في `src/content/products/electric-elevator.json` و`index.astro` و`services.astro`.
- `SiteHeader.astro`: صورة المعاينة الافتراضية في الـMega Menu كانت صورة الصيانة والعنوان/الـalt «مصعد جيرلس»؛ بقت صورة الجيرلس (`gallery-01-720.webp`) زي `data-preview-image` بتاع العنصر النشط. visual-diff: الفرق الوحيد نص صفحة المصعد الكهرباء.

## 2026-10-03 — Favicon

### Added
- أيقونة الموقع في التاب (favicon) من لوجو الشركة: `public/favicon.ico` و`favicon-32.png` و`apple-touch-icon.png` (180px لشاشة الآيفون الرئيسية)، بتتولد بـ`npm run favicons` (`scripts/make-favicons.mjs` من `logo-source.png`). الروابط في `BaseLayout.astro` فبتظهر في كل الصفحات، وcache أسبوع في `public/_headers`.

## 2026-10-03 — Inline global.css

### Changed
- `src/layouts/BaseLayout.astro`: `global.css` بقى بيتحط جوه كل صفحة كـ`<style>` (بـ`?raw`) بدل `<link rel="stylesheet">`، فمبقاش فيه request بيوقف الرسم قبل أول ظهور (Lighthouse "Render-blocking requests"). روابط الخط `../fonts/` بتتحوّل لـ`/assets/fonts/`. الملف نفسه لسه مصدره `public/assets/css/global.css` والـminify بيحصل في `postbuild`. visual-diff: الـ80 صورة identical.

## 2026-10-02 — Refactor phase 4

### Changed — AVIF images + CI
- `src/components/Img.astro` (جديد): كل صور الصفحات (39 في 9 صفحات + قالب المنتجات) بقت `<picture>` فيها AVIF والـWebP كـfallback، مع نفس الـsrcset/sizes والخلفية المموّهة. صور الرئيسية على موبايل 2.6x: 576KB → 430KB (−25%) من غير فرق ظاهر في الجودة.
- `scripts/make-images.mjs` (جديد، `npm run images`): بيولّد بـsharp ملفات `.avif` (quality 58) ونسخ `-720` و`scripts/lqip.json` للصور المستخدمة بس. بدّل `scripts/make-lqip.sh`. الملفات الناتجة متعمل لها commit فـCloudflare مش بيعالج صور.
- `public/assets/css/global.css`: `picture{display:contents}` و`picture>source{display:none}` + نسخة `> picture > img` من الـ3 selectors اللي كانت `> img`. `global.css?v=1.6`.
- `scripts/postbuild.mjs`: اتشال منه الـLQIP (بقى في الكومبوننت)، واتضاف فحص إن كل ملف في `src`/`srcset`/`poster` موجود.
- صورة الهيرو في الرئيسية بقت preload بـAVIF.
- `astro check` + `@astrojs/check` و`typescript` و`@types/node` و`tsconfig.json`؛ `npm run check` بقى typecheck + build. `.github/workflows/ci.yml` (جديد) بيشغّله على كل PR وpush على main.
- التحقق: `scripts/visual-diff.mjs` مع `HIDE_IMAGES=1` (اتضاف) — 80/80 صورة identical مع `main` (الـlayout والنصوص)، والصور نفسها اتقارنت بالعين.

## 2026-10-02 — Refactor phase 3

### Changed — CSS
- `src/styles/content-page.css` (جديد): الـ13KB CSS اللي كانت متكررة بالحرف في 10 صفحات (404، من نحن، تواصل، FAQ، الخصوصية، طلب معاينة، review، المناطق، الخدمات، الشكر) بقت ملف واحد. `src/styles/home.css` و`thank-you.css` لـCSS الرئيسية وإضافات صفحة الشكر. الصفحات بتحقنها inline بـ`?raw` (نفس الناتج).
- `public/assets/css/global.css`: `!important` نزلوا من 151 لـ39. كل واحد اتشال اتأكدنا إنه مش بيغيّر الـcomputed style لأي عنصر في الـ20 صفحة على 4 مقاسات؛ الباقيين لازمين لأنهم بيغطّوا على CSS الصفحات. `global.css?v=1.5`.
- `scripts/visual-diff.mjs` (جديد): مقارنة بصرية pixel-by-pixel بين build-ين. النتيجة لهذا التعديل: 80/80 صورة identical مع `main`، وكمان المنيو المفتوح على الموبايل والـMega Menu على الديسكتوب.
- `AGENTS.md` و`docs/ARCHITECTURE.md`: قاعدة الـvisual-diff قبل أي refactor، ومكان الـCSS، وليه `is:inline` باقي.

## 2026-10-02 — Refactor phase 2

### Changed — Product pages → one template + content collection
- الـ8 صفحات منتجات (حوالي 6,200 سطر متكرر) بقوا قالب واحد `src/pages/[product].astro` + ملف JSON لكل منتج في `src/content/products/` (schema بـZod في `src/content.config.ts`، فلو ملف ناقص حقل الـbuild بيقف).
- `src/data/product-shared.ts` (جديد): المحتوى اللي كان متكرر بالحرف في الـ8 صفحات (خطوات التنفيذ، «منتجات أخرى»، اختيارات الفورم، الـCTA الأخير، رقم التليفون ولينك الواتساب).
- `src/styles/product-page.css` (جديد): الـCSS اللي كان متكرر 8 مرات (18KB) بقى ملف واحد، وبيتحط inline زي ما كان.
- `src/lib/site.ts` و`sitemap.xml.ts`: الـsitemap بقى ياخد صفحات المنتجات من الـcollection.
- صفحة الفيديوهات الكتير (`product-videos--2`) والصيانة من غير فيديو (ولينك «فيديو من التنفيذ» بيختفي) بقوا بيتحددوا من البيانات.
- اتقارن الـDOM بـ`main` في الـ20 صفحة: مطابق، و`sitemap.xml`/`robots.txt`/`_redirects` مطابقين حرف بحرف. التغيير الوحيد: الـbreadcrumb في صفحة الجيرلس بقى «الخدمات والمنتجات» زي باقي المنتجات بدل «أنواع المصاعد» (نفس اللينك).

## 2026-10-02 — Refactor phase 1

### Changed — BaseLayout + SEO in Astro
- `src/layouts/BaseLayout.astro` (جديد): الـ`<html>`/`<head>` المشترك بدل ما كل صفحة من الـ20 فيها نسختها. الصفحات بقت تبعت `title`/`description`/`robots` كـprops والـ`<style is:inline>` في `slot="head"`.
- `src/lib/site.ts` (جديد): ثوابت الموقع وبيانات الشركة والـJSON-LD وقوائم صفحات المنتجات/الداخلية — مصدر واحد بدل ما كانت جوه `postbuild.mjs`.
- `src/pages/sitemap.xml.ts` و`robots.txt.ts` (جداد): endpoints بتولّد نفس الملفين بالظبط (نفس الـURL المسجّل في Search Console).
- `scripts/postbuild.mjs`: اتشال منه الـcanonical/OG/Twitter/JSON-LD/preload/sitemap/robots (حوالي 150 سطر)؛ فاضل فحص الروابط وclean URLs والـminify والـLQIP و`_redirects`.
- **Bug اتصلّح:** صفحات المنتجات الـ7 (electric، maintenance، gearbox، gearbox-automatic-doors، hospital، hydraulic، outdoor) كان `og:description` و`twitter:description` والـdescription في الـSchema فاضيين، لأن الـregex القديم كان متوقع `name` قبل `content` في الـmeta. دلوقتي بيتاخدوا من الـprops.
- اتقارن الناتج بـ`main`: الـbody والـCSS وترتيبه مطابقين في الـ20 صفحة، و`sitemap.xml`/`robots.txt`/`_redirects` مطابقين حرف بحرف. الفرق الوحيد في الـhead: ترتيب الـattributes، ومسافات `viewport`، والـdescriptions اللي اتصلّحت.

## 2026-10-02 — Astro

### Performance — Blurred image previews + no font flash
- فحص الموقع الحقيقي: السيرفر سريع (HTML بيوصل في ~0.1 ث، Brotli، HTTP/2+3)، والـcache و`srcset` شغالين، وكل الصور المعروضة WebP (الـJPG بس صور مشاركة السوشيال `og.jpg` لأن فيسبوك/واتساب محتاجينها).
- السبب في الكارت الفاضي: الصور `loading="lazy"` فبتبدأ تتحمّل لما تقرّب منها؛ لو الـscroll أسرع من النت بيبان المربع فاضي. جربنا تحميلها كلها من الأول (eager) وطلع أسوأ على النت البطيء، فاترفض.
- `scripts/make-lqip.sh` + `scripts/lqip.json` (جديد): نسخة مصغّرة جدًا (20px، ~400 byte) من كل صورة. `scripts/postbuild.mjs` بيحطها خلفية للـ`<img>`، فالكارت بيظهر فيه نسخة مموّهة من نفس الصورة فورًا لحد ما الصورة الحقيقية توصل.
- `public/assets/css/global.css`: `font-display: block` بدل `swap` للخط (preloaded)، فالنص بيظهر بـAlexandria من أول مرة بدل ما يبدأ بخط تاني ويتبدّل. `global.css?v=1.4`.
- مقاسات الصور في الـ20 صفحة على 4 شاشات مطابقة لـ`main`، وLighthouse موبايل محلي 95–96 (زي قبل).

### Performance — Real phones were still downloading full-size images
- `src/pages/*.astro`: `sizes` بقى `(max-width: 820px) 40vw, 900px` (والهيرو `60vw`). الموبايلات الحقيقية شاشتها كثافتها 2.5–3x، فكانت بتختار الصورة الكبيرة (1000–1250px) بدل نسخة الـ720. دلوقتي بتاخد نسخة الـ720 (لسه حادة 2x على كارت 350px). الديسكتوب زي ما هو.
- `src/components/SiteHeader.astro`: صورة معاينة الـMega Menu كانت بتتحمّل بالمقاس الكامل (105KB) في كل صفحة حتى على الموبايل اللي مش بيظهر فيه المنيو ده. بقت `loading="lazy"` ومعاينات المنتجات بقت نسخ `-720`.
- `public/_headers` (جديد): cache للصور والخطوط والفيديو والـCSS/JS على Cloudflare Pages (مجاني)، فالصفحة التانية بتفتح من غير ما تحمّل الصور تاني.
- الرئيسية على موبايل 2.6x: إجمالي التحميل 1.33MB → 503KB. مقاسات كل الصور في الـ20 صفحة على 4 شاشات مطابقة لـ`main`.

### Performance — Mobile images (السبب في ظهور الكحلي تحت الصور)
- كل `<img>` في `src/pages/*.astro` (72 صورة) بقى ليها `width`/`height` صريحين، فالكارت بياخد مقاسه الصح من الأول ومبقاش يكبر فجأة لما الصورة توصل.
- 14 صورة أعرض من 800px بقى ليها نسخة موبايل `*-720.webp` (حوالي 50KB) بـ`srcset` و`sizes="(max-width: 820px) 100vw, 900px"`. الديسكتوب لسه بياخد الصورة الكبيرة. صور الرئيسية على الموبايل: 1355KB → 576KB.
- `public/assets/css/global.css`: خلفية فاتحة `#E6E0D6` لصور المنتجات والرئيسية أثناء التحميل بدل ما الكارت الكحلي يبان من تحتها. و`global.css?v=1.3` في كل الصفحات.
- اتقارنت مقاسات كل الصور في الـ20 صفحة على 390/768/1366/1920 قبل وبعد: مطابقة.

### Fixed — Home "why" image gap on mobile
- `src/pages/index.astro`: صورة سكشن «ليه تختارنا» (`.why-media`) بقت `absolute + object-fit:cover` بأبعاد صريحة وخلفية navy، فبقت تملا الكارت كله. قبل كده كانت أقصر من الكارت على الموبايل، فالـgradient الرمادي كان باين تحتها وقبل ما تحمّل.

### Changed — Migration to Astro
- الموقع بقى مبني بـAstro 7 (`astro.config.mjs`، static، `build.format: 'file'`). نفس الـURLs ونفس الشكل؛ الـHTML الناتج اتقارن بالـbuild القديم صفحة بصفحة ومطابق.
- `*.html` → `src/pages/*.astro`، و`components/site-*.html` → `src/components/SiteHeader.astro` / `SiteFooter.astro` بدل الـmarkers. كل `<style>`/`<script>` بقوا `is:inline` عشان يطلعوا زي ما هم.
- `assets/` و`manifest.json` اتنقلوا لـ`public/`.
- `scripts/build.mjs` → `scripts/postbuild.mjs`: بيشتغل بعد `astro build` على `dist/` (فحص الروابط، clean URLs، canonical/OG، JSON-LD، preload، minify، sitemap، robots، `_redirects`).
- `npm run build` = `astro build && node scripts/postbuild.mjs`، وفيه `npm run dev`. `.node-version` = 22 لـCloudflare Pages (Astro محتاج Node ≥ 22.12).
- تحديث `AGENTS.md` و`README.md` و`docs/ARCHITECTURE.md` و`docs/RESPONSIVE.md` بالمسارات الجديدة.

## 2026-10-02

### Fixed — CSS cache busting
- كل الصفحات: `global.css?v=1.1` → `?v=1.2` عشان Cloudflare والمتصفحات ياخدوا نسخة الـCSS الجديدة (ألوان التباين).

### Performance — Inline CSS minify
- `scripts/build.mjs`: دالة `minifyCss` مشتركة، وبقت تصغّر بلوكات `<style>` اللي جوه كل صفحة في `dist/` (الرئيسية 79KB → 75KB). PageSpeed موبايل محلي 90 → 92، وSpeed Index 1.4 ث.

### Fixed — Brand tagline contrast
- `assets/css/global.css`: لون «NEW CAIRO ELEVATORS» تحت اسم الشركة بقى `#5F6B76` في الهيدر و`#93A3B1` في الفوتر بدل `#85909A`/`#607688` (تباين 3.1 و4.0 → فوق 4.5:1). Accessibility ديسكتوب 96 → 100.

### Performance — Mobile speed (PageSpeed موبايل 75 → 90 في اختبار محلي)
- `assets/css/global.css`: خط Alexandria بقى self-hosted (`assets/fonts/alexandria-arabic.woff2` + `alexandria-latin.woff2`, variable 400–800) بدل `@import` من Google Fonts — شال طلبين لدومينات خارجية وCLS بقى 0.
- `scripts/build.mjs`: preload لخط العربي بدل روابط Google Fonts، وpreload صورة الهيرو بـ`imagesrcset`.
- `index.html`: صورة الهيرو بـ`srcset` — نسخة موبايل `hero-luxury-elevator-lobby-860.webp` (72KB بدل 170KB). الشكل زي ما هو.
- `components/site-header.html` و`site-footer.html`: اللوجو بقى `logo-160.webp` (6KB بدل 87KB) لأنه بيتعرض 50px بس. `logo.webp` الأصلي باقي للـSchema/OG.
- Accessibility: `aria-label` بتاع لينك اللوجو بقى يحتوي النص الظاهر (`label-content-name-mismatch`).

### SEO — توثيق تعديلات سابقة على `scripts/build.mjs`
- Clean URLs + `_redirects` 301 من `.html`، canonical/OG بالروابط النظيفة، JSON-LD (LocalBusiness/Organization/WebSite/WebPage/Service/BreadcrumbList مع عنوان وإحداثيات Google Maps)، `robots.txt` و`sitemap.xml` بالروابط النظيفة، وminify لـ`global.css` في `dist/`.

## 2026-09-27

### Added — Product videos on product pages
- سكشن «من أرض الواقع» (`#video`) في صفحات المنتجات السبعة بفيديوهات المشاريع الحقيقية اللي كانت في `assets/videos/products/` ومش مستخدمة في أي صفحة، مع لينك «فيديو من التنفيذ» في فهرس الصفحة. صفحة الجيربوكس بأبواب أوتوماتيك فيها فيديوهين.
- ضغط الفيديوهات (H.264 CRF 27 + faststart + AAC 96k) من ~80MB لـ~30MB، وحذف `gearbox-automatic-doors/gearbox-overview.mp4` لأنه نسخة مطابقة من `gearbox-elevator/overview.mp4`.
- صور poster WebP لكل فيديو (`*-poster.webp`) و`preload="none"` عشان الفيديو مايتحمّلش غير لما الزائر يضغط تشغيل.
- `assets/css/global.css`: ستايل `.product-videos` (9:16، بيحترم ارتفاع لابتوب 14" وبيبقى عمود واحد على الموبايل).

### Fixed — Home product card height
- `index.html`: صورة كارت المنتج بقت `absolute + object-fit:cover` فالصور المحلية الطولية مبقتش بتمط الكارت (كان 440–500px). الكروت رجعت 240px زي تصميم `main` على الديسكتوب والتابلت، و220px للصورة على الموبايل.

### Changed — Home hero image
- صورة جديدة للهيرو في `index.html`: `assets/images/home/hero-luxury-elevator-lobby.webp` (مدخل مصعد فاخر، WebP 170KB بدل 263KB) بدل `gallery-02` (صورة أرضية فيها رجلين)، مع `fetchpriority="high"` وأبعاد صريحة وalt وصفي.

### Changed — Desktop section heights + responsive rules
- `assets/css/global.css`: قسم *Desktop viewport-height fit* — الهيرو وسكشن الخدمات بقوا يتحددوا بارتفاع الشاشة (`svh` + `clamp`) بدل 690px/520px ثابتة، والصور بقت `absolute + object-fit` فمبقتش بتطوّل الكارت. على لابتوب 14" (1366×650) الهيرو بقى كامل في أول شاشة وسكشن الخدمات بعنوانه في شاشة واحدة.
- `index.html`: تغيير صورة «توريد وتركيب المصاعد» (`gallery-10` صورة سقف غير واضحة) لـ`gallery-03`.
- `docs/RESPONSIVE.md` (جديد): المقاسات المعتمدة والـbreakpoints وقواعد الارتفاع والاختبار، مع إشارة في `AGENTS.md`.

### Reverted — Home product cards layout
- الرجوع لتصميم الكروت الأفقية الأصلي في `index.html` (صورة + نص + سهم) بناءً على طلب المالك؛ اللينكات لصفحات المنتجات باقية.

### Fixed — Home product cards
- كروت سكشن «بنختار نوع المصعد» في `index.html` بقت تودّي لصفحة كل منتج بدل ما تنزل لفورم `#contact`.

### Fixed — Production domain
- تصحيح الدومين إلى `newcairoelevator.com` (بدون s) في `scripts/build.mjs` (canonical وOpen Graph وsitemap وrobots) وفي `privacy-policy.html`.

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
