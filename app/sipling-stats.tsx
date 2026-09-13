'use client';
import {ArrowRight,Sparkles,Zap,Ruler} from 'lucide-react';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import type {Creature} from '@/lib/creatures';
import {evolutionProfile} from '@/lib/evolution';
import {CreatureArt} from './creature-art';

export function SiplingStats({creature}:{creature:Creature}){
 const profile=evolutionProfile(creature);
 return <section className="sipling-stats" aria-label={creature.name+' size and power'}>
  <div className="sipling-stage"><span>Stage {creature.stage} / 3</span><strong>{profile.label}</strong></div>
  <div className="sipling-measures"><span><Ruler size={16}/><strong>{profile.height} m</strong><small>Height</small></span><span><Zap size={16}/><strong>{profile.power}</strong><small>Power</small></span></div>
  <p className="signature-power"><Sparkles size={16}/>{profile.ability}</p>
  <small className="power-note">A glimpse of its natural magic.</small>
 </section>
}
export function EvolutionReveal({evolution,onClose,onInspect}:{evolution:{before:Creature;after:Creature}|null;onClose:()=>void;onInspect:(c:Creature)=>void}){
 if(!evolution)return null;
 const before=evolutionProfile(evolution.before);const after=evolutionProfile(evolution.after);
 return <Dialog open onOpenChange={open=>{if(!open)onClose()}}><DialogContent className="moment-dialog evolution-reveal">
  <span className="eyebrow">A BIGGER KIND OF WONDER</span>
  <DialogTitle>{evolution.after.name} has awakened!</DialogTitle>
  <DialogDescription>Your bond with {evolution.before.name} revealed a new form. Both friends stay in your collection.</DialogDescription>
  <div className="evolution-transformation"><div><CreatureArt creature={evolution.before}/><strong>{evolution.before.name}</strong></div><ArrowRight aria-hidden="true"/><div className="new-form"><CreatureArt creature={evolution.after}/><strong>{evolution.after.name}</strong></div></div>
  <div className="evolution-gains"><span><small>Height</small><strong>{before.height} → {after.height} m</strong></span><span><small>Power</small><strong>{before.power} → {after.power}</strong></span></div>
  <p className="signature-power"><Sparkles size={18}/>{after.ability}</p>
  <button className="primary-button" onClick={()=>onInspect(evolution.after)}>Get to know {evolution.after.name}<ArrowRight size={17}/></button>
 </DialogContent></Dialog>
}
