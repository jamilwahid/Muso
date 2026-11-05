# Muso

A Toronto childcare finder for families with dietary needs. The local app includes Home, Find, Resources and About. Centre information is bundled in `src/data/centers.json`; food information should be confirmed with the centre.

## Run locally

```sh
npm install
cp .env.example .env.local
# Set VITE_MAPBOX_TOKEN in .env.local to a public Mapbox token
npm run dev
```

A valid Mapbox token is needed for the interactive map. When it is missing or the map fails, the finder shows an unavailable message and a retry action when possible. The app does not use a search or saved centres feature.

## Build

```sh
npm run build
```

The app uses client-side routes. Static hosting must serve `index.html` for unknown paths; `public/_redirects` provides this for compatible hosts.
