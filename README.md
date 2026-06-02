# Decaciones

PWA premium mobile-first para escuchar musica por decadas, con estetica de iPod Classic, rockola y biblioteca nostalgica.

## Correr local

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`.

## Spotify

1. Crea una app en Spotify Developer Dashboard.
2. Configura el redirect URI:
   `http://localhost:3000/api/auth/callback`
3. Copia `.env.example` a `.env.local`.
4. Completa:

```bash
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REDIRECT_URI=http://localhost:3000/api/auth/callback
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

La integracion esta preparada con:

- `getSpotifyAuthUrl()`
- `exchangeCodeForToken()`
- `searchTracks()`
- `createPlaylist()`
- `addTracksToPlaylist()`

## Deploy en Vercel

1. Importa `turbillon50/decaciones` en Vercel.
2. Agrega las variables de entorno de Spotify.
3. Cambia `SPOTIFY_REDIRECT_URI` al dominio de produccion:
   `https://tu-dominio.vercel.app/api/auth/callback`
4. Ejecuta el deploy.

## Build

```bash
npm run build
```

La app incluye `manifest.json`, service worker, assets locales, datos mock y rutas API listas para credenciales reales de Spotify.
