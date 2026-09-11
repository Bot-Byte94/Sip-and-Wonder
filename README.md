# Sip & Wonder

A personal café for coffee memories, gentle faith reflections, and original Siplings.

## Features

- Coffee journal with optional photos and mood.
- Open-ended faith and gratitude prompts; no assumed denomination.
- An expandable field guide of 306 original Siplings in 102 families and three stages, discovered through coffee milestones.
- Permanent Sipling progress, with favorites, rarity, family views, and collection search.
- Café colors, a little plant, and a personal note.
- Private, account-scoped D1 records and R2 photos. No browser-only journal storage.

- Six exploration habitats, persistent encounters, treats, trail tickets, and stars.
- A server-managed matching game, Sipling bonding, evolution, and one-time quest rewards.
- Exploration can discover every species; the larger roster is not locked behind coffee consumption.

- Undiscovered names, artwork, and evolution forms stay hidden; trail encounters reveal them. Matching games only show known Siplings and café symbols.

## iPhone

Designed for iPhone 16 Pro with bottom navigation, safe-area spacing, touch targets, keyboard-aware dialogs, and Home Screen metadata/icons. Add from Safari’s Share menu. Journal access and saving require a connection.

## Development

Requires Node.js 22.13 or newer. Run `npm ci` and `npm run dev`.
Use the local “Sign in with ChatGPT” link to activate the development identity.

Generate migrations with `npm run db:generate`. Build with `npm run build`, then apply each pending migration locally using Wrangler with `dist/server/wrangler.json` and `.wrangler/state`. Production migrations are applied by Sites during publication.

## Privacy and access

The first hosted version is owner-private. Every API checks the platform identity and scopes records to that account. Granting Marissa access is a separate hosting access step. Reflections never earn points or unlock Siplings.

The art features original fantasy Siplings, not official Pokémon characters. Her religious tradition has not yet been specified; reflections can be tailored later.
