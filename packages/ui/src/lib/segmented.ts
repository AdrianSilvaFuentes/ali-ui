import { useLayoutEffect, useRef, useState } from "react";

/**
 * O visual "segmentado", dividido entre as Tabs (variante `segmented`) e o SegmentedControl:
 * uma caixa afundada com as opções dentro e um fundo elevado que desliza até a escolhida.
 */

/** A caixa afundada (surface-sunken), com 2px de respiro em volta das opções. */
export const segmentedBox =
  "relative inline-flex w-fit gap-0.5 bg-surface-sunken p-0.5 inset-shadow-sunken";

/**
 * Cada opção, sem o estado escolhido: cada componente soma o seletor dele (`data-[state=active]`
 * nas Tabs, `data-[state=checked]` no SegmentedControl). O foco é o mesmo do Button.
 */
export const segmentedItem = [
  "relative inline-flex shrink-0 items-center justify-center gap-2 text-label-md [&_svg]:size-4",
  "text-subtle transition-interactive duration-fast motion-reduce:transition-none",
  "cursor-pointer hover:text-default",
  "outline-focus outline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2",
  "motion-reduce:outline-offset-2",
  "disabled:cursor-not-allowed disabled:text-disabled",
];

/** O fundo elevado da opção escolhida, com borda. O canto vem de cada componente. */
export const segmentedMarker =
  "absolute left-0 inset-y-0.5 border border-subtle bg-neutral shadow-xs inset-shadow-highlight";

/**
 * Desliza para a direita ou para a esquerda até a escolhida, em 200ms (duration-base),
 * desacelerando no fim. Quem pede menos movimento vê direto.
 */
export const markerMotion = "transition-[translate,width] duration-base ease-out";

/**
 * Mede onde está a opção escolhida (a que casa com `selector`) e devolve a posição da marca.
 * Remede quando a escolhida muda (o Radix troca o data-state) e quando a caixa muda de tamanho.
 * A medida desconta a escala dos pais (ex.: um modal no meio da animação de entrada).
 * `ready` só fica verdadeiro depois da primeira medida: ao abrir a página, a marca já aparece
 * no lugar, sem deslizar.
 */
export function useSlidingMarker<T extends HTMLElement>(selector: string) {
  const ref = useRef<T>(null);
  const [marker, setMarker] = useState<{ left: number; width: number } | null>(null);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const box = ref.current;
    if (!box) return;
    const measure = () => {
      const item = box.querySelector<HTMLElement>(selector);
      if (!item) return setMarker(null);
      // Medidas com fração de pixel, para a marca ter a largura exata da opção.
      const rect = item.getBoundingClientRect();
      const boxRect = box.getBoundingClientRect();
      // O getBoundingClientRect já vem com as transformações dos pais aplicadas: dentro de um
      // modal que abre com animate-pop-in (scale 0.95), a medida sai 5% menor e, como o tamanho
      // de layout não muda quando a animação acaba, ninguém mede de novo e a marca fica torta.
      // Dividir pela escala da caixa (tamanho na tela ÷ tamanho de layout) desfaz isso. Diferença
      // abaixo de 1% é só o arredondamento do offsetWidth (inteiro), não uma escala.
      const ratio = box.offsetWidth ? boxRect.width / box.offsetWidth : 1;
      const scale = Math.abs(ratio - 1) < 0.01 ? 1 : ratio;
      setMarker({ left: (rect.left - boxRect.left) / scale, width: rect.width / scale });
    };
    measure();
    const frame = requestAnimationFrame(() => setReady(true));
    const mutations = new MutationObserver(measure);
    mutations.observe(box, { attributes: true, attributeFilter: ["data-state"], subtree: true });
    const resize = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    resize?.observe(box);
    return () => {
      cancelAnimationFrame(frame);
      mutations.disconnect();
      resize?.disconnect();
    };
  }, [selector]);

  return { ref, marker, ready };
}
