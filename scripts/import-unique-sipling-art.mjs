// Normalize complete, individually generated artwork without cropping any part
// of the source image. This is sizing/encoding only, not atlas extraction.
import fs from 'node:fs';
import sharp from 'sharp';
const plan=JSON.parse(fs.readFileSync('docs/unique-sipling-art-prompts.json')).assets;
const missing=plan.filter(c=>!fs.existsSync(`work/unique-siplings/${c.id}.png`));
if(missing.length)throw Error(`Missing ${missing.length} original images; first: ${missing[0].id}. Do not publish an incomplete collection.`);
for(const c of plan){
 await sharp(`work/unique-siplings/${c.id}.png`).flatten({background:'#ffffff'}).resize(336,336,{fit:'contain',background:'#ffffff'}).extend({top:24,bottom:24,left:24,right:24,background:'#ffffff'}).webp({quality:94}).toFile(`public/siplings/${c.id}.webp`);
}
console.log(`Imported ${plan.length} complete unique illustrations with safe margins.`);
