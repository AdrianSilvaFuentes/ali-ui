import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../lib/cn.ts";

/**
 * Etiqueta retangular: fundo suave no tom, borda fina e canto pequeno. É texto, não controle:
 * sem sombra, sem hover e sem foco. O significado vem sempre do texto, nunca só da cor.
 */
export const tagVariants = cva(
  [
    "inline-flex shrink-0 items-center whitespace-nowrap rounded-sm border select-none",
    "[&_svg]:shrink-0",
  ],
  {
    variants: {
      // Cada tom escolhe fundo, borda, texto e ícone. O neutro usa os tons dos campos.
      tone: {
        neutral: "bg-readonly border-subtle text-default [&_svg]:text-icon-default",
        primary: "bg-primary-subtle border-primary text-primary [&_svg]:text-icon-primary",
        info: "bg-info-subtle border-info text-info [&_svg]:text-icon-info",
        success: "bg-success-subtle border-success text-success [&_svg]:text-icon-success",
        caution: "bg-caution-subtle border-caution text-caution [&_svg]:text-icon-caution",
        warning: "bg-warning-subtle border-warning text-warning [&_svg]:text-icon-warning",
        danger: "bg-danger-subtle border-danger text-danger [&_svg]:text-icon-danger",
      },
      // Ícone perto de 70% da altura, como no Avatar.
      size: {
        sm: "h-5 gap-1 px-1.5 text-label-xs [&_svg]:size-3.5",
        md: "h-6 gap-1 px-2 text-label-sm [&_svg]:size-4",
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
