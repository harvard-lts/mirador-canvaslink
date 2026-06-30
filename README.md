# mirador-canvaslink

[![Node Unit Tests](https://github.com/harvard-lts/mirador-canvaslink/actions/workflows/coverage-node.yml/badge.svg)](https://github.com/harvard-lts/mirador-canvaslink/actions/workflows/coverage-node.yml)

<a href="https://github.com/harvard-lts/mirador-canvaslink/actions/workflows/coverage-node.yml"><img src="https://github.com/harvard-lts/mirador-canvaslink/raw/badges/test-coverage/coverage.svg"></a>

[![npm package][npm-badge]][npm]

A Mirador 4 plugin which adds a dialog for sharing links via mail or WhatsApp or to Facebook, Pinterest and Twitter.

![Screenshot][screenshot]

## Compatibility

This plugin is **Mirador 4-compatible** (React 18/19, MUI 7 + Emotion). It is
**not** backwards compatible with Mirador 3 — the upgrade contains breaking
changes (top-level `mirador` imports, function/hook components, MUI 7 styling,
and translations consumed via `react-i18next`'s `useTranslation` hook rather
than an injected `t` prop).

Versioning convention for pinning:

- Mirador 4 releases are tagged `2.x`.
- Mirador 3 releases are tagged `0.x` or `1.x` — pin one of these if you still
  need Mirador 3.

## Requirements

- [NVM](https://github.com/nvm-sh/nvm)

## Setup

1. Run `nvm use` to ensure your version of matches that in the `.nvmrc` file
2. Run `npm i` to install dependencies
3. Use one of the [NPM scripts](#npm-scripts) to perform the actions described below.

## NPM scripts

The following are some useful scripts can be ran using `npm run <script>`. A full list can be seen in [package.json](./package.json)

| Script  | Description                                                                                                                |
| ------- | -------------------------------------------------------------------------------------------------------------------------- |
| `clean` | Removes the `dist` directories                                                                                             |
| `build` | Builds the source files into the `./dist` directory                                                                        |
| `serve` | Runs a local web server where the plugin can be viewed in a vanilla Mirador instance (helpful for testing and development) |
| `test`  | Runs the automated test suites                                                                                             |

## Installation

Currently the plugin can only be used if you build your own Mirador JavaScript bundle.
To include the plugin in your Mirador installation, you need to install it
from npm with `npm install mirador-canvaslink`, import it into your project
and pass it to Mirador when you instantiate the viewer:

```javascript
import Mirador from 'mirador';
import canvasLinkPlugin from 'mirador-canvaslink/es';

const miradorConfig = {
  // Your Mirador configuration
}
Mirador.viewer(config, [...canvasLinkPlugin]);
```

## Configuration

You can configure the plugin globally for all windows and/or individually for
every window.

For global configuration add the `canvasLink` entry to the top-level
`window` configuration (globally for all windows) or to the individual window
object:

```javascript
const miradorConfig = {
  window: {
    // ....
    canvasLink: {
      // Global config for all windows, see available settings below
    },
  },
  windows: [{
    // ....
    canvasLink: {
      // config for an individual window, see available settings below
    },
  }, // ...
}
```

You can view an example configuration in [demo/mdzDemoEntry.js][demo-cfg].

The available settings are:

- `getCanvasLink`: **Required**. A function that returns a link for the currently displayed canvases.
  Receives the identifier of the manifest as the first argument and an array of the currently displayed
  canvas identifiers as the second argument. Must return a string.
- `dialogOpen`: If the share dialog is open. Boolean, defaults to `false`.
- `enabled`: If the plugin is enabled. Boolean, defaults to `true`.
- `infoPanelEnabled`: If the canvas links should display in the info panel. Boolean, defaults to `false`.
- `showRightsInformation`: If rights information defined in the manifest should be shown. Boolean, defaults to `true`.
- `singleCanvasOnly`: Set to true, if `getCanvasLink` can only generate links for a single canvas, this will
  disable the "Share" button in book view.

## Contributing

Found a bug? The plugin is not working with your manifest? Want a new
feature? Create an issue, or if you want to take a shot at fixing it
yourself, make a fork, create a pull request, we're always open to
contributions :-)

For larger changes/features, it's usually wise to open an issue before
starting the work, so we can discuss if it's a fit.

**Note**: The package targets the current Node.js LTS line (Node `22`, see
`.nvmrc`).

See also the upstream
[Creating a Mirador 4 Plugin](https://github.com/ProjectMirador/mirador/wiki/Creating-a-Mirador-4-Plugin)
guide.

[demo-cfg]: https://github.com/harvard-lts/mirador-canvaslink/blob/main/demo/mdzDemoEntry.js
[npm]: https://www.npmjs.org/package/mirador-canvaslink
[npm-badge]: https://img.shields.io/npm/v/mirador-canvaslink.png?style=flat-square
[screenshot]: .docassets/screenshot.png
