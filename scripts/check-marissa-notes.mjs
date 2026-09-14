import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { transform } from 'esbuild';
const source=await readFile(new URL('../lib/marissa-notes.ts',import.meta.url),'utf8');
const {code}=await transform(source,{loader:'ts',format:'esm',target:'es2022'});
const {milestones,surpriseNotes,milestoneNote,randomNote,rememberSurprise}=await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
const all=[...milestones,...surpriseNotes];
assert.equal(all.length,200);
assert.equal(milestones.length,40);
assert.equal(surpriseNotes.length,160);
assert.equal(surpriseNotes.filter(n=>n.id.startsWith('dad-joke-')).length,50);
assert.equal(surpriseNotes.filter(n=>n.id.startsWith('christian-faith-')).length,50);
assert.equal(new Set(all.map(n=>n.id)).size,200,'IDs must be unique');
assert.equal(new Set(all.map(n=>n.message.toLowerCase().trim())).size,200,'Messages must be distinct');
assert.ok(all.every(n=>n.title.length>0 && n.message.length>0 && n.message.length<300));
const zero={coffees:0,friends:1,explorations:0,evolutions:0,care:0,games:0};
assert.equal(milestoneNote(zero,[]),null);
for(const note of milestones){
 const others=milestones.filter(n=>n.id!==note.id).map(n=>n.id);
 assert.equal(milestoneNote({...zero,[note.metric]:note.at-1},others),null);
 assert.equal(milestoneNote({...zero,[note.metric]:note.at},others)?.note.id,note.id);
}
const max={coffees:10000,friends:600,explorations:10000,evolutions:10000,care:10000,games:10000};
let seen=[];
for(let i=0;i<40;i++){
 const choice=milestoneNote(max,seen);
 assert.ok(choice && !seen.includes(choice.note.id));
 assert.deepEqual(choice.covered,[choice.note.id],'Never discard an unlocked note without displaying it');
 seen.push(...choice.covered);
}
assert.equal(milestoneNote(max,seen),null);
let history=[];let previous='';
for(let cycle=0;cycle<3;cycle++){
 const shown=new Set();
 for(let i=0;i<160;i++){
  const note=randomNote(history,()=>((i*73+cycle*17)%160)/160);
  assert.ok(!shown.has(note.id),'Every surprise appears before the cycle repeats');
  assert.notEqual(note.id,previous,'No consecutive duplicate at cycle boundaries');
  shown.add(note.id);previous=note.id;
  history=rememberSurprise(history,note.id);
  // Stored device preferences survive a reload.
  history=JSON.parse(JSON.stringify(history));
 }
 assert.equal(shown.size,160);
}
assert.deepEqual(rememberSurprise(['obsolete','made-for-you','made-for-you'],'warmth'),['made-for-you','warmth']);
console.log('200 unique notes verified; all milestone boundaries and three full surprise rotations passed.');
