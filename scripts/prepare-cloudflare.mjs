import { readFile, writeFile } from 'node:fs/promises';

// Run after npm run build. Keep Sites output intact and create a separate
// deployment configuration for the owner's Cloudflare account.
const [accountId, databaseId, bucketName] = process.argv.slice(2);
if (!/^[a-f0-9]{32}$/.test(accountId ?? '') || !/^[a-f0-9-]{36}$/.test(databaseId ?? '') || (bucketName && !/^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/.test(bucketName))) {
  throw new Error('Usage: node scripts/prepare-cloudflare.mjs ACCOUNT_ID DATABASE_ID [BUCKET_NAME]');
}
const output = new URL('../dist/server/', import.meta.url);
const config = JSON.parse(await readFile(new URL('wrangler.json', output), 'utf8'));
Object.assign(config, {
  name: 'sip-and-wonder',
  account_id: accountId,
  workers_dev: true,
  preview_urls: false,
  d1_databases: [{ binding: 'DB', database_name: 'sip-and-wonder', database_id: databaseId, migrations_dir: '../../drizzle' }],
  r2_buckets: bucketName ? [{ binding: 'BUCKET', bucket_name: bucketName }] : [],
  vars: { ...config.vars, INVITE_REQUIRED: 'true' },
});
delete config.topLevelName;
await writeFile(new URL('wrangler.cloudflare.json', output), JSON.stringify(config, null, 2) + '\n');
console.log('Cloudflare configuration ready in dist/server/wrangler.cloudflare.json');
