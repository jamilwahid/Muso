# Muso colour foundations

Muso uses the **Plum & Tangerine** palette: deep plum for text and selected controls, tangerine for the wordmark and expressive accents, indigo for actions, mint for small highlights, and warm ivory for surfaces. Use dark tangerine for white-labelled map clusters so the numbers remain legible.

The source of truth is `src/styles/palette.css`. Tokens name their purpose (`--color-action`, `--color-border`, `--color-map-marker`) rather than a single component. To change the palette, update those values together, then check text, controls, and map markers for contrast. Mapbox reads its colour values from those same tokens when the Find page mounts; reload the page after changing tokens.

The hero illustration is a raster asset (`public/muso-family-plum.png`) and has baked-in colours. For a future palette, provide a matching illustration and update its path in `src/App.tsx`; CSS tokens cannot recolour it. The map's underlying Mapbox style may include additional colours beyond the explicitly themed land, water, parks, labels and markers.

The browser favicon (`public/favicon.svg`) is also a static asset; update its fill when changing the brand colour. The illustration and favicon are intentionally separate from CSS tokens.

## Working with the foundations

In local development, visit `/design-system` to inspect the palette, buttons, food filters and a working centre panel. It uses the same components as the site and is not exposed by the production build. Keyboard focus, hover and filter selection can be tried there.

- `src/styles/foundations.css`: spacing, type, radii and header dimensions.
- `src/styles/palette.css`: colour roles shared with the map.
- `src/ui/`: brand, navigation links and shared button primitives.
- `src/features/finder/`: food filters, map interaction and centre sheet.
- `src/content/guides.ts`: guide text, independent of page layout.
- `src/styles/components.css`, `pages.css`, `finder.css`: shared controls, page-specific layouts and finder styles.

Add a reusable token or component when there is a real repeated need. Check contrast, keyboard focus and mobile states when changing a shared control. The locally shown design reference is not an exhaustive accessibility test.
