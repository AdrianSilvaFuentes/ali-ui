import { IconX } from "@tabler/icons-react";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, KeyboardEvent, ReactNode } from "react";
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
      // Ícone um pouco maior que o texto. O canto diminui com o tamanho. A regra mira o
      // data-slot dos ícones, e não só "svg": assim pesa mais que a de quem está em volta
      // (como a caixa do Input no MultiSelect, que deixa todo ícone com 20px).
      size: {
        sm: "h-5 rounded-sm gap-1 px-1.5 text-label-sm [&_[data-slot=tag-icon]_svg]:size-3",
        md: "h-6 rounded-md gap-1 px-2 text-label-sm [&_[data-slot=tag-icon]_svg]:size-3.5",
      },
    },
    defaultVariants: { tone: "neutral", size: "md" },
  },
);

/**
 * O X de remover: um quadrado da altura da tag, encostado na borda direita, com o mesmo canto.
 * A margem negativa tira o espaço interno da direita e aproxima o X do texto.
 */
const removeVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center rounded-[inherit]",
    // Cursor de clique, como no Toggletip: um ícone solto não parece clicável sem ele.
    "cursor-pointer",
    // Foco por dentro do quadrado, como no Toggletip: o contorno surge na borda e fecha 2px
    // para dentro. Sem animação para quem pede menos movimento.
    "transition-interactive duration-fast",
    "outline-focus outline-offset-0 focus-visible:outline-2 focus-visible:-outline-offset-2",
    "motion-reduce:-outline-offset-2",
  ],
  {
    variants: {
      size: {
        sm: "-mr-1.5 -ml-0.5 size-5",
        md: "-mr-2 -ml-1 size-6",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export interface TagProps
  extends Omit<ComponentProps<"span">, "children">,
    VariantProps<typeof tagVariants> {
  /** O texto da etiqueta. */
  children: ReactNode;
  /** Ícone antes do texto: `icon={<IconTag />}`. Decorativo; ganha o tamanho e a cor do tom. */
  icon?: ReactNode;
  /** Mostra o X no fim da tag e é chamado ao clicar nele ou ao apertar Delete ou Backspace. */
  onRemove?: () => void;
  /**
   * O que o leitor de tela anuncia no X. Padrão: "Remover" mais o texto da tag ("Remover
   * Design"). Passe sempre que o texto não for uma string.
   */
  removeLabel?: string;
}

/**
 * Etiqueta retangular para categorizar: texto curto, com ícone opcional, em sete tons. Com
 * `onRemove`, ganha um X para remover; depois de remover, leve o foco para outro lugar.
 */
export function Tag({
  className,
  tone,
  size,
  icon,
  onRemove,
  removeLabel,
  children,
  ...props
}: TagProps) {
  const label = removeLabel ?? (typeof children === "string" ? `Remover ${children}` : "Remover");

  // Delete e Backspace removem, como nos campos de tags; Enter e espaço já clicam o botão.
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Delete" || event.key === "Backspace") {
      event.preventDefault();
      onRemove?.();
    }
  };

  return (
    <span className={cn(tagVariants({ tone, size }), className)} {...props}>
      {/* O ícone não é anunciado: o nome da etiqueta é o texto. */}
      {icon ? (
        <span aria-hidden="true" data-slot="tag-icon" className="inline-flex">
          {icon}
        </span>
      ) : null}
      {children}
      {onRemove ? (
        <button
          type="button"
          aria-label={label}
          data-slot="tag-icon"
          className={removeVariants({ size })}
          onClick={onRemove}
          onKeyDown={handleKeyDown}
        >
          <IconX aria-hidden="true" />
        </button>
      ) : null}
    </span>
  );
}
