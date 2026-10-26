import { addons } from "storybook/manager-api";
import { create } from "storybook/theming";

// Troca a logo do Storybook pelo nome do projeto. Quando houver uma logo
// própria, use `brandImage` com o caminho do arquivo.
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

addons.setConfig({
  theme: create({
    base: prefersDark ? "dark" : "light",
    brandTitle: "Ali UI",
    brandUrl: "./",
    brandTarget: "_self",
  }),
});
