# القاهرة الجديدة للمصاعد | New Cairo Elevators 🛗✨

موقع إلكتروني متكامل وعصري لشركة **القاهرة الجديدة للمصاعد** — المتخصصة في توريد، تركيب، تشطيب، صيانة وتحديث كافة أنواع المصاعد الهيدروليكية والكهربائية (جيربوكس وجيرليس) ومصاعد المستشفيات والفيلات والمباني السكنية والتجارية.

---

## 🌟 مميزات المشروع

- **نظام تصميم احترافي (Design System v3.2)**: هويّة بصرية داكنة وذهبية فاخرة (`Navy & Champagne Gold`) تعكس موثوقية الشركة وفخامتها.
- **تجاوب كامل (Responsive Layout)**: متوافق 100% مع كافة الشاشات والـ Viewports (جوال، تابلت، حاسوب).
- **دعم اتجاه الكتابة من اليمين إلى اليسار (RTL System)**: مصمم خصيصاً للغة العربية بطباعة وأخطاط متناسقة (`Alexandria Font`).
- **تحسين محركات البحث (SEO Optimized)**: عناوين، أوسمة ميتات، هيكلية H1-H6، وسرعة تحميل فائقة بدون أي مكتبات خارجية ثقيلة.
- **تطبيق ويب متكامل (PWA Ready)**: يحتوي على ملف `manifest.json` جاهز لتثبيت الويب.
- **تجربة متكاملة لطلب عروض الأسعار**: صفحات مخصصة لطلب الاستشارات، جداول الأسعار، وفهرس شامل للمناطق المخدومة.
- **Shared Layout Components**: الهيدر والـMega Menu والفوتر لهم مصدر واحد ويتم حقنهم وقت الـbuild في جميع صفحات HTML، تمهيدًا للانتقال إلى Astro بدون إعادة بناء الواجهات.

---

## 📁 هيكلية ومحتويات الموقع (20 صفحة)

الموقع يحتوي على 20 صفحة HTML متكاملة تغطي كافة جوانب الخدمة والمنتجات:

| اسم الصفحة | اسم الملف | الوصف والهدف |
| :--- | :--- | :--- |
| **الصفحة الرئيسية** | [`index.html`](./src/pages/index.astro) | الصفحة التعريفية الكبرى، الخدمات الرئيسية، آراء العملاء، وأزرار التواصل السريع |
| **من نحن** | [`about-us.html`](./src/pages/about-us.astro) | رؤية الشركة، قيمها، خبراتها، والتزامها بأعلى معايير الأمان والجودة |
| **دليل الخدمات العامة** | [`services.html`](./src/pages/services.astro) | استعراض شامل لكافة الخدمات الفنية المتاحة |
| **المصاعد الكهربائية** | [`electric-elevator.html`](./src/content/products/electric-elevator.json) | التفاصيل الفنية والمواصفات للمصاعد الكهربائية التقليدية والحديثة |
| **مصاعد الجيربوكس** | [`gearbox-elevator.html`](./src/content/products/gearbox-elevator.json) | مصاعد المحركات ذات التروس للمباني السكنية والتجارية |
| **مصاعد الجيرليس** | [`gearless-elevator.html`](./src/content/products/gearless-elevator.json) | المصاعد الحديثة بدون تروس (موفرة للطاقة وهادئة جداً) |
| **المصاعد الهيدروليكية والبانورامية** | [`hydraulic-panoramic-elevator.html`](./src/content/products/hydraulic-panoramic-elevator.json) | مصاعد الفيلات والمباني التي لا تحتوي على غرفة محرك علوية |
| **مصاعد المستشفيات** | [`hospital-elevator.html`](./src/content/products/hospital-elevator.json) | المصاعد الطبية المجهزة لنقل الأسرة والمعدات الطبية بأعلى درجات السلاسة |
| **المصاعد الخارجية** | [`outdoor-elevator.html`](./src/content/products/outdoor-elevator.json) | حلول المصاعد الخارجية للمباني القائمة والفيلات |
| **عقود الصيانة والتحديث** | [`elevator-maintenance.html`](./src/content/products/elevator-maintenance.json) | خطط الصيانة الدورية والصيانة الطارئة وتجديد المصاعد القديمة |
| **الأبواب الأوتوماتيكية** | [`gearbox-automatic-doors.html`](./src/content/products/gearbox-automatic-doors.json) | أبواب الكبائن والأدوار الأوتوماتيكية والنصف أوتوماتيكية |
| **مناطق التغطية والخدمة** | [`service-areas.html`](./src/pages/service-areas.astro) | المناطق المخدومة (القاهرة الجديدة، التجمع الخامس، زايد، الشروق، إلخ) |
| **طلب عرض سعر** | [`request-quote.html`](./src/pages/request-quote.astro) | نموذج تفاعلي لطلب المقايسات والاستشارات الفنية |
| **الأسئلة الشائعة** | [`faq.html`](./src/pages/faq.astro) | الإجابات الشاملة عن الأسئلة الفنية والهندسية الأكثر تكراراً |
| **اتصل بنا** | [`contact-us.html`](./src/pages/contact-us.astro) | معلومات الاتصال والموقع وأرقام الدعم الفني |
| **سياسة الخصوصية** | [`privacy-policy.html`](./src/pages/privacy-policy.astro) | الشروط والأحكام وسياسة سرية البيانات |
| **فهرس الصفحات** | [`review-pages.html`](./src/pages/review-pages.astro) | دليل تصفح سريع لكافة صفحات المشروع |
| **معاينة نظام التصميم** | [`design-system-preview.html`](./src/pages/design-system-preview.astro) | مستند المعاينة البصرية لنظام الألوان والخطوط v3.2 |
| **صفحة 404** | [`404.html`](./src/pages/404.astro) | صفحة الخطأ المخصصة لتوجيه الزوار |
| **إعدادات PWA** | [`manifest.json`](./manifest.json) | ملف تكوين الويب للتطبيق |

---

## 🎨 نظام التصميم (Design System v3.2)

- **الألوان الأساسية**:
  - `Navy 900` (`#0A1724`) — الكحلي الفاخر الخلفي.
  - `Champagne Gold` (`#B99256`) — الذهبي الملكي للعناوين والأزرار والأيقونات.
  - `Paper` (`#FBFAF8`) & `Surface` (`#FFFFFF`) — الخلفيات الفاتحة المريحة للعين.
- **الخطوط**: خط `Alexandria` العربي المودرن من Google Fonts.
- **الملفات البرمجية والتنسيق**:
  - `public/assets/css/global.css`: المتغيرات والأشكال والأنماط العامة للموقع والمكونات المشتركة.
  - `src/components/SiteHeader.astro`: الهيدر والـMega Menu الموحدان.
  - `src/components/SiteFooter.astro`: الفوتر الموحد.
  - `public/assets/js/site-navigation.js`: تفاعل المنيو والحالة النشطة.
  - `src/pages/*.astro` + Astro: بناء الصفحات إلى `dist/`، و`scripts/postbuild.mjs` لطبقة السيو.

---

## 🚀 طريقة التشغيل والنشر

### 1. التشغيل المحلي
المشروع مبني بـ**Astro**. يتطلب Node.js 22.12 أو أحدث:

```bash
npm install
npm run dev     # معاينة محلية
npm run build   # astro build + scripts/postbuild.mjs
```

الناتج النهائي الجاهز للنشر يوجد داخل `dist/`. لا تعدّل `dist/` يدويًا لأنه ملف ناتج Build وغير محفوظ في Git.

### 2. Cloudflare Pages
إعدادات الإنتاج المعتمدة:

- Production branch: `main`
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/`

أي Push جديد على `main` يشغّل Build جديد وينشر النسخة الناتجة تلقائيًا.

### 3. المكونات المشتركة

- `src/components/SiteHeader.astro` — الـTopbar + Header + Desktop Mega Menu + Mobile Menu.
- `src/components/SiteFooter.astro` — الفوتر الموحد وروابط الموقع.
- `public/assets/js/site-navigation.js` — الحالة النشطة للمنيو وسلوك الـMega Menu.
- `scripts/postbuild.mjs` — بعد `astro build`: فحص الروابط المحلية والسيو والأداء.

> **مهم:** لا تنسخ Header أو Footer داخل صفحة منفردة. عدّل الـComponent المشترك فقط.

التفاصيل المعمارية وتفاصيل التحويل لـAstro موجودة في [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md).
سياسة توثيق التعديلات موجودة في [`AGENTS.md`](./AGENTS.md) و[`CHANGELOG.md`](./CHANGELOG.md).

---

## 📝 الترخيص وحقوق الملكية

جميع الحقوق محفوظة © **القاهرة الجديدة للمصاعد** (New Cairo Elevators).
