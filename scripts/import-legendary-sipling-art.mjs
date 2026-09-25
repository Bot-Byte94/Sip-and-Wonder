// Import complete standalone illustrations; never crop creature anatomy.
import fs from 'node:fs';
import sharp from 'sharp';

const {assets}=JSON.parse(fs.readFileSync('docs/legendary-sipling-art-prompts.json','utf8'));
const missing=assets.filter(({id})=>!fs.existsSync(`work/legendary-siplings/${id}.png`));
if(missing.length)throw Error(`Missing Legendary originals: ${missing.map(({id})=>id).join(', ')}`);
for(const {id} of assets){
 await sharp(`work/legendary-siplings/${id}.png`).flatten({background:'#ffffff'}).resize(336,336,{fit:'contain',background:'#ffffff'}).extend({top:24,bottom:24,left:24,right:24,background:'#ffffff'}).webp({quality:94}).toFile(`public/siplings/${id}.webp`);
}
console.log(`Imported ${assets.length} complete Legendary illustrations with safe margins.`);
