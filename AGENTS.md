# AGENTS.md — Project Rules

هذه القواعد ملزمة لأي AI agent أو مطور يعمل على هذا المستودع.

## 1) توثيق كل تعديل

- **أي Commit يغيّر الكود أو المحتوى يجب أن يضيف سطرًا واضحًا إلى `CHANGELOG.md`.**
- لو التعديل معماري أو يغيّر طريقة الـbuild أو الـdeployment، حدّث `docs/ARCHITECTURE.md` أيضًا.
- لا تكتب وصفًا عامًا مثل “updates”; اذكر الملفات/السلوك الذي تغير ولماذا.

## 2) Header / Footer / Navigation

- ممنوع نسخ أو إنشاء Header/Footer مستقل داخل أي صفحة.
- المصدر الوحيد للهيدر والـMega Menu: `components/site-header.html`.
- المصدر الوحيد للفوتر: `components/site-footer.html`.
- السلوك التفاعلي: `assets/js/site-navigation.js`.
- Styling المشترك: `assets/css/global.css`.

## 3) Build قبل التسليم

شغّل دائمًا:

```bash
npm run check
```

ويجب ألا توجد component markers غير محلولة أو روابط HTML محلية مكسورة.

## 4) لا تعدّل dist/

`dist/` build artifact فقط وموجود في `.gitignore`. أي تعديل يجب أن يكون في source files/components/assets.

## 5) Astro migration readiness

- لا تدخل Framework-specific hacks في الصفحات الحالية بدون ضرورة.
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
