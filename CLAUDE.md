# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is `@harvard-lts/mirador-canvaslink`, a Mirador 4 plugin that, for Harvard objects, adds a menu button which opens a share dialog for sharing IIIF canvas links via email, social media (Facebook, Pinterest, Twitter/X), and WhatsApp. For non-Harvard objects, it displays canvas/object permalinks in the info panel.

The plugin is published to npm and consumed by applications that build their own Mirador bundle.

## Commands

- `nvm use` — switch to the required Node version (lts/hydrogen = Node 18)
- `npm run build` — builds ESM output to `dist/es/` via Rollup
- `npm run serve` — starts Vite dev server on port 9000 serving the `demo/` directory
- `npm test` — runs tests with Vitest
- `npm run test:watch` — runs tests in watch mode
- `npm run test:coverage` — runs tests with coverage

## Architecture

This is a Mirador 4 plugin that exports an array of three plugin definitions from `src/index.js`:

1. **ShareControl** (`target: WindowTopBarPluginArea`, mode: `add`) — renders a share icon button in the window toolbar that toggles the dialog open/closed.

2. **ShareCanvasLinkDialog** (`target: Window`, mode: `add`) — renders a MUI Dialog with the generated canvas link, copy-to-clipboard, social share buttons, and optional rights information.

3. **InfoPanelCanvasLink** (`target: ManifestRelatedLinks`, mode: `wrap`) — wraps the manifest related links panel to add "Link to this object" and "Canvas permalink" entries when `infoPanelEnabled` is true.

### State Management

- Plugin config lives in Mirador's window state under `window.canvasLink`
- `src/state/selectors.js` uses `reselect` to merge default config with per-window config via Mirador's `getWindowConfig`
- State updates dispatch Mirador's `updateWindow` action

### Key Integration Points

- The host app must provide `getCanvasLink(manifestId, visibleCanvases)` in config — this function generates the shareable URL
- The plugin uses Mirador's `useTranslation` hook and registers translations via the plugin `config.translations` field
- Translations are in `src/locales.js` (English and German)

### Build

- Rollup (`rollup.config.mjs`) produces ESM to `dist/es/`
- React, MUI, Emotion, Mirador, and reselect are externalized — the consuming app provides these at runtime
- Babel handles JSX transformation

### Demo

The `demo/` directory contains multiple HTML entry points for testing different configurations:
- `harvard.html` / `harvardDemoEntry.js` — Harvard-specific manifest with info panel links
- `mdz.html` / `mdzDemoEntry.js` — MDZ (Munich Digitization Center) manifest
- `both.html` / `bothDemoEntry.js` — both manifests together

## Mirador 4 Migration (branch: `hackathon-mirador-4`)

This plugin was ported from Mirador 3 to Mirador 4 following the pattern established in `mirador-template-plugin` and the plan.md file in the `origin/hackathon-mirador-4` branch of the [mps-viewer repository](https://github.com/harvard-lts/mps-viewer). Key changes made:

### Dependency model
- Mirador, React, MUI, and Emotion moved to `peerDependencies` (the host app provides these at runtime)
- Removed `jquery`, `redux`, `redux-saga` from direct dependencies
- Version bumped to `2.0.0` to signal v4 support

### Import changes
- Deep Mirador imports (`mirador/dist/es/src/state/selectors`, `mirador/dist/es/src/state/actions`, `mirador/dist/es/src/components/MiradorMenuButton`) replaced with flat imports from `"mirador"`
- `@material-ui/core` → `@mui/material`
- `@material-ui/icons` → `@mui/icons-material`
- `@material-ui/lab/Alert` → `@mui/material/Alert`
- `FileCopyIcon` → `ContentCopyIcon`, `TwitterIcon` → `XIcon`

### Styling migration
- `makeStyles` / JSS classes replaced with MUI `sx` prop
- `ScrollIndicatedDialogContent` (Mirador internal) replaced with standard `@mui/material/DialogContent`
- Mirador's `css-ns` helper (`ns("viewer")`) replaced with literal class `.mirador-viewer`

### Translation hook
- The `t` prop (passed down from Mirador's HOC) replaced with `useTranslation()` hook from `"mirador"` in every component
- `t` removed from PropTypes declarations

### React modernization
- Explicit `import React from "react"` removed (JSX runtime handles it)
- `defaultProps` static replaced with ES6 default parameter values
- Added missing `key` props on list items
