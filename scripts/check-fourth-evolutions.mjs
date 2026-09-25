import fs from 'node:fs';
import assert from 'node:assert/strict';
import ts from 'typescript';

// Compile this small, pure domain graph in memory without a platform-specific bundler.
const modules=new Map();
function moduleUrl(name){
 if(modules.has(name))return modules.get(name);
 let source=fs.readFileSync(`lib/${name}.ts`,'utf8');
 source=source.replace(/import (\w+) from '(\.\/.+?\.json)';/g,(_,binding,path)=>`const ${binding}=${fs.readFileSync('lib/'+path,'utf8')};`);
 source=source.replace(/from '\.\/(creatures)'/g,(_,dependency)=>`from '${moduleUrl(dependency)}'`);
 const js=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
 const url='data:text/javascript;base64,'+Buffer.from(js).toString('base64');
 modules.set(name,url);return url;
}
const {creatures,creatureById,familyStageCount}=await import(moduleUrl('creatures'));
const {act,initialAdventure,evolveTarget,bondNeeded,unlockedCreatures,publicAdventure,habitats}=await import(moduleUrl('adventure'));
const {evolutionProfile}=await import(moduleUrl('evolution'));
const forms=JSON.parse(fs.readFileSync('lib/fourth-evolutions.json','utf8'));
assert.equal(forms.length,13);
assert.equal(creatures.length,630+forms.length);
assert.equal(new Set(creatures.map(c=>c.id)).size,creatures.length);
assert.deepEqual(creatures.slice(630,633).map(c=>c.id),['astralynx','solcanis','eversylva']);
assert.deepEqual(creatures.slice(630).map(c=>c.id),forms.map(c=>c.id));
assert.equal(creatures[306].id,'nebulynx');
assert.equal(creatures[335].id,'worldsong');
for(const form of forms){
 const previous=creatureById(form.predecessor),next=creatureById(form.id);
 assert.equal(evolveTarget(previous.id).id,next.id);
 assert.equal(familyStageCount(previous.family),4);
 assert.equal(bondNeeded(previous.id),90);
 assert.equal(evolveTarget(next.id),undefined);
 assert.equal(bondNeeded(next.id),0);
 const before=evolutionProfile(previous),after=evolutionProfile(next);
 assert(after.height>before.height&&after.power>before.power);
 assert.equal(after.label,'Transcendent');assert.equal(after.ability,form.ability);
 for(const stat of Object.keys(previous.stats))assert(next.stats[stat]>previous.stats[stat]);
 const state=initialAdventure();
 assert.throws(()=>act(state,0,{type:'evolve',creatureId:previous.id}),/Meet this Sipling/);
 state.discovered.push(previous.id);state.bonds[previous.id]=89;
 assert.throws(()=>act(state,0,{type:'evolve',creatureId:previous.id}),/Grow your bond/);
 assert(!state.discovered.includes(next.id));
 state.bonds[previous.id]=90;
 act(state,0,{type:'evolve',creatureId:previous.id});
 assert(state.discovered.includes(previous.id)&&state.discovered.includes(next.id));
 assert(publicAdventure(state,0).seen.includes(next.id));
 assert.equal(state.evolutions,1);assert.equal(state.bonds[next.id],0);
 assert.throws(()=>act(state,0,{type:'evolve',creatureId:previous.id}),/already/);
 assert.throws(()=>act(state,0,{type:'evolve',creatureId:next.id}),/final form/);
 assert(!unlockedCreatures(initialAdventure(),1000000).includes(next.id));
}
assert.equal(familyStageCount('Glimmerimp'),3);
assert.equal(evolveTarget('luxoracle'),undefined);
assert.equal(bondNeeded('bean'),18);assert.equal(bondNeeded('fernox'),42);
for(const habitat of habitats)for(const roll of [.2,.8,.98]){
 const state=initialAdventure();let calls=0;
 act(state,0,{type:'explore',habitat:habitat.id},()=>calls++===0?roll:0);
 assert(creatureById(state.encounter.creatureId).stage<4);
}
// Even after every ordinary Legendary is owned, a hard riddle cannot bypass bonding.
let solved=false;
for(const answer of ['clock','kindness','joke']){
 const state=initialAdventure();state.discovered=creatures.filter(c=>c.stage<4).map(c=>c.id);
 try{act(state,0,{type:'solve-riddle',difficulty:'hard',answer},()=>0);solved=true;}
 catch(error){if(!/Not quite/.test(error.message))throw error;continue;}
 assert(!forms.some(form=>state.discovered.includes(form.id)));break;
}
assert(solved,'The current weekly riddle should be tested');
console.log('Fourth-tier progression verified: bond boundary, ownership, retained forms, terminal stages, stats, stable numbering, and no trail/riddle/coffee bypass.');
