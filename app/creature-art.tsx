import {Sparkles} from 'lucide-react';
import type {Creature} from '@/lib/creatures';
export function CreatureArt({creature}:{creature:Creature}){
 const assetRoot=creature.stage===4?'/transparent-siplings':'/siplings';
 const assetId=creature.id==='cindervalkyr'?'cindervalkyr.fix':creature.id;
 return <div data-rarity={creature.rarity} data-stage={creature.stage} className={'creature-art creature-stage-'+creature.stage}>
  {/* Each entry owns a complete image; no atlas windows or runtime cropping. */}
  {/* Legacy path shape: /siplings/${creature.id}.webp */}
  <img className="creature-sprite" src={`${assetRoot}/${assetId}.webp?v=transparent-fourth-tier-20260925`} alt={creature.name} width={384} height={384} loading="lazy" decoding="async"/>
 </div>
}
export function MysteryArt(){return <div className="mystery-art" role="img" aria-label="Undiscovered Sipling"><Sparkles size={20}/><span>?</span><small>A little mystery</small></div>}
