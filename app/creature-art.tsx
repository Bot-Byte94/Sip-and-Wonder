import {Sparkles} from 'lucide-react';
import type {Creature} from '@/lib/creatures';
export function CreatureArt({creature}:{creature:Creature}){
 return <div data-rarity={creature.rarity} data-stage={creature.stage} className={'creature-art creature-stage-'+creature.stage}>
  {/* Each entry owns a complete image; no atlas windows or runtime cropping. */}
  <img className="creature-sprite" src={`/siplings/${creature.id}.webp`} alt={creature.name} width={384} height={384} loading="lazy" decoding="async"/>
 </div>
}
export function MysteryArt(){return <div className="mystery-art" role="img" aria-label="Undiscovered Sipling"><Sparkles size={20}/><span>?</span><small>A little mystery</small></div>}
