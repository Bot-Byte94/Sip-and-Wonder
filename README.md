# Sip & Wonder

A personal café for coffee memories, gentle faith reflections, and original Siplings.

## Features

- Coffee journal with optional photos and mood.
- Open-ended faith and gratitude prompts; no assumed denomination.
- An expandable field guide of 600 original Siplings in 200 families and three wildly changing stages, discovered through exploration and coffee milestones.
- Permanent Sipling progress, with favorites, rarity, family views, and collection search.
- Café colors, a little plant, and a personal note.
- Private, account-scoped D1 records and R2 photos. No browser-only journal storage.

- Six exploration habitats, persistent encounters, treats, trail tickets, and stars.
- A server-managed matching game, Sipling bonding, evolution, and one-time quest rewards.
- Exploration can discover every species; the larger roster is not locked behind coffee consumption.

- Undiscovered names, artwork, and evolution forms stay hidden; trail encounters reveal them. Matching games only show known Siplings and café symbols.

## iPhone

Designed for iPhone 16 Pro with bottom navigation, safe-area spacing, touch targets, keyboard-aware dialogs, and Home Screen metadata/icons. Add from Safari’s Share menu. Journal access and saving require a connection.

### Test in Xcode Simulator

Install an iOS Simulator runtime from Xcode’s Settings if needed, then run:

```sh
npm run ios:simulator
```

The script boots an iPhone 16 Pro when available, otherwise selects the closest available iPhone, starts the dev server, opens Simulator, and loads the app in Safari. It checks ports 5173 through 5182 so an existing dev server or Vinext’s automatic port fallback will still work. Choose a specific installed device with `IOS_DEVICE="iPhone 17 Pro" npm run ios:simulator`. Stop the detached dev server with `pkill -f 'run-framework.mjs dev'`.

## Development

Requires Node.js 22.13 or newer. Run `npm ci` and `npm run dev`.
Use the app’s `/login` page to create a local account or sign in during development.

Generate migrations with `npm run db:generate`. Build with `npm run build`, then apply each pending migration locally using Wrangler with `dist/server/wrangler.json` and `.wrangler/state`. Production migrations are applied by Sites during publication.

## Privacy and access

Every API checks the app-owned session and scopes records to that account. Reflections never earn points or unlock Siplings.

The art features original fantasy Siplings, not official Pokémon characters. Her religious tradition has not yet been specified; reflections can be tailored later.

## Evolution artwork

Stage 1 keeps the original adorable designs. Stage 2 and 3 use eight new `public/roster-*-evolved.webp` sheets with 204 original illustrations: stronger intermediate silhouettes and dramatic mature forms. The 98 additional families now use 294 individually generated illustrations with distinct species, anatomy, and dramatic evolution silhouettes.

Discovered Siplings show increasing height, natural magic power, and a signature ability. Power is encyclopedia lore, not a combat mechanic. Evolving reveals the earned form with a size/power comparison; unknown stages remain mystery cards. Reduced-motion preferences are respected. Creature IDs, collection progress, and saved companions are preserved.


## One image per Sipling

Every one of the 600 entries now loads its own `public/siplings/<id>.webp` file. The renderer uses a normal image with `object-fit: contain`, fixed square dimensions, and built-in white margins. No shared sheet or clipping path is used in the app. Unknown creatures still render only the mystery card.

The existing designs were separated by connected artwork, preserving limbs and tails that crossed the old grid. Lunacorn and Carillon were redrawn individually because their original artwork touched. The 98 previously shared-art families now have their own distinct designs and descriptions. Run `node scripts/extract-sipling-images.mjs` to regenerate extracted files; it preserves the two reviewed redraws and all 294 standalone replacement illustrations. The original sheets and atlas metadata remain only as extraction sources.

### Unique artwork validation

All 600 entries must contain different decoded image pixels. `npm run check:creatures` checks uniqueness, dimensions, nonempty art, safe margins, IDs, file count, and standalone rendering. It also runs before `npm run build`, preventing duplicate artwork from being published accidentally. The 294 standalone replacement prompts and family designs are recorded in `docs/unique-sipling-art-prompts.json`; `scripts/import-unique-sipling-art.mjs` imports their complete individual source images without cropping. Existing creature IDs and saved progress remain compatible.
