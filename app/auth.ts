import { headers } from "next/headers";
import { env } from "cloudflare:workers";
import { database } from "@/lib/cafe-db";

export type AppUser = { userId: string; displayName: string; email: string; fullName: string | null; isAdmin: boolean };

export async function getCurrentUser(): Promise<AppUser | null> {
  const token = (await headers()).get("cookie")?.match(/(?:^|; )sip_session=([^;]+)/)?.[1];
  if (!token) return null;
  const tokenHash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  const hash = btoa(String.fromCharCode(...new Uint8Array(tokenHash)));
  const session = await database().prepare("SELECT u.id,u.email,u.display_name AS displayName,s.expires_at AS expiresAt FROM auth_sessions s JOIN auth_users u ON u.id=s.user_id WHERE s.token_hash=?").bind(hash).first<{ id: string; email: string; displayName: string; expiresAt: string }>();
  if (!session || session.expiresAt <= new Date().toISOString()) return null;
  return { userId: session.id, displayName: session.displayName, email: session.email, fullName: session.displayName, isAdmin: env.ADMIN_EMAIL?.trim().toLowerCase() === session.email.toLowerCase() };
}