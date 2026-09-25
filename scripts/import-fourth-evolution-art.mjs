import fs from 'node:fs';
import sharp from 'sharp';

const forms=JSON.parse(fs.readFileSync('lib/fourth-evolutions.json','utf8'));
const missing=forms.filter(({id})=>!fs.existsSync(`work/fourth-siplings/${id}.png`));
if(missing.length)throw Error(`Missing fourth-evolution originals: ${missing.map(({id})=>id).join(', ')}`);
for(const {id} of forms){
 await sharp(`work/fourth-siplings/${id}.png`).flatten({background:'#ffffff'}).resize(336,336,{fit:'contain',background:'#ffffff'}).extend({top:24,bottom:24,left:24,right:24,background:'#ffffff'}).webp({quality:94}).toFile(`public/siplings/${id}.webp`);
}
console.log(`Imported ${forms.length} complete fourth-evolution illustrations.`);
