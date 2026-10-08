// MapLibre GL 6 runs tile/GeoJSON work in an ES-module web worker that imports a shared module.
// Next's bundler cannot resolve that pair, so we serve both files from /public/maplibre, copied
// from the installed package so their version always matches the library.
import { copyFileSync, mkdirSync } from "node:fs"
import { createRequire } from "node:module"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const require = createRequire(import.meta.url)
const dist = join(dirname(require.resolve("maplibre-gl/package.json")), "dist")
const target = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "maplibre")

mkdirSync(target, { recursive: true })
for (const file of ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"]) {
  copyFileSync(join(dist, file), join(target, file))
}
console.log("MapLibre worker files copied to public/maplibre")
