// Bundles the two TypeScript entry points into ../static/dist/ (served by Django).
import { build, context } from "esbuild";

const options = {
  entryPoints: { public: "src/public/main.ts", cms: "src/cms/main.ts" },
  outdir: "../static/dist",
  bundle: true,
  format: "iife",
  target: ["es2020"],
  minify: !process.argv.includes("--watch"),
  sourcemap: process.argv.includes("--watch"),
  logLevel: "info",
};

if (process.argv.includes("--watch")) {
  const ctx = await context(options);
  await ctx.watch();
  console.log("watching…");
} else {
  await build(options);
}
