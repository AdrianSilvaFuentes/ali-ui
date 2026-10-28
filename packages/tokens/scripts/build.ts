/**
 * Build do pacote: compila o TypeScript para `dist/`, gera os arquivos CSS e o plugin
 * de sincronização com o Figma (`figma-plugin/`, versionado para importar no Figma).
 * Com `node --watch`, roda de novo sempre que um arquivo de `src/` muda.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { renderTailwindCss, renderTokensCss } from "../src/css.ts";
import { renderFigmaManifest, renderFigmaPlugin } from "../src/figma.ts";

execFileSync("tsc", ["-p", "tsconfig.build.json"], { stdio: "inherit" });

mkdirSync("dist", { recursive: true });
writeFileSync("dist/tokens.css", renderTokensCss());
writeFileSync("dist/tailwind.css", renderTailwindCss());

writeFileSync("figma-plugin/manifest.json", renderFigmaManifest());
writeFileSync("figma-plugin/code.js", renderFigmaPlugin());

console.log("@ali/tokens: tokens.css, tailwind.css e o plugin do Figma gerados.");
