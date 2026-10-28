import { gradient, insetShadow, text } from "@ali/tokens";
import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * O tailwind-merge não conhece os nomes da Ali UI. Sem isso, ele acha que
 * `text-body-md` (tamanho) e `text-inverse` (cor) são a mesma coisa e apaga um dos dois.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: Object.keys(text) }],
      shadow: [{ shadow: ["raised", "overlay"] }],
      "inset-shadow": [{ "inset-shadow": Object.keys(insetShadow) }],
      // Degradês são imagem de fundo, então convivem com uma cor de fundo (bg-disabled).
      "bg-image": [{ bg: Object.keys(gradient).map((name) => `gradient-${name}`) }],
    },
  },
});

/** Junta classes, ignora as vazias e resolve conflitos (a última vence). */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
