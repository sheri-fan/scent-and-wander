# Scent & Wander

A locally rendered, first-person woodland and the first environment prototype for a Virtual Perfume Museum. React, Vite, Three.js, React Three Fiber, and drei. No accounts, products, or backend.

## Run locally

Use Node.js 20.19+ or 22.12+ and npm.

```sh
npm install
npm run dev
```

Open the printed localhost URL in a desktop browser with WebGL support. Click **Enter the Forest** to capture the mouse. WASD walks, mouse movement looks, Shift walks faster, and Escape pauses and releases the mouse. Click **Return to the Forest** to resume at the same position. Pointer lock requires a direct user click; use a top-level localhost browser tab rather than a restrictive embedded preview.

```sh
npm test
npm run build
npm run preview
```

The production build is in `dist/` and can be served by any static web host.

## Environment and implementation

The seeded procedural world covers approximately 190 metres, with a winding clear path, hundreds of branching trees, layered canopies, thousands of animated grass tufts, ferns, scattered rocks, fallen logs, and floating pollen. Instanced geometry keeps repeated scenery to a small number of draw calls. All world assets and bark/ground textures are generated in code. The optional Google Fonts stylesheet has local serif/sans-serif fallbacks; no external 3D assets or texture services are needed.

Warm directional sunlight, canopy shadows, hemisphere fill, a procedural sky, and exponential atmospheric fog create morning depth. This prototype uses atmospheric haze rather than expensive volumetric ray marching. Foliage is procedurally modeled rather than photogrammetry; future art iterations can replace it with licensed scanned assets. The shadow map is local to the central forest, with ambient lighting beyond it.

Movement has frame-rate-independent acceleration and damping, human eye height following the terrain, subtle head motion, and horizontal circle collision against trunks, rocks, and samples along fallen logs. The outer boundary keeps visitors within the populated world. Mouse capture loss and window blur clear movement keys. There is no jumping or physics engine.

Rendering caps device pixel ratio at 1.5. drei's adaptive DPR and performance monitor can reduce rendering resolution and shadow resolution on slower hardware. Wind updates in the vertex shader rather than updating thousands of objects on the CPU.

## Source

- `src/Forest.jsx`: scenery, lighting, instancing, wind, pointer lock and movement.
- `src/world.js`: deterministic placement, terrain, path and collision calculations.
- `src/main.jsx`: welcome/pause interface and canvas setup.
- `src/style.css`: minimal responsive overlay.
- `tests/world.test.js`: clear-path and movement collision checks.

Designed for desktop keyboard and mouse. Touch exploration and sound are outside this milestone.

## Verification

`npm test` passes deterministic layout, path clearance, collision sliding, and boundary checks. `npm run build` passes. A local headless Chrome check rendered the scene, captured a screenshot, successfully acquired pointer lock through the entry button, and dispatched walking and Escape inputs with no reported runtime errors. Extended manual exploration and frame-rate profiling across different laptops remain to be done. Vite reports a bundle-size advisory because the app includes the Three.js renderer; this does not prevent building or running.

## Luminous flower collection

Thirty-six gently swaying plant patches line the trail, including the ten flowers inspired by the supplied botanical reference: Lavender, Rose Bush, Hydrangea, Daisy, Tulip, Bluebell, Sunflower, Cosmos, Pansy, and Little Wildflower Mix. These are procedural 3D interpretations, with distinct petal forms, emissive blossoms, and softly pulsing additive halos. No source image or external plant assets are required at runtime. Repeated patches use instancing per species.

Walk within five metres of a plant and aim the centre dot at it. A name and **Click to discover** prompt appear. Click to open a botanical card and release the mouse. **Continue exploring** captures the mouse again and resumes at the same position. The discovery count tracks unique flower varieties for the current session. Escape still pauses normally.

A Chrome interaction check verified the Lavender prompt, discovery card, unique discovery count, and successful return to pointer-locked exploration without browser runtime errors.


## Perfumer’s plants

The collection now includes **18 varieties**, with two reachable patches of each. The eight additions (Jasmine, Orange Blossom, Iris, Patchouli, Vetiver, Rosemary, Bergamot, and Ylang-Ylang) have distinct procedural geometry and perfume discovery cards listing the fragrant plant part, scent character, and further reading. New varieties are interleaved with the original flowers from the beginning of the path. This is a curated fantasy woodland, bringing together plants from different climates; the miniature trees are artistic interpretations.

Ingredient references are linked directly from the relevant discovery card. Sources include [The Perfume Society’s ingredient library](https://perfumesociety.org/discover-perfume/an-introduction/ingredients/), [Indiana University’s patchouli profile](https://greenhouse.biology.indiana.edu/features/fragrant/Pogostemon-cablin.html), and [Firmenich’s orris ingredient sheet](https://www.firmenich.com/sites/default/files/uploads/files/ingredients/marketing-sheet/perfumery/ORRISCIENCE_8_IRONE_950289.pdf). Original decorative flower cards remain botanical observations, without implying all ornamental flowers are extracted for perfume.

Plant layout tests verify each variety is represented twice, remains within the world, and is planted near the trail clear of solid scenery. Discovery totals are derived from the collection rather than a fixed number.


## Languages

Traditional Chinese (`zh-Hant`) is the default. Use the language selector in the upper-right corner of the welcome screen, paused view, or plant discovery view to switch between **繁體中文** and **English**. Press Escape during exploration to access it. The interface, all 18 plant descriptions, and perfume ingredient cards are translated; original-source reading links retain their original language and are labeled accordingly. The browser remembers the language selection when local storage is available. Switching languages keeps the current walk and discoveries intact; discoveries themselves remain session-only.

Translations live in `src/i18n.js`. Stable English plant identifiers keep discovery tracking independent of the display language.

## Educational discovery cards

Each of the 18 plant cards teaches real plant knowledge in Traditional Chinese and English: a botanical reference, plant identity, growth or habitat, and a specific fact. References describe representative real plants rather than claiming exact identification of the procedural models. Mixed wildflowers are explicitly identified as a community, without an invented single-species name. The miniaturised ylang-ylang exhibit is distinguished from the full-sized tropical tree.

Existing perfume ingredient information is retained, including fragrant plant parts and source links. Original exhibit descriptions are available in an expandable section, while the main reading area prioritises botanical knowledge. Traditional Chinese cards also offer the English original. Text scrolls independently of the visible continue button.

Educational content lives in `src/plantKnowledge.js`, with per-card reading links to sources including the RHS, Kew, NParks, Woodland Trust, Cambridge University Botanic Garden, Illinois Extension, and The Perfume Society. Seasons and growing conditions vary by climate.

## Harvested parts and growing regions

`src/perfumeOrigins.js` adds a bilingual **From plant to perfume** section to cards with documented material or fragrance-use information, ahead of general botanical facts. Cards without this information omit the section and its corresponding English-original passages. It explains the harvested part, extraction or formulation role, and documented growing/sourcing regions. Lavender and rose now have perfume-material explanations as well. Sunflower seed oil is identified as a fixed/formulation oil; ornamental plants and mixed wildflowers are not assigned invented essential oils or production leaders.

Regional claims distinguish perfume-material production, ornamental bulb cultivation, natural woodland distribution, and oilseed agriculture. Supplier-reported sourcing origins are not a global acreage league table. A single largest country is not asserted without comparable evidence. For example, bergamot supply is heavily concentrated in Calabria; sambac jasmine sourcing is documented in Tamil Nadu; rosemary sources identify Tunisia, Morocco, and Spain as leading essential-oil producers. The tulip card preserves the CBS observation of 14,740 hectares in the Netherlands **in 2024**, explicitly for bulb cultivation.

Origin sources were reviewed on November 9, 2026. Each material’s sources are linked from its card, including supplier origin reports, botanical references, CBS, COSMILE Europe, and the National Sunflower Association. Botanical details and existing perfume stories remain available below the new section.

## Real perfume examples

A compact **Meet it in a perfume** list appears below the exhibit description in discovery cards. `src/perfumeExamples.js` contains 19 plant and perfume pairings across 12 plants, checked against official brand pages on November 9, 2026. Each visible example shows only the brand, perfume name, concentration, and official-source link. Examples include Libre Eau de Parfum, N°5 Eau de Parfum, Infusion d’Iris Eau de Parfum, Angel Eau de Parfum, Vétiver Eau de Toilette, and Colonia Eau de Cologne.

The source data distinguishes **brand-listed notes**, **brand-described materials**, **listed plant ingredients**, and **fragrance interpretations**; these research details are not displayed in the compact list. A note alone does not establish a botanical extract, exact species, or full formula. Tulip and bluebell examples are recorded in the source data as interpretations. Six exhibits have no verified official-brand match, so their perfume list is omitted; perfume names alone are not treated as ingredient evidence. There are no prices, carts, or shopping flows.

## Language of flowers / 花語

Discovery cards include a short bilingual flower-meaning section directly before the exhibit description. Thirteen plants have sourced symbolic associations; five other exhibits show “To Be Contiune...” without a flower-meaning link. Cultural symbolism is presented separately from botanical facts, with context for flower colour, historical tradition, or conflicting interpretations. Sources include Smithsonian Gardens, the Almanac, a grower's herb guide, and a florist's flower-meaning guide. The compact perfume list remains below the exhibit description.

Data: `src/flowerMeanings.js`; presentation: `src/FlowerMeaning.jsx`.


## Woodland expansion

The current collection has **24 discoveries**, including six additions: Sweet Violet, Wood Anemone, Wild Strawberry, Woodland Fern, Woodland Moss, and Common Bonnet. There are **48 clickable trail patches**, plus instanced ambient moss cushions at tree bases, mushrooms beside fallen timber, and additional ferns. New species are interleaved near the start of the walk. The trail layout fits the complete collection within the existing forest boundary.

The woodland organisms use distinct procedural geometry: low five-petalled flowers, star-shaped anemones, strawberry leaves and fruit, divided fern fronds, tufted moss cushions, and smooth taupe mushroom caps. Moss and mushrooms remain still; leaves and fern fronds sway gently. Their materials use restrained emission alongside the discovery halos. Low-growing discoveries use targeting heights appropriate to their size.

All six include English and Traditional Chinese knowledge cards with source links. Mushroom cards explain that fungi are not plants. Their unsupported perfume sections and perfume lists are omitted, and their unverified flower meanings use the existing “To Be Contiune...” placeholder without a link. Existing flower cards and compact perfume-list placement are preserved.

Woodland definitions and bilingual knowledge live together in `src/woodland.js`. Reference sources include Woodland Trust, The Wildlife Trusts, and the RHS. Procedural models are artistic interpretations rather than specimen-identification guides.

## Flowerbee 50-flower collection

All **50 numbered entries** in the user's [Flowerbee guide](https://flowerbee-hk.com/zh/blogs/flower-delivery/fragrance-profile-of-50-popular-flowers) are now represented. Nine correspond to existing discoveries; **41 new varieties** bring the forest to **65 unique discoveries and 130 clickable patches**, alongside ambient moss, ferns, and mushrooms. New varieties are interleaved with the existing collection along the path in both directions from the starting area.

The English article was checked to resolve machine-translated names: Heliotrope becomes 天芥菜, Stock becomes 紫羅蘭 (Matthiola), Sweet Alyssum becomes 香雪球, Mimosa is represented by Acacia dealbata (銀荊), and row 34 maps to the existing Bluebell. The separate Narcissus and Daffodil entries use clustered Narcissus tazetta and trumpet Narcissus pseudonarcissus as representative forms. Existing Sweet Violet represents Violet. Scientific references are representative identities for procedural exhibits, not specimen identification.

`src/aromaCollection.js` records the 41 additions and an explicit 50-row mapping. Botanical descriptions are independently summarised from the linked NC State Extension Plant Toolbox and other botanical sources; the florist's aroma table is not reproduced. The article supplies the selection of exhibits, rather than proof of a commercial extract or a particular perfume formula.

`src/aromaGeometry.js` builds varied procedural forms: curved petal surfaces, layered blossoms, spikes, hanging racemes, trumpets, bilateral orchids, calla spathes, passionflower coronas, clustered tree flowers, and lotus leaves. Lotus patches include small water basins. Flowering trees and climbing plants are miniature artistic displays. The scene combines species and flowering seasons that do not naturally occur together.

New cards include English and Traditional Chinese botanical knowledge and source links. The existing card layout is retained: flower meanings directly precede exhibit descriptions, and compact perfume names follow exhibit descriptions. Unverified flower meanings show “To Be Contiune...” without links. Unsupported perfume-use sections and perfume lists are hidden.

Tests verify coverage of all 50 article entries, unique discovery identities, complete bilingual cards, two clear placements for every variety, and containment within the original forest boundary. No external model or texture downloads are needed to run the expanded collection.

## Compact random woodland layout

The current discovery layout uses seeded random scattering within a **38-metre radius** around the central woodland. It contains two patches of each of the 67 varieties, plus 24 additional moss beds, 18 mushroom groups, and 12 ferns: **188 interactive patches** in total. Placement uses the visible patch footprint and a minimum 1.6-metre edge gap, clears solid scenery, and keeps the path open. Most flowers are placed away from the path. The seed makes the organic arrangement stable across interface updates and reloads.

Moss tends towards tree bases and mushrooms towards fallen timber when a clear, spaced location is available. The same array drives rendering and targeting, so every moss and mushroom group, including the smaller ambient instances, opens its discovery card. Hit targets follow each patch's actual scale and ground-level height. Ambient patches retain their quieter appearance without additional glow sprites.

The layout tests now check compact bounds, all-pairs spacing, off-path distribution, obstacle clearance, all 65 varieties, stable generation, and interactive moss/mushroom coverage.


The mushroom exhibit now uses small common-bonnet-inspired forms with smooth warm-grey caps, slim cream stems and subtle underside gills. All mushroom patches retain their clickable discovery cards with updated bilingual knowledge. Their glow is reduced for a quieter woodland atmosphere.
# Expanded perfume references

The botanical cards now include 57 distinct perfumes from 37 brands, with 102 plant-to-perfume matches across 33 exhibits. Additional houses include Penhaligon’s, Floris London, AERIN, Tom Ford, Maison Francis Kurkdjian, Parfums de Marly, Amouage, KILIAN Paris, BDK Parfums, NISHANE, L’Occitane en Provence, D.S. & Durga, Lalique, Giorgio Armani, Lancôme and Chloé. Earlier references include Frédéric Malle, Diptyque, Le Labo, Gucci, Hermès and Serge Lutens, alongside additional Jo Malone London fragrances.

Official brand pages were reviewed on 2026-11-09. Research data lives in `src/perfumeExpansion.js`, merged with the original examples in `src/perfumeExamples.js`. Notes and reconstructed floral accords are distinguished from confirmed materials in the data; a fragrance note does not establish that a natural flower extract is present. Cards keep the requested compact brand/product/concentration links below the exhibit description in both languages. Exhibits without verified matches retain no perfume list.



## Requested fragrance houses and lily of the valley

Added 12 fragrances across L’Artisan Parfumeur, Maison Margiela, Louis Vuitton, Tom Ford, LOEWE, Creed and Valentino. Official links and bilingual research notes are in `src/perfumeExpansion.js`.

`src/perfumeGarden.js` introduces lily of the valley (Convallaria majalis), bringing the discovery collection to 66 plants and fungi. Its two spaced, clickable patches use procedural arching stems, broad leaves and hanging white bells. Maison Margiela references explicitly distinguish the lily-of-the-valley accord from a natural flower extract. The new botanical card retains the existing bilingual knowledge, compact perfume list and missing-information conventions.


Salvia (woodland sage, Salvia nemorosa) now grows in two spaced, clickable patches, bringing the collection to 67 discoveries. Procedural violet flower spikes have small two-lipped blooms and gentle movement. Its bilingual card uses North Carolina Extension botanical information and keeps perfume references separate from other Salvia species.


## Local interface fonts

The interface uses the supplied `fonts/SweiSpringCJKtc-Regular.ttf` for body text and controls, and `fonts/SweiSpringSugarCJKtc-Regular.ttf` for titles, flower names and display text. Vite serves and bundles both font files locally; no Google Fonts request is required. These regular faces serve the Chinese interface, with browser-synthesized emphasis where needed; English uses the additional Light and Medium faces described below. The original font files remain in `fonts/`.

## Background music

The background track is the user-supplied recording **Breath of the Forest at Dawn** by **Stephan Lawson Piano**, imported from `Stephan Lawson Piano - Breath of the Forest at Dawn [Thematic].mp3`. Vite serves and bundles the recording locally. `src/forestMusic.js` plays it on a loop after Enter the Forest, reuses playback across pauses and plant cards, and pauses while the tab is hidden. The music panel displays the track title and artist.

The speaker icon near the lower-right corner opens a volume slider and mute button. Press Esc to release the mouse before adjusting it during exploration. Volume and mute preferences are saved locally; the default volume is 35%. Controls support English and Traditional Chinese, keyboard focus and screen-reader labels. Unsupported audio does not block forest exploration.

## Language choices

The selector supports Traditional Chinese (`zh-Hant`), Simplified Chinese (`zh-Hans`) and English. Traditional Chinese remains the default. Simplified Chinese presentation text is derived locally with OpenCC (`src/chinese.js`), including all botanical cards, flower meanings, interface labels, music controls and discovery counts. Original source URLs, plant discovery IDs, perfume names, music attribution and the requested missing-meaning placeholder are preserved. The selected language persists in local storage.

English typography uses the classic Swei Spring Light face for headings and Swei Spring Medium for body text and controls. Both are supplied locally in `fonts/`; Chinese retains the original Swei Spring Regular and Sugar Regular styles.

## GitHub Pages

Live website: https://sheri-fan.github.io/scent-and-wander/

Source repository: https://github.com/sheri-fan/scent-and-wander

Push changes to `main` to run `.github/workflows/deploy.yml`: install locked dependencies, run tests, build for `/scent-and-wander/`, and deploy to GitHub Pages. GitHub Pages uses the GitHub Actions deployment source. Local development remains `npm run dev` at the root URL.

To preview the Pages build locally:

```sh
VITE_BASE_PATH=/scent-and-wander/ npm run build
VITE_BASE_PATH=/scent-and-wander/ npm run preview
```

Only the four font faces referenced by the interface are tracked; unused font variants remain in the local `fonts/` folder.
