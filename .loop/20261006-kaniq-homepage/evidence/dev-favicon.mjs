import sharp from 'sharp';
import {writeFileSync} from 'node:fs';
const svg=Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fill="#23453F" d="M16 2a12 12 0 0 1 12 12c0 8-12 16-12 16S4 22 4 14A12 12 0 0 1 16 2z"/></svg>');
const png=await sharp(svg).resize(32,32).png().toBuffer();
const header=Buffer.alloc(22);header.writeUInt16LE(1,2);header.writeUInt16LE(1,4);header[6]=32;header[7]=32;header.writeUInt16LE(1,10);header.writeUInt16LE(32,12);header.writeUInt32LE(png.length,14);header.writeUInt32LE(22,18);writeFileSync('src/app/favicon.ico',Buffer.concat([header,png]));
