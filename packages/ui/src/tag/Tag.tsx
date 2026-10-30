import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../lib/cn.ts";

/**
 * Etiqueta retangular: fundo suave no tom, canto pequeno, sombra mínima e brilho no topo, sem
 * borda. É texto, não controle: sem hover e sem foco. O significado vem sempre do texto, nunca
 * só da cor.
 */
export const tagVariants = cva(
  [
    "inline-flex shrink-0 items-center whitespace-nowrap select-none",
    // Sombra mínima (xs) e um brilho fino no topo (highlight), como nos botões.
    "shadow-xs inset-shadow-highlight [&_svg]:shrink-0",
  ],
  {
    variants: {
      // Cada tom escolhe fundo, texto e ícone.
      tone: {
        neutral: "bg-neutral-subtle text-default [&_svg]:text-icon-default",
        primary: "bg-primary-subtle text-primary [&_svg]:text-icon-primary",
        info: "bg-info-subtle text-info [&_svg]:text-icon-info",
        success: "bg-success-subtle text-success [&_svg]:text-icon-success",
        caution: "bg-caution-subtle text-caution [&_svg]:text-icon-caution",
        warning: "bg-warning-subtle text-warning [&_svg]:text-icon-warning",
        danger: "bg-danger-subtle text-danger [&_svg]:text-icon-danger",
      },
      // Ícone um pouco maior que o texto. O canto diminui com o tamanho.
      size: {
        sm: "h-5 rounded-sm gap-1 px-1.5 text-label-sm [&_svg]:size-3",
        md: "h-6 rounded-md gap-1 px-2 text-label-sm [&_svg]:size-3.5",
      },
    },
    defaultVariants: { tone: "neutral", size: "md" },
  },
);

export interface TagProps
  extends Omit<ComponentProps<"span">, "children">,
    VariantProps<typeof tagVariants> {
  /** O texto da etiqueta. */
  children: ReactNode;
  /** Ícone antes do texto: `icon={<IconTag />}`. Decorativo; ganha o tamanho e a cor do tom. */
  icon?: ReactNode;
}

/** Etiqueta retangular para categorizar: texto curto, com ícone opcional, em sete tons. */
export function Tag({ className, tone, size, icon, children, ...props }: TagProps) {
  return (
    <span className={cn(tagVariants({ tone, size }), className)} {...props}>
      {/* O ícone não é anunciado: o nome da etiqueta é o texto. */}
      {icon ? (
        <span aria-hidden="true" className="inline-flex">
          {icon}
        </span>
      ) : null}
      {children}
    </span>
  );
}
