import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "../lib/cn.ts";

export const buttonVariants = cva(
  [
    "relative isolate inline-flex shrink-0 items-center justify-center gap-2 overflow-hidden",
    "rounded-lg whitespace-nowrap select-none",
    "transition-colors duration-fast",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
    "disabled:cursor-not-allowed aria-disabled:cursor-not-allowed",
    "[&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary: [
          // Volume: sombra embaixo e um brilho fino no topo.
          "bg-gradient-brand text-static-white shadow-sm inset-shadow-highlight",
          // O navegador não anima a troca de um degradê por outro. Por isso hover e
          // pressionado são camadas por baixo do texto, que aparecem com um fade.
          // A camada de hover repete o brilho; a de pressionado não tem, e o botão afunda.
          // As camadas herdam o canto do botão, para o brilho seguir a curva.
          "before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:bg-gradient-brand-hovered",
          "before:inset-shadow-highlight",
          "before:opacity-0 before:transition-opacity before:duration-fast hover:before:opacity-100",
          "after:absolute after:inset-0 after:-z-10 after:rounded-[inherit] after:bg-gradient-brand-pressed",
          "after:opacity-0 after:transition-opacity after:duration-fast active:after:opacity-100",
          "motion-reduce:before:transition-none motion-reduce:after:transition-none",
          // Desabilitado tira o degradê e as camadas, e fica com a cor sólida de desabilitado.
          "disabled:bg-none disabled:bg-disabled disabled:text-disabled",
          "disabled:shadow-none disabled:inset-shadow-none disabled:before:hidden disabled:after:hidden",
          "aria-disabled:bg-none aria-disabled:bg-disabled aria-disabled:text-disabled",
          "aria-disabled:shadow-none aria-disabled:inset-shadow-none",
          "aria-disabled:before:hidden aria-disabled:after:hidden",
        ],
        secondary: [
          // Mesmo volume do primary, mas neutro: uma borda suave segura o botão em qualquer superfície.
          "border border-subtle bg-neutral text-default shadow-sm inset-shadow-highlight",
          // Fundo sólido anima direto com transition-colors, sem as camadas do primary.
          "hover:bg-neutral-hovered",
          // Pressionado: escurece e perde o brilho, e o botão afunda.
          "active:bg-neutral-pressed active:inset-shadow-none",
          "disabled:border-disabled disabled:bg-disabled disabled:text-disabled",
          "disabled:shadow-none disabled:inset-shadow-none",
          "aria-disabled:border-disabled aria-disabled:bg-disabled aria-disabled:text-disabled",
          "aria-disabled:shadow-none aria-disabled:inset-shadow-none",
        ],
      },
      size: {
        sm: "h-8 px-3 text-label-md [&_svg]:size-4",
        md: "h-10 px-4 text-label-md [&_svg]:size-5",
        lg: "h-12 px-5 text-label-lg [&_svg]:size-5",
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
}

/** Botão de ação. Ícones vão como filhos e ganham o tamanho certo para cada `size`. */
export function Button({ className, variant, size, asChild = false, type, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      // Sem `type`, um botão dentro de um formulário envia o formulário.
      type={asChild ? type : (type ?? "button")}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
