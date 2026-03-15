# Dr. Data Website Build Guide

## Your Live Site Is Intact

- **`index.html`** at root loads the built assets and is what your live site uses.
- **`assets/`** contains the built CSS and JS.
- **`workshop/`** is the standalone workshop page.
- None of these were changed.

## New: Source Code for the Main Site

The **`src/`** folder contains the React source for the main site. You can now edit:

- `src/pages/Home.tsx` - Homepage
- `src/pages/About.tsx` - About page
- `src/sections/Navigation.tsx` - Nav
- etc.

## How to Build

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run dev server (local preview):**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```
   This outputs to `dist/` with `index.html` and `assets/`.

## Deploying

**Option A: Netlify build (recommended)**

- Build command: `npm run build`
- Publish directory: `dist`
- Netlify will build from source and deploy `dist/`

**Option B: Static deploy (current)**

- Keep deploying the repo as-is.
- `index.html` and `assets/` at root are served.
- To update the main site, you would need to run `npm run build` locally, then copy `dist/index.html` and `dist/assets/*` to root and commit. (Not recommended long-term.)

## Build Input

- **`index-build.html`** is the Vite build entry (has script to `src/main.tsx`).
- The build renames the output to `dist/index.html` automatically.
- Root `index.html` stays as the live/production version and is not used by the build.
