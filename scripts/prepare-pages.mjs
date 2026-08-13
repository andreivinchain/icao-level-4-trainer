import { access, copyFile, cp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

const basePath = "/icao-level-4-trainer";
const clientDir = "dist/client";
const prerenderDir = "dist/server/prerendered-routes";
const prefixedAssetsDir = join(clientDir, basePath.slice(1), "_next");
const pagesAssetsDir = join(clientDir, "_next");

const exists = async (path) => access(path).then(() => true, () => false);

if (await exists(prefixedAssetsDir)) {
  await rm(pagesAssetsDir, { recursive: true, force: true });
  await cp(prefixedAssetsDir, pagesAssetsDir, { recursive: true });
  await rm(join(clientDir, basePath.slice(1)), { recursive: true, force: true });
}

await Promise.all([
  copyFile(join(prerenderDir, "index.html"), join(clientDir, "index.html")),
  copyFile(join(prerenderDir, "404.html"), join(clientDir, "404.html")),
  copyFile(join(prerenderDir, "index.rsc"), join(clientDir, "index.rsc")),
  writeFile(join(clientDir, ".nojekyll"), ""),
]);

const html = await readFile(join(clientDir, "index.html"), "utf8");
const pageUrls = [...html.matchAll(/(?:href|src)="([^"]+)"|url\(([^)]+)\)/g)]
  .map((match) => match[1] ?? match[2])
  .filter((url) => url.startsWith(`${basePath}/`));

for (const url of new Set(pageUrls)) {
  const relativePath = url.slice(basePath.length + 1).split(/[?#]/, 1)[0];
  await access(join(clientDir, relativePath));
}

const audioFiles = (await Promise.all(
  ["CD1", "CD2", "CD3"].map((cd) => readdir(join(clientDir, "audio", cd))),
)).flat().filter((file) => file.endsWith(".mp3"));

if (audioFiles.length !== 136) {
  throw new Error(`Expected 136 course audio files, found ${audioFiles.length}`);
}

console.log(`GitHub Pages artifact ready: ${pageUrls.length} linked assets, ${audioFiles.length} audio files.`);
