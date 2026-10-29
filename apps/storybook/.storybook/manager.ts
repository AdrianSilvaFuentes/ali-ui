import { addons } from "storybook/manager-api";
import { create } from "storybook/theming";

// Logo da Ali UI no topo da barra lateral. A barra segue o tema do sistema, então
// no escuro entra a versão com o texto claro. O título vira o texto alternativo da imagem.
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

addons.setConfig({
  theme: create({
    base: prefersDark ? "dark" : "light",
    brandTitle: "Ali Design System",
    brandImage: prefersDark ? "./logo-ali-dark.svg" : "./logo-ali.svg",
    brandUrl: "./",
    brandTarget: "_self",
  }),
});
