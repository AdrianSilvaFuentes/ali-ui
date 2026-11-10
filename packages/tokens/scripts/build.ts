/**
 * Build do pacote: compila o TypeScript para `dist/`, gera os arquivos CSS e o plugin
 * de sincronização com o Figma (`figma-plugin/`, versionado para importar no Figma).
 * Com `node --watch`, roda de novo sempre que um arquivo de `src/` muda.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, renameSync, writeFileSync } from "node:fs";
import { renderTailwindCss, renderTokensCss } from "../src/css.ts";
import { renderFigmaManifest, renderFigmaPlugin } from "../src/figma.ts";

execFileSync("tsc", ["-p", "tsconfig.build.json"], { stdio: "inherit" });

/**
 * Escreve o arquivo de uma vez: grava ao lado e troca pelo nome final. Quem lê ao mesmo tempo
 * (como o teste do plugin do Figma, que roda junto com este build no pnpm check) vê o arquivo
 * antigo ou o novo, nunca um arquivo vazio pela metade.
 */
function writeAtomic(path: string, content: string) {
  writeFileSync(`${path}.tmp`, content);
  renameSync(`${path}.tmp`, path);
}

mkdirSync("dist", { recursive: true });
writeAtomic("dist/tokens.css", renderTokensCss());
writeAtomic("dist/tailwind.css", renderTailwindCss());

writeAtomic("figma-plugin/manifest.json", renderFigmaManifest());
writeAtomic("figma-plugin/code.js", renderFigmaPlugin());

console.log("@ali/tokens: tokens.css, tailwind.css e o plugin do Figma gerados.");
