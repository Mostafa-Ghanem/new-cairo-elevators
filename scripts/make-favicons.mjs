// Generates the browser-tab / home-screen icons from the brand logo (run once after changing the logo;
// outputs are committed): public/favicon.ico (32px PNG inside an ICO), favicon-32.png and apple-touch-icon.png (180px).
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

const src = 'public/assets/images/brand/logo-source.png';
const png = (size) => sharp(src).resize(size, size, { kernel: 'lanczos3' }).png({ compressionLevel: 9, palette: true, quality: 90 }).toBuffer();

const p32 = await png(32);
await writeFile('public/favicon-32.png', p32);
await writeFile('public/apple-touch-icon.png', await png(180));

// ICO container with one embedded PNG entry (supported by all current browsers).
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(1, 4);
header.writeUInt8(32, 6); header.writeUInt8(32, 7); header.writeUInt16LE(1, 10); header.writeUInt16LE(32, 12);
header.writeUInt32LE(p32.length, 14); header.writeUInt32LE(22, 18);
await writeFile('public/favicon.ico', Buffer.concat([header, p32]));
console.log('favicons written');
