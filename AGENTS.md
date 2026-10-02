# AGENTS.md — Project Rules

هذه القواعد ملزمة لأي AI agent أو مطور يعمل على هذا المستودع.

## 1) توثيق كل تعديل

- **أي Commit يغيّر الكود أو المحتوى يجب أن يضيف سطرًا واضحًا إلى `CHANGELOG.md`.**
- لو التعديل معماري أو يغيّر طريقة الـbuild أو الـdeployment، حدّث `docs/ARCHITECTURE.md` أيضًا.
- لا تكتب وصفًا عامًا مثل “updates”; اذكر الملفات/السلوك الذي تغير ولماذا.

## 2) Header / Footer / Navigation

- ممنوع نسخ أو إنشاء Header/Footer مستقل داخل أي صفحة.
- المصدر الوحيد للهيدر والـMega Menu: `src/components/SiteHeader.astro`.
- المصدر الوحيد للفوتر: `src/components/SiteFooter.astro`.
- السلوك التفاعلي: `public/assets/js/site-navigation.js`.
- Styling المشترك: `public/assets/css/global.css`.

## 3) Build قبل التسليم

شغّل دائمًا:

```bash
npm run check
```

ويجب ألا توجد component markers غير محلولة أو روابط HTML محلية مكسورة.

## 4) لا تعدّل dist/

`dist/` build artifact فقط وموجود في `.gitignore`. أي تعديل يجب أن يكون في source files/components/assets.

## 5) Astro

- الموقع مبني بـAstro: الصفحات في `src/pages/*.astro` والملفات الثابتة في `public/`. أي `<style>`/`<script>` جوه صفحة لازم يكون `is:inline`.
- كل صفحة لازم تستخدم `src/layouts/BaseLayout.astro` (title/description كـprops، والـstyle في `slot="head"`). ممنوع `<html>`/`<head>` جوه صفحة.
- بيانات السيو (الشركة، الـSchema، صفحات المنتجات، الصفحات الداخلية) مصدرها الوحيد `src/lib/site.ts`.
- الصور في الصفحات بـ`src/components/Img.astro` (مش `<img>`). بعد إضافة/تغيير صورة شغّل `npm run images` واعمل commit للملفات الناتجة.
- `npm run check` = `astro check` (TypeScript) + build؛ نفس اللي بيشتغل في GitHub Actions على كل PR.
- صفحات المنتجات: المحتوى في `src/content/products/<slug>.json` والقالب `src/pages/[product].astro`. ممنوع ترجع صفحة منتج كملف `.astro` منفصل.
- حافظ على boundaries واضحة بين Page Content وShared Layout.
- حافظ على URLs الحالية وأسماء الصفحات ما لم يوجد قرار SEO موثق.

## 6) UI rules

- RTL أولًا.
- Alexandria هو الخط الأساسي.
- التزم بالـPremium Corporate / Navy & Champagne design system.
- أي component جديد يجب أن يكون Responsive وKeyboard accessible وألا يكسر reduced-motion.

## 7) Cloudflare

- Production branch: `main`.
- Build: `npm run build`.
- Output: `dist`.
- لا تستخدم خدمة Cloudflare مدفوعة بدون قرار صريح من مالك المشروع.

- ممنوع إضافة CSS/JS خاص بالـHeader أو Footer أو Navigation داخل صفحات منفردة؛ التعديل يتم حصريًا في الـshared shell (`src/components/*`, `public/assets/css/global.css`, `public/assets/js/site-navigation.js`).

## 8) Responsive

- أي تعديل في التصميم لازم يلتزم بـ`docs/RESPONSIVE.md` ويتختبر على 390×844 و768×1024 و**1366×650** و1920×950.
- الهيرو وأي سكشن صور لازم يدخل في شاشة لابتوب 14" (1366×650) من غير سكرول.
- أي refactor مفروض مايغيّرش الشكل لازم يعدّي `scripts/visual-diff.mjs` (كل الصور identical) قبل الدمج.
- CSS الصفحات مكانه `src/styles/*.css` (مش جوه ملف `.astro`). ممنوع إضافة `!important` جديد في `global.css` من غير سبب مكتوب في comment.
