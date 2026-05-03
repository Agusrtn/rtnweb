const fs = require('fs');
const width = 16;
const height = 16;
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);
const dir = Buffer.alloc(16);
dir.writeUInt8(width, 0);
dir.writeUInt8(height, 1);
dir.writeUInt8(0, 2);
dir.writeUInt8(0, 3);
dir.writeUInt16LE(1, 4);
dir.writeUInt16LE(32, 6);
const imgSize = 40 + width * height * 4 + height * 4;
dir.writeUInt32LE(imgSize, 8);
dir.writeUInt32LE(header.length + dir.length, 12);
const info = Buffer.alloc(40);
info.writeUInt32LE(40, 0);
info.writeInt32LE(width, 4);
info.writeInt32LE(height * 2, 8);
info.writeUInt16LE(1, 12);
info.writeUInt16LE(32, 14);
info.writeUInt32LE(0, 16);
info.writeUInt32LE(width * height * 4, 20);
info.writeInt32LE(0, 24);
info.writeInt32LE(0, 28);
info.writeUInt32LE(0, 32);
info.writeUInt32LE(0, 36);
info.writeUInt32LE(0, 40);
info.writeUInt32LE(0, 44);
const pixels = Buffer.alloc(width * height * 4);
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const idx = ((height - 1 - y) * width + x) * 4;
    const isInner = x >= 4 && x < 12 && y >= 4 && y < 12;
    const r = isInner ? 255 : 136;
    const g = isInner ? 255 : 50;
    const b = isInner ? 255 : 217;
    pixels[idx] = b;
    pixels[idx + 1] = g;
    pixels[idx + 2] = r;
    pixels[idx + 3] = 255;
  }
}
const mask = Buffer.alloc(height * 4, 0xff);
const out = Buffer.concat([header, dir, info, pixels, mask]);
fs.writeFileSync('favicon.ico', out);
console.log('favicon.ico created');
