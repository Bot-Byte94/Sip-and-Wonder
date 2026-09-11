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
