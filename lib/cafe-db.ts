import { env } from 'cloudflare:workers';
export function database(){if(!env.DB)throw new Error('Journal storage is unavailable');return env.DB;}
export function photos(){if(!env.BUCKET)throw new Error('Photo storage is unavailable');return env.BUCKET;}
