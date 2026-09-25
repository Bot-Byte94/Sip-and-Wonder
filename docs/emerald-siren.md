# Emerald Siren

The only five-tier Sipling family. Discover **Sirenbean** as a Legendary visitor at Sugarwood Café (or a hard-riddle reward), then bond to reveal all five forms. Existing collection numbers and saved IDs remain unchanged; the family occupies entries 644–648.

| Tier | Sipling | Bond to next form | Height | Power |
| --- | --- | --- | --- | --- |
| 1 | Sirenbean | 18 | 0.22 m | 65 |
| 2 | Foamfin | 42 | 0.55 m | 130 |
| 3 | Cremasiren | 90 | 1.2 m | 260 |
| 4 | Emerald Siren | 90 | 2.4 m | 480 |
| 5 | Sovereign Siren | Final form | 4.8 m | 800 |

Later forms are evolution-only: trail encounters, coffee totals, and riddles cannot skip bonding. Each evolution keeps previously collected forms, matching the existing collection behavior. The evolution path wraps on narrow screens.

## Artwork

Five individual illustrations generated with the built-in image generation tool, using the preceding tier as a style and identity reference, then edited individually for twin-tail anatomy. Exact final edit prompts are in `docs/emerald-siren-art-prompts.json`. Shared art direction: a friendly emerald-haired, green-eyed, twin-tailed coffee mermaid with a gold star crown, cream foam accents, cream/emerald clothing for the early forms, cozy polished fantasy game illustration (chibi proportions only in early tiers), complete centered silhouette, generous margins, white background, no text, corporate logos, scenery, or frame.

Stage prompts add: a baby nestled in a star-emblem coffee cup; a small mermaid holding a bean; a taller mermaid with larger foam fins and a floating bean; an adult pearl ocean goddess with an ivory halter, asymmetric champagne drape, and gold-and-pearl waist chains; and an adult final queen with a black-and-emerald jeweled outfit, gold body chains, opera gloves, and a dark emerald cape. Every form has exactly two distinct tails, each ending in its own fan fin.

`node scripts/import-siren-art.mjs <originals-directory>` converts the five ID-named PNGs to complete 384×384 WebP assets in `public/siplings`, using the same sizing and margins as the existing individual-art pipeline. It does not crop a character sheet.

Run `npm run check:creatures` to verify images and progression, including every bond boundary and the terminal fifth tier.


The final Sovereign Siren is a divine cosmic ocean goddess with a celestial halo, galaxy-woven cape, twin tails, Genesis Tide, a 12 m lore height, and a 9,999 lore power rating. Power is descriptive and does not alter discovery or bonding.

Her final outfit is a structured black-and-emerald corset with gold boning, ornate filigree, and a luminous emerald centerpiece.
