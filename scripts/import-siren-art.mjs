// Re-encode complete generated sprites with the collection's standard safe margin.
// Usage: node scripts/import-siren-art.mjs <directory containing ID.png files>
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const directory=process.argv[2];
if(!directory)throw new Error('Provide the directory containing the five original siren PNGs.');
const forms=JSON.parse(fs.readFileSync('lib/emerald-siren.json','utf8'));
for(const {id} of forms){
 const source=path.join(directory,`${id}.png`);
 if(!fs.existsSync(source))throw new Error(`Missing original art: ${source}`);
}
for(const {id} of forms){
 await sharp(path.join(directory,`${id}.png`)).flatten({background:'#ffffff'})
  .resize(336,336,{fit:'contain',background:'#ffffff'})
  .extend({top:24,bottom:24,left:24,right:24,background:'#ffffff'})
  .webp({quality:94}).toFile(`public/siplings/${id}.webp`);
}
console.log('Imported five complete siren sprites with safe margins.');
