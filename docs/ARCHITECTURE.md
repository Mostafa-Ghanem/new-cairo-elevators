# Architecture — New Cairo Elevators

_Last updated: 2026-09-14_

## الهدف

المشروع ما زال HTML/CSS/JS بسيطًا أثناء مرحلة التطوير، لكن هيكلته من الآن تشبه Theme Builder / Astro Layouts: الـHeader والـFooter لهما مصدر واحد، ويتم توليد صفحات HTML كاملة وقت الـbuild. هذا يمنع تكرار نفس الـnavigation في 19 صفحة ويحافظ على SEO لأن النسخة المنشورة تحتوي HTML كاملًا وليست Client-side includes.

## الهيكل الحالي

```text
/
├─ *.html                         # Page source files + component markers
├─ components/
│  ├─ site-header.html            # Topbar + Header + Mega Menu + Mobile Menu
│  └─ site-footer.html            # Shared footer
├─ assets/
│  ├─ css/global.css              # Global design system + shared component CSS
│  └─ js/site-navigation.js       # Active state + accessible menu interactions
├─ scripts/
│  └─ build.mjs                   # Static layout compiler + link validation
├─ package.json
├─ CHANGELOG.md
├─ AGENTS.md
└─ dist/                          # Generated output; ignored by Git
```

## Build flow

1. كل صفحة مصدر تحتوي:
   - `<!-- @component:site-header -->`
   - `<!-- @component:site-footer -->`
2. `scripts/build.mjs` يقرأ `components/site-header.html` و`components/site-footer.html`.
3. يستبدل الـmarkers داخل كل ملفات `.html`.
4. ينسخ `assets/` و`manifest.json` إلى `dist/`.
5. يفحص روابط `.html` المحلية ويوقف الـbuild إذا وجد رابط صفحة مكسور.
6. Cloudflare Pages ينشر `dist/`.

## قواعد الـShared Layout

- أي تعديل على الـHeader أو الـMega Menu يتم في `components/site-header.html` فقط.
- أي تعديل على الـFooter يتم في `components/site-footer.html` فقط.
- CSS الخاص بالمكونات المشتركة يكون في `assets/css/global.css`.
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

الحالة النشطة وسلوك click / Escape / outside-click يتمان في `assets/js/site-navigation.js`. الموبايل يستخدم Accordion مستقل داخل نفس الـHeader component.

## Cloudflare Pages

Production configuration:

```text
Branch: main
Build command: npm run build
Output directory: dist
Root directory: /
```

## مسار التحويل إلى Astro

التحويل المستقبلي مقصود أن يكون Mechanical قدر الإمكان:

| الحالي | Astro لاحقًا |
|---|---|
| `components/site-header.html` | `src/components/SiteHeader.astro` |
| `components/site-footer.html` | `src/components/SiteFooter.astro` |
| `*.html` | `src/pages/*.astro` |
| `assets/css/global.css` | `src/styles/global.css` |
| `assets/js/site-navigation.js` | inline/module script داخل component عند الحاجة |
| `scripts/build.mjs` | يتم حذفه؛ Astro يتولى الـbuild |

عند بدء الهجرة لا يتم تغيير الـURLs الحالية إلا بقرار موثق؛ الحفاظ على نفس slugs مهم للـSEO.

### Shared shell ownership invariant
- `components/site-header.html`, `components/site-footer.html`, `assets/css/global.css`, and `assets/js/site-navigation.js` exclusively own shared header/footer/navigation behavior.
- Page-level `<style>` or `<script>` blocks must not target `.site-header`, `.mobile-menu`, `.mobile-products`, `.desktop-nav`, `.mega-menu`, or other shared-shell selectors.
- Responsive navigation changes are made once in the shared shell and validated at desktop, tablet, and mobile widths before deployment.

## SEO output

`scripts/build.mjs` generates `dist/sitemap.xml` and `dist/robots.txt` at build time; internal pages (`review-pages.html`, `design-system-preview.html`, `404.html`) are excluded.

## Social meta & leads

- Build injects canonical/Open Graph/Twitter tags per public page (`socialMeta` in `scripts/build.mjs`).
- All images are served locally from `assets/images/` (WebP); no third-party image hosts.
- Lead forms use `assets/js/lead-form.js` → Google Sheets (Apps Script web app) + WhatsApp. See `docs/google-sheets-crm.md`.
