import {useId} from 'react';
import {Sparkles} from 'lucide-react';
import atlas from '@/lib/creature-atlas.json';
import type {Creature} from '@/lib/creatures';
export function CreatureArt({creature}:{creature:Creature}){
 const clipId=useId().replace(/:/g,'');
 const sheet=atlas[String(creature.sheet) as keyof typeof atlas];
 const bounds=sheet.cells[creature.cell];
 // Generated sheets have uneven gutters. Use measured per-cell rectangles.
 return <div role="img" aria-label={creature.name} data-rarity={creature.rarity} data-stage={creature.stage} className={'creature-art creature-stage-'+creature.stage}>
  <svg className="creature-sprite" viewBox={bounds.join(' ')} preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
   <defs><clipPath id={clipId}><polygon points={sheet.clips[creature.cell]}/></clipPath></defs>
   <image clipPath={`url(#${clipId})`} href={`/${sheet.file}`}  x="0" y="0" width={sheet.width} height={sheet.height} preserveAspectRatio="none"/>
  </svg>
 </div>
}
export function MysteryArt(){return <div className="mystery-art" role="img" aria-label="Undiscovered Sipling"><Sparkles size={20}/><span>?</span><small>A little mystery</small></div>}
