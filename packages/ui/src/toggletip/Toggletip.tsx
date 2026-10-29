import { Arrow, Content, Portal, Root, Trigger } from "@radix-ui/react-popover";
import { IconInfoCircle } from "@tabler/icons-react";
import type { ReactNode } from "react";
import { cn } from "../lib/cn.ts";

export interface ToggletipProps {
  /** O texto de ajuda que aparece no balão. Curto: uma ou duas frases. */
  children: ReactNode;
  /** Nome do botão para o leitor de tela. O ícone sozinho não diz nada. */
  label?: string;
  /** Lado em que o balão abre. Se não couber, ele vai para o lado oposto. */
  side?: "top" | "right" | "bottom" | "left";
  /** Alinhamento do balão em relação ao ícone. */
  align?: "start" | "center" | "end";
  /** Classes do botão do ícone. */
  className?: string;
}

/**
 * Ícone de info que abre um balão de ajuda. Diferente de um tooltip, abre no clique ou toque,
 * não ao passar o mouse, para funcionar também no celular. Fecha com Esc, clique fora ou um
 * novo clique no ícone.
 */
export function Toggletip({
  children,
  label = "Mais informações",
  side = "top",
  align = "center",
  className,
}: ToggletipProps) {
  return (
    <Root>
      <Trigger
        type="button"
        aria-label={label}
        className={cn(
          // Área de toque de 24px, mas a margem negativa faz o botão ocupar só 16px na linha,
          // para não mudar a altura da linha do label.
          "-m-1 inline-flex size-6 shrink-0 items-center justify-center rounded-full",
          // Cursor de clique: um ícone solto não parece clicável sem ele.
          "cursor-pointer",
          "text-icon-subtle hover:text-icon-default data-[state=open]:text-icon-default",
          "transition-interactive duration-fast",
          // Foco que se encaixa, como no Button, mas por dentro da área de toque: o contorno surge
          // na borda dela e fecha 2px para dentro, ficando a 3px do ícone. Num ícone de 14px,
          // o anel por fora ficaria grande demais. Sem animação para quem pede menos movimento.
          "outline-focus outline-offset-0 focus-visible:outline-2 focus-visible:-outline-offset-2",
          "motion-reduce:-outline-offset-2",
          className,
        )}
      >
        {/* 14px, o tamanho da fonte do label: ao lado dele, o ícone não pesa mais que o texto. */}
        <IconInfoCircle aria-hidden="true" className="size-3.5" />
      </Trigger>
      <Portal>
        {/*
         * O balão é um diálogo não modal. Ao abrir, o foco vai para ele e o leitor de tela lê
         * o texto; ao fechar com Esc, o foco volta para o ícone.
         */}
        <Content
          side={side}
          align={align}
          aria-label={label}
          className={cn(
            // Mesmo raio do Input no tamanho padrão (md). O contorno é um ring, e não uma border:
            // a border mudaria a referência do tail enquanto a animação roda, e ele pularia 1px.
            "z-50 max-w-xs rounded-xl bg-surface-overlay px-3 py-2 ring-1 ring-subtle",
            // body-md, um passo acima da ajuda do campo: o balão é para ler com calma.
            // shadow-md, e não shadow-overlay: num balão pequeno, a sombra de menus e diálogos pesa.
            "text-body-md text-default shadow-md outline-none",
            // Brilho no topo, o mesmo do Button: luz vinda de cima em tudo que tem volume.
            // No tema claro some no branco; no escuro vira um chanfro sutil.
            "inset-shadow-highlight",
            // Entra de fora para dentro (no top, desce até o lugar) e sai pelo mesmo caminho.
            "animate-enter-exit",
          )}
        >
          {children}
          {/*
           * O tail aponta para o ícone e o Radix o gira conforme o lado. A distância do balão ao
           * ícone é a altura dele. Desenho próprio: fundo do balão e contorno só nos lados
           * inclinados. A base cobre o contorno do balão, para os dois parecerem uma peça só.
           * 12×6px, como os passos 3 e 1.5 da escala de espaçamento.
           */}
          <Arrow asChild width={12} height={6}>
            <svg aria-hidden="true" viewBox="0 0 12 6" className="block">
              <path
                d="M0 0 L6 6 L12 0"
                className="fill-[var(--ali-color-surface-overlay)] stroke-[var(--ali-color-border-subtle)]"
              />
            </svg>
          </Arrow>
        </Content>
      </Portal>
    </Root>
  );
}
