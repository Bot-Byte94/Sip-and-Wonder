import fs from 'node:fs';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import {createHash} from 'node:crypto';
import {buildSync} from 'esbuild';
const source=buildSync({entryPoints:['lib/creatures.ts'],bundle:true,platform:'node',format:'esm',write:false}).outputFiles[0].text;
const {creatures}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const legendaryPlan=JSON.parse(fs.readFileSync('docs/legendary-sipling-art-prompts.json','utf8'));
assert.equal(legendaryPlan.assets.length,30,'All 30 Legendary illustrations must be planned');
for(const asset of legendaryPlan.assets){
 const creature=creatures[asset.number-1];
 assert.equal(creature.id,asset.id,'Legendary artwork must match its roster number');
 assert.equal(creature.rarity,'Legendary');
 assert.equal(creature.standaloneArt,true,'Legendary artwork must be preserved by atlas extraction');
 assert.equal(createHash('sha256').update(fs.readFileSync(`public/siplings/${asset.id}.webp`)).digest('hex'),asset.sha256,`${asset.id} must use its reviewed generated illustration`);
}
assert.equal(new Set(creatures.map(c=>c.id)).size,creatures.length);
assert.equal(fs.readdirSync('public/siplings').filter(f=>f.endsWith('.webp')).length,creatures.length);
const decodedImages=new Map();
for(const c of creatures){
 const {data,info}=await sharp(`public/siplings/${c.id}.webp`).removeAlpha().raw().toBuffer({resolveWithObject:true});
 const hash=createHash('sha256').update(data).digest('hex');
 assert(!decodedImages.has(hash),`${c.id} duplicates ${decodedImages.get(hash)}: each Sipling must have different artwork`);
 decodedImages.set(hash,c.id);
 assert.equal(info.width,384,c.id+' width');assert.equal(info.height,384,c.id+' height');
 let dark=0;
 for(let y=0;y<384;y++)for(let x=0;x<384;x++){
  const i=(y*384+x)*info.channels;
  if(Math.min(data[i],data[i+1],data[i+2])<220){dark++;assert(x>=20&&x<364&&y>=20&&y<364,c.id+' art touches frame');}
 }
 assert(dark>500,c.id+' image is empty');
}
const renderer=fs.readFileSync('app/creature-art.tsx','utf8');
assert(!/viewBox|clipPath|backgroundImage|roster-/.test(renderer),'Runtime still uses atlas crops');
assert(renderer.includes('/siplings/${creature.id}.webp'));
console.log(`${creatures.length} unique individual images verified: complete files, nonempty art, safe margins, and no runtime sheet cropping.`);
