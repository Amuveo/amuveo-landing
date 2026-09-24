# Amuveo landing page

Static Guestlst marketing site by Amuveo.

## Requirements

- Node.js 18 or newer
- npm

## Install

```bash
npm install
```

## Build

Compile the Sass and copy the site assets into `dist/`:

```bash
npm run build
```

The generated site is in `dist/`. Serve that directory with a static web server, or deploy its contents to your hosting provider.

## Local server

Serve the site at [http://localhost:4001](http://localhost:4001):

```bash
npm start
```

The server rebuilds when you refresh after changing a source file. No background file watcher is used.

The project uses Sass modules (`@use`) rather than deprecated Sass `@import` rules.
