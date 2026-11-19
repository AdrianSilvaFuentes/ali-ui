import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "../lib/cn.ts";

/**
 * Bloco de conteúdo: uma superfície com contorno sutil e canto de 12px (radius-xl), como o
 * campo e o botão md. Não é controle: sem hover, sem foco e sem clique próprios. Quem é
 * interativo é o que vai dentro dele.
 */
export const cardVariants = cva(["relative rounded-xl border border-subtle text-default"], {
  variants: {
    variant: {
      // Elevado: a superfície raised, sombra mínima (xs) e o brilho fino no topo, como os
      // botões e a Tag. É o card que separa um bloco do fundo da página.
      raised: "bg-surface-raised shadow-xs inset-shadow-highlight",
      // Rebaixado: a superfície sunken, sem sombra. Para uma área dentro de outra (um grupo
      // de campos dentro de um formulário, uma nota), que não deve competir com o card de fora.
      sunken: "bg-surface-sunken",
    },
    padding: {
      // Sem respiro, para o conteúdo encostar na borda (uma lista com divisórias, uma imagem).
      // Corta o que passa do canto, para o hover das linhas não vazar da curva.
      none: "overflow-hidden",
      sm: "p-3",
      md: "p-4",
      lg: "p-5",
    },
  },
  defaultVariants: { variant: "raised", padding: "md" },
});

export interface CardProps extends ComponentProps<"div">, VariantProps<typeof cardVariants> {
  /**
   * Usa o filho como elemento, com o estilo do card. Para a tag certa:
   * `<Card asChild><section aria-labelledby="titulo">…</section></Card>`, ou `ul`, `form`, `article`.
   */
  asChild?: boolean;
}

/**
 * Bloco que agrupa conteúdo relacionado sobre uma superfície. Dois estilos, raised (padrão) e
 * sunken, e quatro respiros: none, sm 12px, md 16px (padrão) e lg 20px.
 */
export function Card({ className, variant, padding, asChild = false, ...props }: CardProps) {
  const Comp = asChild ? Slot : "div";
  return <Comp className={cn(cardVariants({ variant, padding }), className)} {...props} />;
}
