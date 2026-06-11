// Type declarations for side-effect imports of static assets
// (e.g. `import "./globals.css"` in Storybook's preview.ts).
// Next.js handles these at build time, but the TS language server
// needs the module shapes to resolve them in plain .ts files.

declare module "*.css";
declare module "*.scss";
