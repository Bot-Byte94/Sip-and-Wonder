import { database } from '@/lib/cafe-db';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const credentials = z.object({
  action: z.enum(['login', 'signup']),
  email: z.string().trim().email().max(200),
  password: z.string().min(8).max(128),
  displayName: z.string().trim().min(1).max(80).optional(),
});
const sessionCookie = 'sip_session';
const sessionDays = 30;

function response(data: unknown, status = 200, cookie?: string) {
  const headers = new Headers({ 'Cache-Control': 'no-store' });
  if (cookie) headers.set('Set-Cookie', cookie);
  return Response.json(data, { status, headers });
}

function base64(bytes: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)));
}

function bytes(length: number): Uint8Array {
  const value = new Uint8Array(length);
  crypto.getRandomValues(value);
  return value;
}

async function derive(password: string, salt: Uint8Array): Promise<string> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const hash = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, key, 256);
  return base64(hash);
}

async function hashToken(token: string): Promise<string> {
  return base64(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token)));
}

function cookie(token: string, maxAge: number) {
  return `${sessionCookie}=${token}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`;
}

function sameOrigin(req: Request) {
  const origin = req.headers.get('origin');
  return !origin || origin === new URL(req.url).origin;
}

export async function GET(req: Request) {
  const token = req.headers.get('cookie')?.match(/(?:^|; )sip_session=([^;]+)/)?.[1];
  if (!token) return response({ user: null });
  const db = database();
  const session = await db.prepare('SELECT u.id,u.email,u.display_name AS displayName,s.expires_at AS expiresAt FROM auth_sessions s JOIN auth_users u ON u.id=s.user_id WHERE s.token_hash=?').bind(await hashToken(token)).first<{ id: string; email: string; displayName: string; expiresAt: string }>();
  if (!session || session.expiresAt <= new Date().toISOString()) return response({ user: null }, 200, cookie('', 0));
  return response({ user: { id: session.id, email: session.email, displayName: session.displayName } });
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) return response({ error: 'Please use the café to sign in.' }, 403);
  const parsed = credentials.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return response({ error: 'Use a valid email and a password with at least 8 characters.' }, 400);
  const data = parsed.data;
  const db = database();
  const email = data.email.toLowerCase();
  const existing = await db.prepare('SELECT id,email,display_name AS displayName,password_hash AS passwordHash,password_salt AS passwordSalt FROM auth_users WHERE email=?').bind(email).first<{ id: string; email: string; displayName: string; passwordHash: string; passwordSalt: string }>();
  if (data.action === 'signup' && existing) return response({ error: 'An account with that email already exists.' }, 409);
  if (data.action === 'login' && (!existing || (await derive(data.password, Uint8Array.from(atob(existing.passwordSalt), c => c.charCodeAt(0)))) !== existing.passwordHash)) return response({ error: 'That email or password does not match.' }, 401);
  const user = existing ?? { id: crypto.randomUUID(), email, displayName: data.displayName!.trim(), passwordHash: '', passwordSalt: '' };
  if (!existing) { const salt = bytes(16); user.passwordSalt = base64(salt); user.passwordHash = await derive(data.password, salt); await db.prepare('INSERT INTO auth_users (id,email,display_name,password_hash,password_salt,created_at) VALUES (?,?,?,?,?,?)').bind(user.id, user.email, user.displayName, user.passwordHash, user.passwordSalt, new Date().toISOString()).run(); }
  const token = base64(bytes(32)).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
  await db.prepare('INSERT INTO auth_sessions (token_hash,user_id,expires_at,created_at) VALUES (?,?,?,?)').bind(await hashToken(token), user.id, new Date(Date.now() + sessionDays * 86400000).toISOString(), new Date().toISOString()).run();
  return response({ user: { id: user.id, email: user.email, displayName: user.displayName } }, 200, cookie(token, sessionDays * 86400));
}

export async function DELETE(req: Request) {
  if (!sameOrigin(req)) return response({ error: 'Please use the café to sign out.' }, 403);
  const token = req.headers.get('cookie')?.match(/(?:^|; )sip_session=([^;]+)/)?.[1];
  if (token) await database().prepare('DELETE FROM auth_sessions WHERE token_hash=?').bind(await hashToken(token)).run();
  return response({ ok: true }, 200, cookie('', 0));
}