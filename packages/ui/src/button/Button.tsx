import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../lib/cn.ts";

/**
 * Preenchido com degradê (primary e destructive). Volume: sombra embaixo e um brilho fino no topo.
 * O navegador não anima a troca de um degradê por outro. Por isso hover e pressionado são
 * camadas por baixo do texto (before e after), que aparecem com um fade. Cada variante só
 * escolhe os três degradês.
 */
const filled = [
  // Sombra mínima (xs), como os campos e os controles de escolha.
  "text-static-white shadow-xs inset-shadow-highlight",
  // A camada de hover repete o brilho; a de pressionado não tem, e o botão afunda.
  // As camadas herdam o canto do botão, para o brilho seguir a curva.
  "before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:inset-shadow-highlight",
  "before:opacity-0 before:transition-opacity before:duration-fast hover:before:opacity-100",
  "after:absolute after:inset-0 after:-z-10 after:rounded-[inherit]",
  "after:opacity-0 after:transition-opacity after:duration-fast active:after:opacity-100",
  "motion-reduce:before:transition-none motion-reduce:after:transition-none",
  // Desabilitado tira o degradê e as camadas, e fica com a cor sólida de desabilitado.
  "disabled:bg-none disabled:bg-disabled disabled:text-disabled",
  "disabled:shadow-none disabled:inset-shadow-none disabled:before:hidden disabled:after:hidden",
  "aria-disabled:bg-none aria-disabled:bg-disabled aria-disabled:text-disabled",
  "aria-disabled:shadow-none aria-disabled:inset-shadow-none",
  "aria-disabled:before:hidden aria-disabled:after:hidden",
];

/**
 * Fundo neutro com borda (secondary e destructive-secondary): o mesmo volume do preenchido,
 * e a borda segura o botão em qualquer superfície. Cada variante escolhe borda, texto e hover.
 */
const outlined = [
  "border bg-neutral shadow-xs inset-shadow-highlight",
  "active:inset-shadow-none",
  "disabled:border-disabled disabled:bg-disabled disabled:text-disabled",
  "disabled:shadow-none disabled:inset-shadow-none",
  "aria-disabled:border-disabled aria-disabled:bg-disabled aria-disabled:text-disabled",
  "aria-disabled:shadow-none aria-disabled:inset-shadow-none",
];

export const buttonVariants = cva(
  [
    "relative isolate inline-flex shrink-0 items-center justify-center gap-2 overflow-hidden",
    "whitespace-nowrap select-none",
    "transition-interactive duration-fast",
    // Foco que se encaixa: o contorno já surge visível a 4px e chega a 2px em 100ms.
    // A cor fica fixa, para não piscar de outra cor. Sem animação para quem pede menos movimento.
    "outline-focus outline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2",
    "motion-reduce:outline-offset-2",
    // Cursor de clique, como no Toggletip. Desabilitado troca pelo de não permitido.
    "cursor-pointer disabled:cursor-not-allowed aria-disabled:cursor-not-allowed",
    "[&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary: [
          ...filled,
          "bg-gradient-brand before:bg-gradient-brand-hovered after:bg-gradient-brand-pressed",
        ],
        secondary: [
          ...outlined,
          "border-subtle text-default",
          // Fundo sólido anima direto com a transição de cor, sem as camadas do primary.
          // Pressionado: escurece e perde o brilho, e o botão afunda.
          "hover:bg-neutral-hovered active:bg-neutral-pressed",
        ],
        destructive: [
          ...filled,
          "bg-gradient-danger before:bg-gradient-danger-hovered after:bg-gradient-danger-pressed",
        ],
        "destructive-secondary": [
          ...outlined,
          "border-danger text-danger",
          // O fundo rosado reforça o risco. O neutro mais escuro não daria contraste ao texto vermelho.
          "hover:bg-danger-subtle-hovered active:bg-danger-subtle-pressed",
        ],
        ghost: [
          // Sem fundo, borda nem volume: o fundo neutro só aparece no hover e ao pressionar.
          "bg-transparent text-default",
          "hover:bg-neutral-hovered active:bg-neutral-pressed",
          "disabled:bg-transparent disabled:text-disabled",
          "aria-disabled:bg-transparent aria-disabled:text-disabled",
        ],
      },
      // O raio cresce com o tamanho para manter a mesma suavidade: 8px no sm, 12px no md.
      size: {
        sm: "h-8 px-3 rounded-lg text-label-md [&_svg]:size-4",
        md: "h-10 px-4 rounded-xl text-label-md [&_svg]:size-5",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps extends ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  /**
   * Usa o filho como elemento, com a aparência de botão. Serve para links:
   * `<Button asChild><a href="/novo">Criar</a></Button>`.
   */
  asChild?: boolean;
  /** Ícone antes do texto: `iconLeft={<IconPlus />}`. Ganha o tamanho certo para cada `size`. */
  iconLeft?: ReactNode;
  /** Ícone depois do texto: `iconRight={<IconArrowRight />}`. */
  iconRight?: ReactNode;
}

/** Ícone decorativo: o nome do botão vem do texto (ou do aria-label), nunca do ícone. */
function ButtonIcon({ children }: { children: ReactNode }) {
  if (children == null || children === false) return null;
  return (
    <span aria-hidden="true" className="inline-flex shrink-0">
      {children}
    </span>
  );
}

/** Botão de ação. Ícones vão em `iconLeft` e `iconRight` e ganham o tamanho certo para cada `size`. */
export function Button({
  className,
  variant,
  size,
  asChild = false,
  type,
  iconLeft,
  iconRight,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      // Sem `type`, um botão dentro de um formulário envia o formulário.
      type={asChild ? type : (type ?? "button")}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      <ButtonIcon>{iconLeft}</ButtonIcon>
      {/* Com asChild, os ícones entram dentro do filho (por exemplo o link), em volta do texto. */}
      <Slottable>{children}</Slottable>
      <ButtonIcon>{iconRight}</ButtonIcon>
    </Comp>
  );
}
