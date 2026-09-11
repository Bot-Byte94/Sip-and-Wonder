'use client';

import { FormEvent, useState } from 'react';
import { Coffee, LogIn, UserPlus } from 'lucide-react';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true); setError('');
    try {
      const res = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: mode, email, password, displayName }) });
      const data = await res.json() as { error?: string };
      if (!res.ok) throw new Error(data.error ?? 'Please try again.');
      window.location.assign('/');
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Please try again.'); setBusy(false); }
  }
  return <main className="auth-page"><section className="auth-card"><div className="auth-brand"><Coffee size={28}/><span>Sip <i>&amp; Wonder</i></span></div><p className="eyebrow">YOUR COZY CORNER</p><h1>{mode === 'login' ? 'Welcome back.' : 'Make a little room.'}</h1><p className="auth-copy">Keep your coffee memories, quiet reflections, and Siplings together.</p><form onSubmit={submit}>{mode === 'signup' && <label>Your name<input value={displayName} onChange={e => setDisplayName(e.target.value)} autoComplete="name" required /></label>}<label>Email<input type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required /></label><label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={8} required /></label>{error && <p className="auth-error" role="alert">{error}</p>}<button className="primary-button" disabled={busy}>{mode === 'login' ? <><LogIn size={17}/>Sign in</> : <><UserPlus size={17}/>Create account</>}</button></form><button className="text-button auth-switch" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}>{mode === 'login' ? 'New here? Create an account' : 'Already have an account? Sign in'}</button></section></main>;
}