#!/usr/bin/env node
// Docker build only — never run this against the real repo checkout.
//
// packages/db and packages/types are consumed as raw TypeScript source
// (package.json main/exports/types all point at ./src/index.ts) so tsx and
// Vite can import them directly with zero build step. That's fine for dev,
// but plain `node` cannot execute a .ts file at all — running the
// containerized apps/api's compiled dist/server.js would fail immediately
// on `require('@atlora/db')`.
//
// This repoints each package's package.json (the COPY living inside the
// image being built, not the source repo) at the dist/ output the
// preceding `turbo build` step just produced via each package's
// tsconfig.build.json. Must run after that build, since it also needs
// dist/ to exist.
const fs = require("node:fs");
const path = require("node:path");

const packages = ["packages/db", "packages/types"];

for (const pkgDir of packages) {
  const pkgPath = path.join(pkgDir, "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));

  pkg.main = "./dist/index.js";
  pkg.types = "./dist/index.d.ts";
  pkg.exports = { ".": "./dist/index.js" };

  fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

  // tsconfig.build.json compiles to CommonJS regardless of the package's
  // own declared type (needed for @atlora/db, which is "type": "module"
  // for its raw-TS dev consumers). A nested package.json inside dist/
  // tells Node to treat *.js under that directory as CJS regardless of
  // what the parent package.json says.
  if (pkg.type === "module") {
    fs.writeFileSync(
      path.join(pkgDir, "dist", "package.json"),
      `${JSON.stringify({ type: "commonjs" }, null, 2)}\n`
    );
  }
}
