import { IconX } from "@tabler/icons-react";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, KeyboardEvent } from "react";
import { Avatar } from "../avatar/Avatar.tsx";
import { cn } from "../lib/cn.ts";

/**
 * A pílula, como no Figma: fundo neutral, sombra mínima (xs) e o brilho no topo, como o Tag,
 * com o nome em label-sm (12px). O contorno border-subtle é por dentro (inside, como no Figma e
 * no Avatar): uma camada por cima, com o mesmo canto, que não ocupa espaço. Assim os respiros
 * são medidos da borda de fora. 4px separam avatar, nome e X. No hover, o chip todo ganha o
 * fundo neutral-hovered.
 */
export const chipVariants = cva(
  [
    "relative inline-flex shrink-0 items-center gap-1 whitespace-nowrap select-none",
    "bg-neutral text-label-sm text-default shadow-xs inset-shadow-highlight",
    "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit]",
    "after:border after:border-subtle",
    "transition-interactive duration-fast hover:bg-neutral-hovered",
  ],
  {
    variants: {
      // sm: 24px, canto de 12px, avatar xs (20px). md: 28px, canto de 16px, avatar sm (24px).
      // Nos dois, o avatar fica a 2px da borda da esquerda.
      size: {
        sm: "h-6 rounded-xl pl-0.5",
        md: "h-7 rounded-2xl pl-0.5",
      },
      removable: { true: "", false: "" },
    },
    // À direita: 6px até o X nos dois tamanhos; sem X, 8px no sm e 10px no md.
    compoundVariants: [
      { removable: true, className: "pr-1.5" },
      { removable: false, size: "sm", className: "pr-2" },
      { removable: false, size: "md", className: "pr-2.5" },
    ],
    defaultVariants: { size: "md", removable: false },
  },
);

/**
 * O X de remover: o ícone de 14px em icon-subtle, que escurece no hover. Pequeno como no
 * Figma; continua fácil de acertar porque cada X fica longe do próximo (a exceção de
 * espaçamento da WCAG 2.5.8). O foco é um contorno redondo, 2px por fora.
 */
const removeVariants = cva([
  "inline-flex size-3.5 shrink-0 cursor-pointer items-center justify-center rounded-full",
  "text-icon-subtle hover:text-default [&_svg]:size-3.5",
  "transition-interactive duration-fast",
  "outline-focus outline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2",
  "motion-reduce:outline-offset-2",
]);

export interface ChipProps
  extends Omit<ComponentProps<"span">, "children">,
    Omit<VariantProps<typeof chipVariants>, "removable"> {
  /** O nome da pessoa: o texto do chip e as iniciais do avatar, sem foto. */
  name: string;
  /** Endereço da foto. Enquanto carrega, ou se falhar, aparecem as iniciais. */
  src?: string;
  /** Mostra um X que chama esta função. Depois de remover, leve o foco para outro lugar. */
  onRemove?: () => void;
  /** Nome do X para o leitor de tela. Padrão: "Remover" + o nome. */
  removeLabel?: string;
}

/**
 * Uma pessoa numa pílula: avatar, nome e, com `onRemove`, um X para tirar. Para categorias, sem
 * pessoa, use o Tag. Pelo teclado, o X recebe foco; Enter, Espaço, Delete ou Backspace removem.
 */
export function Chip({ className, size, name, src, onRemove, removeLabel, ...props }: ChipProps) {
  const removable = Boolean(onRemove);

  // Delete e Backspace removem, como no Tag; Enter e Espaço já clicam o botão.
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Delete" || event.key === "Backspace") {
      event.preventDefault();
      onRemove?.();
    }
  };

  return (
    <span className={cn(chipVariants({ size, removable }), className)} {...props}>
      {/* O nome já está escrito ao lado: o avatar não é anunciado de novo. */}
      <span aria-hidden="true" className="inline-flex">
        <Avatar name={name} src={src} size={size === "sm" ? "xs" : "sm"} />
      </span>
      {name}
      {onRemove ? (
        <button
          type="button"
          aria-label={removeLabel ?? `Remover ${name}`}
          className={removeVariants()}
          onClick={onRemove}
          onKeyDown={handleKeyDown}
        >
          <IconX aria-hidden="true" />
        </button>
      ) : null}
    </span>
  );
}
