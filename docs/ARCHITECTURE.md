# Architecture — New Cairo Elevators

_Last updated: 2026-10-02_

## الهدف

الموقع مبني بـ**Astro** (static output). الـHeader والـFooter components مشتركة، وكل صفحة `.astro` بتحتوي محتواها بس. الناتج HTML كامل (مش Client-side includes) عشان الـSEO. بعد Astro فيه خطوة `scripts/postbuild.mjs` بتضيف طبقة السيو والأداء.

## الهيكل الحالي

```text
/
├─ src/
│  ├─ pages/*.astro               # صفحة لكل URL (index.astro → /، faq.astro → /faq)
│  ├─ pages/[product].astro       # قالب صفحات المنتجات الـ8 (صفحة لكل ملف في content/products)
│  ├─ content/products/*.json     # محتوى كل منتج (gearless-elevator.json → /gearless-elevator)
│  ├─ content.config.ts           # schema الـproducts collection (Zod) — الـbuild بيقف لو ملف ناقص حقل
│  ├─ data/product-shared.ts      # المحتوى المشترك بين المنتجات (خطوات التنفيذ، منتجات أخرى، الفورم، الـCTA)
│  ├─ styles/product-page.css     # CSS صفحات المنتجات
│  ├─ styles/content-page.css     # CSS مشترك للصفحات الداخلية (من نحن، الخدمات، FAQ، تواصل، ...)
│  ├─ styles/home.css             # CSS الرئيسية
│  ├─ styles/thank-you.css        # إضافات صفحة الشكر فوق content-page.css
│  ├─ pages/sitemap.xml.ts        # /sitemap.xml (endpoint)
│  ├─ pages/robots.txt.ts         # /robots.txt (endpoint)
│  ├─ layouts/BaseLayout.astro    # <html>/<head> المشترك: meta، preload، global.css، canonical/OG/Twitter، JSON-LD
│  ├─ components/Img.astro        # صورة: <picture> بـAVIF + WebP + نسخة موبايل + placeholder مموّه
│  ├─ lib/site.ts                 # ثوابت الموقع وبيانات السيو (الشركة، صفحات المنتجات، الصفحات الداخلية، Schema)
│  └─ components/
│     ├─ SiteHeader.astro         # Topbar + Header + Mega Menu + Mobile Menu
│     └─ SiteFooter.astro         # Shared footer + shared scripts
├─ public/                        # بيتنسخ زي ما هو لـdist/
│  ├─ assets/css/global.css       # Global design system + shared component CSS
│  ├─ assets/js/                  # site-navigation.js, lead-form.js
│  ├─ assets/fonts|images|videos/
│  └─ manifest.json
│  └─ _headers                    # Cloudflare Pages cache rules للـassets
├─ scripts/make-images.mjs        # يولّد AVIF ونسخ -720 و lqip.json (npm run images)
├─ .github/workflows/ci.yml       # astro check + build على كل PR
├─ scripts/visual-diff.mjs        # مقارنة بصرية pixel-by-pixel بين build-ين (20 صفحة × 4 مقاسات)
├─ scripts/postbuild.mjs          # SEO/performance layer على dist/
├─ astro.config.mjs
├─ .node-version                  # Node 22 (Astro محتاج ≥ 22.12)
└─ dist/                          # Generated output; ignored by Git
```

## Build flow

`npm run build` = `astro build && node scripts/postbuild.mjs`

1. Astro بيبني كل `src/pages/*.astro` لـ`dist/<slug>.html` (`build.format: 'file'`، `compressHTML: false`) وبينسخ `public/`.
2. كل `<style>` و`<script>` في الصفحات مكتوبين `is:inline` عشان Astro مايعملهمش scope أو bundle — الـCSS/JS بيطلع زي ما هو.
3. كل صفحة بتستخدم `BaseLayout` وبتبعتله `title` و`description` (و`robots` للصفحات الداخلية). الـ`<style is:inline>` الخاص بالصفحة بيتحط في `<Fragment slot="head">`. الـLayout بيطلّع الـhead كله: الـmeta، preload الخط (وصورة الهيرو لو اتبعت `preloadImage`)، `global.css` (inline كـ`<style>` من غير request منفصل؛ مسارات الخط بتتحوّل لـ`/assets/fonts/`)، الـcanonical والـOG والـTwitter والـJSON-LD من `src/lib/site.ts`.
4. `src/pages/sitemap.xml.ts` و`robots.txt.ts` بيولّدوا الملفين من نفس بيانات `site.ts`.
5. `scripts/postbuild.mjs` بيعمل اللي محتاج الـHTML النهائي بس:
   - يفحص روابط `.html` المحلية ويوقف الـbuild لو فيه رابط مكسور.
   - يحوّل الروابط الداخلية لـclean URLs.
   - يصغّر الـCSS المكتوب جوه الصفحات و`global.css`.
   - يتأكد إن كل ملف في `src`/`srcset`/`poster` موجود (صورة ناقصة = الـbuild يقف).
   - يولّد `_redirects` (301 من `.html`).
6. Cloudflare Pages ينشر `dist/`، ويطبّق `public/_headers` (cache طويل للصور والخطوط، أسبوع للـCSS/JS المتعلّمين بـ`?v=`).

`npm run dev` يشغّل Astro dev server للمعاينة (من غير خطوة الـpostbuild).

## قواعد الـShared Layout

- أي تعديل على الـHeader أو الـMega Menu يتم في `src/components/SiteHeader.astro` فقط.
- أي تعديل على الـFooter يتم في `src/components/SiteFooter.astro` فقط.
- CSS الخاص بالمكونات المشتركة يكون في `public/assets/css/global.css`.
- لا يتم نسخ HTML الخاص بالـHeader/Footer يدويًا داخل الصفحات.
- الصفحات تملك محتواها الخاص فقط.
- `dist/` ناتج آلي ولا يتم تعديله أو Commit له.

## Mega Menu

الـMega Menu تعرض روابط فعلية لكل صفحات المصاعد:

- Gearless
- Gearbox
- Gearbox + Automatic Doors
- Electric
- Hydraulic Panoramic
- Outdoor
- Hospital
- Maintenance

الحالة النشطة وسلوك click / Escape / outside-click يتمان في `public/assets/js/site-navigation.js`. الموبايل يستخدم Accordion مستقل داخل نفس الـHeader component.

## Cloudflare Pages

Production configuration:

```text
Branch: main
Build command: npm run build
Output directory: dist
Root directory: /
```

## التحويل إلى Astro (2026-10-02)

اتعمل تحويل Mechanical: نفس المحتوى ونفس الـURLs، والـHTML الناتج مطابق للـbuild القديم (الفرق الوحيد `<!DOCTYPE>` وطريقة قفل عناصر SVG).

| قبل | دلوقتي |
|---|---|
| `src/components/SiteHeader.astro` | `src/components/SiteHeader.astro` |
| `src/components/SiteFooter.astro` | `src/components/SiteFooter.astro` |
| `*.html` + markers | `src/pages/*.astro` |
| `assets/`, `manifest.json` | `public/assets/`, `public/manifest.json` |
| `scripts/postbuild.mjs` | Astro + `scripts/postbuild.mjs` |

### خطة الـRefactoring
1. ✅ (2026-10-02) `BaseLayout.astro` + `src/lib/site.ts` + endpoints للـsitemap/robots.
2. ✅ (2026-10-02) صفحات المنتجات الـ8 → `src/pages/[product].astro` + `src/content/products/*.json`.
3. ✅ (2026-10-02) الـCSS: كل CSS الصفحات بقى في `src/styles/*.css` (مفيش CSS مكرر بين الصفحات)، و`!important` في `global.css` نزلوا من 151 لـ39.
   - الـ39 الباقيين لازمين: بيغطّوا على قواعد في CSS الصفحات بنفس الـspecificity أو أعلى. شيلهم محتاج إعادة ترتيب الـCSS نفسه.
   - `is:inline` لسه موجود عن قصد: لو اتشال، Astro بيعمل scope للـCSS (بيزود attributes وspecificity) وبيغيّر ترتيب تحميله بالنسبة لـ`global.css` — وده بيغيّر الشكل. الـCSS بيتكتب في ملفات `.css` عادية وبيتحقن بـ`?raw` + `set:html`.
4. ✅ (2026-10-02) الصور: `src/components/Img.astro` (AVIF + WebP) + `scripts/make-images.mjs`، و`astro check` + GitHub Actions CI.
   - ليه مش `astro:assets`: كان هيحتاج نقل الصور لـ`src/` وتغيير مساراتها لـ`/_astro/<hash>`، وده يكسر `og.jpg` ومعاينات الـMega Menu اللي بيبدّلها الـJS بالمسار، ويخلّي Cloudflare يعالج الصور في كل build. الصور المشتقة بتتعمل مرة وتتعمل لها commit.

### Shared shell ownership invariant
- `src/components/SiteHeader.astro`, `src/components/SiteFooter.astro`, `public/assets/css/global.css`, and `public/assets/js/site-navigation.js` exclusively own shared header/footer/navigation behavior.
- Page-level `<style>` or `<script>` blocks must not target `.site-header`, `.mobile-menu`, `.mobile-products`, `.desktop-nav`, `.mega-menu`, or other shared-shell selectors.
- Responsive navigation changes are made once in the shared shell and validated at desktop, tablet, and mobile widths before deployment.

## SEO output

`src/pages/sitemap.xml.ts` and `src/pages/robots.txt.ts` generate `/sitemap.xml` and `/robots.txt` at build time; internal pages (`review-pages.html`, `design-system-preview.html`, `404.html`) are excluded.

## Visual regression

قبل أي تعديل في CSS أو layout:

```bash
git stash && npm run build && cp -r dist /tmp/base && git stash pop   # build الأساس
npm run build
CHROME_PATH=/path/to/chrome node scripts/visual-diff.mjs /tmp/base dist
```

بيصوّر الـ20 صفحة على 390/768/1366/1920 ويقارن بالبكسل؛ أي فرق بيتحفظ صور قبل/بعد في `visual-diff/`. محتاج Playwright (مش من dependencies المشروع).

## صفحات المنتجات

- **تعديل نص منتج:** عدّل `src/content/products/<slug>.json` بس.
- **إضافة منتج جديد:** انسخ ملف JSON موجود باسم الـslug الجديد (هيبقى الـURL)، عدّل المحتوى، وحط الصور في `public/assets/images/products/<slug>/` (و`og.jpg`)، وضيف الـslug لـ`PRODUCT_PAGES` في `src/lib/site.ts`، وشغّل `npm run images` (بيعمل نسخ `-720` والـAVIF والـplaceholder).
- **تعديل حاجة مشتركة** (خطوات التنفيذ، المنتجات الأخرى، الفورم): `src/data/product-shared.ts`. **تعديل الشكل:** `src/pages/[product].astro` و`src/styles/product-page.css`.

## Responsive images

- أي صورة في صفحة بتتكتب بـ`<Img src=... width height alt />` (`src/components/Img.astro`)، مش `<img>`.
- الكومبوننت بيطلّع `<picture>`: `<source type="image/avif">` + `<img>` WebP، ولو فيه نسخة `-720`/`-860` بيحط `srcset` و`sizes="(max-width: 820px) 40vw, 900px"` (الـ40vw مقصودة: بتخلّي الموبايلات عالية الكثافة تاخد النسخة الصغيرة)، وخلفية مموّهة من `scripts/lqip.json`.
- `global.css`: `picture{display:contents}` و`picture>source{display:none}` فالـlayout زي `<img>` لوحده بالظبط (selectors زي `.x > img` محتاجة نسخة `.x > picture > img`).
- بعد إضافة أو تغيير صورة: `npm run images` (sharp) — بيعمل `.avif` و`-720.webp`/`.avif` و`lqip.json` للصور اللي `src/` بيستخدمها بس، وبعدين commit للملفات.

## Social meta & leads

- Build injects canonical/Open Graph/Twitter tags per public page (`src/layouts/BaseLayout.astro`, data in `src/lib/site.ts`).
- All images are served locally from `public/assets/images/` (WebP); no third-party image hosts.
- Lead forms use `public/assets/js/lead-form.js` → Google Sheets (Apps Script web app) + WhatsApp. See `docs/google-sheets-crm.md`.
