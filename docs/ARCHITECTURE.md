# Architecture — New Cairo Elevators

_Last updated: 2026-10-02_

## الهدف

الموقع مبني بـ**Astro** (static output). الـHeader والـFooter components مشتركة، وكل صفحة `.astro` بتحتوي محتواها بس. الناتج HTML كامل (مش Client-side includes) عشان الـSEO. بعد Astro فيه خطوة `scripts/postbuild.mjs` بتضيف طبقة السيو والأداء.

## الهيكل الحالي

```text
/
├─ src/
│  ├─ pages/*.astro               # صفحة لكل URL (index.astro → /، gearless-elevator.astro → /gearless-elevator)
│  └─ components/
│     ├─ SiteHeader.astro         # Topbar + Header + Mega Menu + Mobile Menu
│     └─ SiteFooter.astro         # Shared footer + shared scripts
├─ public/                        # بيتنسخ زي ما هو لـdist/
│  ├─ assets/css/global.css       # Global design system + shared component CSS
│  ├─ assets/js/                  # site-navigation.js, lead-form.js
│  ├─ assets/fonts|images|videos/
│  └─ manifest.json
│  └─ _headers                    # Cloudflare Pages cache rules للـassets
├─ scripts/postbuild.mjs          # SEO/performance layer على dist/
├─ astro.config.mjs
├─ .node-version                  # Node 22 (Astro محتاج ≥ 22.12)
└─ dist/                          # Generated output; ignored by Git
```

## Build flow

`npm run build` = `astro build && node scripts/postbuild.mjs`

1. Astro بيبني كل `src/pages/*.astro` لـ`dist/<slug>.html` (`build.format: 'file'`، `compressHTML: false`) وبينسخ `public/`.
2. كل `<style>` و`<script>` في الصفحات مكتوبين `is:inline` عشان Astro مايعملهمش scope أو bundle — الـCSS/JS بيطلع زي ما هو.
3. `scripts/postbuild.mjs`:
   - يفحص روابط `.html` المحلية ويوقف الـbuild لو فيه رابط مكسور.
   - يحوّل الروابط الداخلية لـclean URLs.
   - يصغّر الـCSS المكتوب جوه الصفحات و`global.css`.
   - يضيف preload للخط وصورة الهيرو، canonical/Open Graph/Twitter، وJSON-LD.
   - يولّد `sitemap.xml` و`robots.txt` و`_redirects` (301 من `.html`).
4. Cloudflare Pages ينشر `dist/`، ويطبّق `public/_headers` (cache طويل للصور والخطوط، أسبوع للـCSS/JS المتعلّمين بـ`?v=`).

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

خطوات لاحقة اختيارية: نقل الـCSS المكرر في الصفحات لـlayout مشترك، وصفحات المنتجات لـcontent collection.

### Shared shell ownership invariant
- `src/components/SiteHeader.astro`, `src/components/SiteFooter.astro`, `public/assets/css/global.css`, and `public/assets/js/site-navigation.js` exclusively own shared header/footer/navigation behavior.
- Page-level `<style>` or `<script>` blocks must not target `.site-header`, `.mobile-menu`, `.mobile-products`, `.desktop-nav`, `.mega-menu`, or other shared-shell selectors.
- Responsive navigation changes are made once in the shared shell and validated at desktop, tablet, and mobile widths before deployment.

## SEO output

`scripts/postbuild.mjs` generates `dist/sitemap.xml` and `dist/robots.txt` at build time; internal pages (`review-pages.html`, `design-system-preview.html`, `404.html`) are excluded.

## Responsive images

- أي صورة أعرض من 800px ليها نسخة `-720.webp` جنبها، والـ`<img>` فيه `width`/`height` و`srcset` و`sizes="(max-width: 820px) 40vw, 900px"`.
- الـ`40vw` مقصودة: بتخلّي الموبايلات عالية الكثافة تاخد نسخة الـ720 بدل الأصلية.

## Social meta & leads

- Build injects canonical/Open Graph/Twitter tags per public page (`socialMeta` in `scripts/postbuild.mjs`).
- All images are served locally from `public/assets/images/` (WebP); no third-party image hosts.
- Lead forms use `public/assets/js/lead-form.js` → Google Sheets (Apps Script web app) + WhatsApp. See `docs/google-sheets-crm.md`.
