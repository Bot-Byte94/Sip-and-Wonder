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

Five individual illustrations generated with the built-in image generation tool, using the preceding tier as a style and identity reference. Shared art direction: a friendly emerald-haired, green-eyed, twin-tailed coffee mermaid with a gold star crown, cream foam accents, modest cream/emerald bodice, cozy polished chibi game illustration, complete centered silhouette, generous margins, white background, no text, corporate logos, scenery, or frame.

Stage prompts add: a baby nestled in a star-emblem coffee cup; a small mermaid holding a bean; a taller mermaid with larger foam fins and a floating bean; a regal guardian with flowing tails and an orbit of beans; and a final queen with a luminous crown and the broadest cream-tipped tails.

`node scripts/import-siren-art.mjs <originals-directory>` converts the five ID-named PNGs to complete 384×384 WebP assets in `public/siplings`, using the same sizing and margins as the existing individual-art pipeline. It does not crop a character sheet.

Run `npm run check:creatures` to verify images and progression, including every bond boundary and the terminal fifth tier.
