/**
 * Build do pacote: compila o TypeScript para `dist/` e gera os arquivos CSS.
 * Com `node --watch`, roda de novo sempre que um arquivo de `src/` muda.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { renderTailwindCss, renderTokensCss } from "../src/css.ts";

execFileSync("tsc", ["-p", "tsconfig.build.json"], { stdio: "inherit" });

mkdirSync("dist", { recursive: true });
writeFileSync("dist/tokens.css", renderTokensCss());
writeFileSync("dist/tailwind.css", renderTailwindCss());

console.log("@ali/tokens: dist/tokens.css e dist/tailwind.css gerados.");
