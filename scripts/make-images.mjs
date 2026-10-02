// Generates the derived image files that src/components/Img.astro serves, and commits-ready:
//   <name>.avif                AVIF of every photo in public/assets/images used by src/ (brand/ excluded)
//   <name>-<w>.avif            AVIF of every existing responsive WebP variant (<name>-<w>.webp)
//   <name>-720.webp            created for photos wider than 800px if missing
//   scripts/lqip.json          ~400-byte blurred WebP data URI per photo (loading placeholder)
// Run after adding or replacing a photo:  node scripts/make-images.mjs
// Existing outputs newer than their source are skipped.
import sharp from 'sharp';
import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const IMAGES = path.join(ROOT, 'public/assets/images');
const AVIF = { quality: 58, effort: 6 };
const VARIANT = /-(\d+)\.webp$/;

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) { if (entry.name !== 'brand') out.push(...await walk(full)); }
    else out.push(full);
  }
  return out;
}
async function walkAll(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    out.push(...(entry.isDirectory() ? await walkAll(full) : [full]));
  }
  return out;
}
const mtime = async (f) => (await stat(f).catch(() => null))?.mtimeMs ?? 0;
const fresh = async (out, src) => (await mtime(out)) >= (await mtime(src));

const files = await walk(IMAGES);
// <name>-<w>.webp is a size variant only if <name>.webp exists (so gallery-05.webp is a photo, hero-720.webp a variant)
const isVariant = (f) => VARIANT.test(f) && files.includes(f.replace(VARIANT, '.webp'));
const variantsOf = (base) => files.filter((f) => isVariant(f) && f.replace(VARIANT, '') === base);
// Only photos the site actually references (any file under src/) are processed.
const srcText = (await Promise.all((await walkAll(path.join(ROOT, 'src'))).map((f) => readFile(f, 'utf8')))).join('\n');
const used = (f) => srcText.includes(path.relative(path.join(ROOT, 'public'), f));
const photos = files.filter((f) => f.endsWith('.webp') && !isVariant(f) && !f.endsWith('-poster.webp') && used(f));
const lqip = {};
let made = 0;

for (const src of photos.sort()) {
  const base = src.slice(0, -'.webp'.length);
  const { width } = await sharp(src).metadata();

  if (width > 800 && variantsOf(base).length === 0) {
    await sharp(src).resize({ width: 720 }).webp({ quality: 72 }).toFile(`${base}-720.webp`);
    files.push(`${base}-720.webp`); made++;
  }
  if (!await fresh(`${base}.avif`, src)) { await sharp(src).avif(AVIF).toFile(`${base}.avif`); made++; }
  for (const variant of variantsOf(base)) {
    const w = Number(variant.match(VARIANT)[1]);
    const out = variant.replace(/\.webp$/, '.avif');
    if (!await fresh(out, src)) { await sharp(src).resize({ width: w }).avif(AVIF).toFile(out); made++; }
  }
  const tiny = await sharp(src).resize({ width: 20 }).webp({ quality: 40 }).toBuffer();
  lqip[path.relative(path.join(ROOT, 'public'), src)] = `data:image/webp;base64,${tiny.toString('base64')}`;
}

await writeFile(path.join(ROOT, 'scripts/lqip.json'), `${JSON.stringify(lqip, null, 2)}\n`);
console.log(`${photos.length} photos, ${made} files written, lqip.json updated.`);
