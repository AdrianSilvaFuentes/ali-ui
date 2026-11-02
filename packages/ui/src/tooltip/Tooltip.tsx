import { Arrow, Content, Portal, Provider, Root, Trigger } from "@radix-ui/react-tooltip";
import type { ReactElement, ReactNode } from "react";
import { cn } from "../lib/cn.ts";

export interface TooltipProps {
  /** O elemento que abre o tooltip: um botão, um link, um texto focável. Precisa aceitar foco. */
  children: ReactElement;
  /** O rótulo do tooltip. Curto: uma palavra ou poucas, sem formatação nem links. */
  content: ReactNode;
  /** Lado em que o tooltip abre. Se não couber, ele vai para o lado oposto. */
  side?: "top" | "right" | "bottom" | "left";
  /** Alinhamento do tooltip em relação ao elemento. */
  align?: "start" | "center" | "end";
  /** Espera, em milissegundos, entre o mouse chegar e o tooltip abrir. No foco, abre na hora. */
  delay?: number;
  /** Classes do balão. */
  className?: string;
}

/**
 * Rótulo curto que aparece ao passar o mouse ou focar com o teclado: nomeia botões só de ícone
 * ou mostra um texto cortado. Escuro no tema claro e claro no escuro, para se destacar da
 * página. Para ajuda que a pessoa precisa ler ou que deve abrir no toque, use o Toggletip.
 */
export function Tooltip({
  children,
  content,
  side = "top",
  align = "center",
  delay = 500,
  className,
}: TooltipProps) {
  return (
    <Provider delayDuration={delay}>
      <Root>
        {/* O Radix liga o elemento ao tooltip com aria-describedby, para o leitor de tela. */}
        <Trigger asChild>{children}</Trigger>
        <Portal>
          <Content
            side={side}
            align={align}
            // 4px (spacing-1) além do tail: o anel de foco fica em volta do elemento, e sem esse
            // espaço a ponta do tail encostaria nele.
            sideOffset={4}
            className={cn(
              // Raio lg (8px), menor que o xl do Toggletip: um rótulo de uma linha pede cantos discretos.
              "z-50 max-w-3xs rounded-lg bg-surface-inverse px-3 py-1.5",
              // body-md (14px), o mesmo tamanho do texto dos botões e campos ao lado.
              "text-body-md text-inverse",
              // shadow-md, a mesma do Toggletip: os balões que flutuam sobre a página têm a mesma
              // elevação. Mais leve que a shadow-overlay de menus e diálogos.
              "shadow-md animate-enter-exit",
              className,
            )}
          >
            {content}
            {/*
             * O tail aponta para o elemento e o Radix o gira conforme o lado. 8×4px, como os passos
             * 2 e 1 da escala de espaçamento; a distância do balão ao elemento é a altura dele.
             */}
            <Arrow asChild width={8} height={4}>
              <svg aria-hidden="true" viewBox="0 0 8 4" className="block">
                <path d="M0 0 L4 4 L8 0 Z" className="fill-[var(--ali-color-surface-inverse)]" />
              </svg>
            </Arrow>
          </Content>
        </Portal>
      </Root>
    </Provider>
  );
}
