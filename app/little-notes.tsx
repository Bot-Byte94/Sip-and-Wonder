"use client";

import { useEffect, useRef, useState } from 'react';
import { Heart, Mail, X } from 'lucide-react';
import { milestoneNote, randomNote, type LittleNote, type NoteProgress } from '@/lib/marissa-notes';

type Preferences = { paused: boolean; milestones: string[]; surprises: string[]; lastShown: number };
const empty = (): Preferences => ({paused:false,milestones:[],surprises:[],lastShown:0});
const delay = () => 90_000 + Math.random() * 90_000;
export function LittleNotes({ userId, progress, blocked }: { userId: string; progress: NoteProgress; blocked: boolean }) {
  const [note,setNote] = useState<LittleNote|null>(null);
  const [paused,setPaused] = useState(false);
  const preferences = useRef<Preferences>(empty());
  const nextAt = useRef(Infinity);
  const count = useRef(0);
  const latest = useRef({progress,blocked});
  const active = useRef(false);
  const storageKey = `sip-and-wonder:little-notes:v1:${userId}`;
  useEffect(()=>{ latest.current = {progress,blocked}; },[progress,blocked]);
  const persist = () => {
    try { localStorage.setItem(storageKey,JSON.stringify(preferences.current)); } catch { /* Notes still work when device storage is unavailable. */ }
  };
  useEffect(()=>{
    try {
      const value = JSON.parse(localStorage.getItem(storageKey) || 'null');
      if(value && typeof value.paused==='boolean' && Array.isArray(value.milestones) && Array.isArray(value.surprises) && Number.isFinite(value.lastShown)) preferences.current = value;
    } catch { /* Use defaults for unavailable or invalid device preferences. */ }
    setPaused(preferences.current.paused);
    nextAt.current = Math.max(Date.now()+delay(),preferences.current.lastShown+300_000);
    const timer = setInterval(()=>{
      const {progress,blocked} = latest.current;
      const focus = document.activeElement;
      const writing = focus instanceof HTMLElement && (focus.isContentEditable || ['INPUT','TEXTAREA','SELECT'].includes(focus.tagName));
      if(blocked || writing || document.visibilityState!=='visible' || active.current || preferences.current.paused || count.current>=3 || Date.now()<nextAt.current) return;
      const milestone = milestoneNote(progress,preferences.current.milestones);
      const chosen = milestone?.note ?? randomNote(preferences.current.surprises);
      if(milestone) preferences.current.milestones.push(...milestone.covered);
      else preferences.current.surprises = [...preferences.current.surprises,chosen.id].slice(-12);
      preferences.current.lastShown = Date.now();
      try { localStorage.setItem(storageKey,JSON.stringify(preferences.current)); } catch { /* Device-local preferences are optional. */ }
      active.current = true;
      count.current++;
      setNote(chosen);
    },3000);
    return ()=>clearInterval(timer);
  },[storageKey]);
  function dismiss() {
    active.current=false;
    setNote(null);
    nextAt.current=Date.now()+300_000+Math.random()*120_000;
  }
  function openNote() {
    const chosen=randomNote(preferences.current.surprises);
    preferences.current.surprises=[...preferences.current.surprises,chosen.id].slice(-12);
    preferences.current.lastShown=Date.now();
    persist();
    active.current=true;
    setNote(chosen);
  }
  function toggle() {
    preferences.current.paused=!preferences.current.paused;
    setPaused(preferences.current.paused);
    persist();
    dismiss();
  }
  return <>
    <div className="little-note-controls">
      <button onClick={openNote} disabled={blocked}><Mail size={17}/> A little note for you</button>
      <button role="switch" aria-checked={!paused} onClick={toggle} title="Saved on this device">Surprise notes: {paused?'paused':'on'}</button>
    </div>
    <div className="little-note-announcer" role="status" aria-live="polite" aria-atomic="true">{note&&!blocked?`${note.title}. ${note.message}`:''}</div>
    {note&&!blocked&&<aside className="little-note-card" aria-label="A little note for Marissa">
      <div className="little-note-top"><span><Heart size={16}/> A LITTLE NOTE FOR YOU</span><button onClick={dismiss} aria-label="Close little note"><X size={20}/></button></div>
      <h2>{note.title}</h2><p>{note.message}</p>
      <button className="little-note-dismiss" onClick={dismiss}>Tuck it in my pocket <Heart size={15}/></button>
    </aside>}
  </>;
}
