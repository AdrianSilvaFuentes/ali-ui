import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../lib/cn.ts";

/**
 * Pílula de status: fundo suave no tom, canto totalmente redondo, sombra mínima e brilho no
 * topo, sem borda. A pílula separa o Badge da Tag, que é retangular e diz categoria. É texto,
 * não controle: sem hover e sem foco. O significado vem sempre do texto, nunca só da cor.
 */
export const badgeVariants = cva(
  [
    "inline-flex shrink-0 items-center whitespace-nowrap select-none rounded-full",
    "shadow-xs inset-shadow-highlight [&_svg]:shrink-0",
  ],
  {
    variants: {
      // Cada tom escolhe fundo, texto e ícone nos tokens de status: aqui a cor tem significado
      // (vermelho é erro). Para tipo de conteúdo, use a Tag com as cores de categoria.
      tone: {
        neutral: "bg-neutral-subtle text-default [&_svg]:text-icon-default",
        info: "bg-info-subtle text-info [&_svg]:text-icon-info",
        success: "bg-success-subtle text-success [&_svg]:text-icon-success",
        caution: "bg-caution-subtle text-caution [&_svg]:text-icon-caution",
        warning: "bg-warning-subtle text-warning [&_svg]:text-icon-warning",
        danger: "bg-danger-subtle text-danger [&_svg]:text-icon-danger",
      },
      // Mesmas alturas, texto e ícones da Tag, para os dois andarem juntos numa linha.
      size: {
        sm: "h-5 gap-1 px-2 text-label-sm [&_[data-slot=badge-icon]_svg]:size-3",
        md: "h-6 gap-1 px-2.5 text-label-sm [&_[data-slot=badge-icon]_svg]:size-3.5",
      },
    },
    defaultVariants: { tone: "neutral", size: "md" },
  },
);

/** Com ícone, o lado esquerdo encolhe um pouco para o ícone não parecer longe da borda. */
const iconSide = { sm: "pl-1.5", md: "pl-2" } as const;

export interface BadgeProps
  extends Omit<ComponentProps<"span">, "children">,
    VariantProps<typeof badgeVariants> {
  /** O texto do status. Ele carrega o significado; a cor só reforça. */
  children: ReactNode;
  /** Ícone antes do texto: `icon={<IconCheck />}`. Decorativo; ganha o tamanho e a cor do tom. */
  icon?: ReactNode;
}

/**
 * Pílula de status com texto curto e ícone opcional à esquerda, em seis tons: neutral, info,
 * success, caution, warning e danger.
 */
export function Badge({ className, tone, size, icon, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ tone, size }), icon ? iconSide[size ?? "md"] : null, className)}
      {...props}
    >
      {/* O ícone não é anunciado: o nome do status é o texto. */}
      {icon ? (
        <span aria-hidden="true" data-slot="badge-icon" className="inline-flex">
          {icon}
        </span>
      ) : null}
      {children}
    </span>
  );
}
