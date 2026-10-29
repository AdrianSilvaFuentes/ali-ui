import { IconAlertCircle } from "@tabler/icons-react";
import { cva, type VariantProps } from "class-variance-authority";
import { type ComponentProps, type MouseEvent, type ReactNode, useId } from "react";
import { cn } from "../lib/cn.ts";
import { FieldLabel } from "../lib/FieldLabel.tsx";

/**
 * A caixa do campo. O input fica dentro dela, sem borda própria, para os ícones caberem
 * ao lado do texto. Por isso foco, erro e desabilitado ficam na caixa.
 */
export const inputVariants = cva(
  [
    "group flex w-full items-center gap-2",
    // Cursor de texto na caixa toda, não só no input: um clique no respiro ou num ícone também
    // foca o campo (veja focusField).
    "cursor-text",
    // Sombra pequena, como a do Button, mas sem o brilho no topo: o campo não é para clicar.
    // Exceção consciente: em repouso a borda é subtle (abaixo dos 3:1 da WCAG), para o campo
    // ficar leve. No hover e no foco ela vai para default (3:1), e o label nomeia o campo.
    "border border-subtle bg-neutral text-default shadow-sm",
    "hover:border-default focus-within:border-default",
    "transition-interactive duration-fast",
    // Campo de texto mostra o foco também no clique, não só no teclado. O contorno se encaixa
    // como no Button: surge a 4px e chega a 2px. Sem animação para quem pede menos movimento.
    "outline-focus outline-offset-4 focus-within:outline-2 focus-within:outline-offset-2",
    "motion-reduce:outline-offset-2",
    "data-invalid:border-danger",
    // Somente leitura: fundo próprio e borda que não escurece, para não parecer editável.
    // Cursor de seta: sem a promessa de digitar, mas sem o "proibido" do desabilitado,
    // porque o texto ainda pode ser selecionado e copiado.
    "data-readonly:bg-readonly data-readonly:border-subtle data-readonly:cursor-default",
    // Desabilitado mantém o fundo neutro, com texto e borda em disabled.
    "data-disabled:cursor-not-allowed data-disabled:border-disabled data-disabled:text-disabled",
    "data-disabled:shadow-none",
    "[&_svg]:shrink-0",
  ],
  {
    variants: {
      // Mesma altura e raio do Button, para campo e botão ficarem lado a lado.
      size: {
        sm: "h-8 px-3 rounded-lg text-body-md [&_svg]:size-4",
        md: "h-10 px-3 rounded-xl text-body-md [&_svg]:size-5",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export interface InputProps
  extends Omit<ComponentProps<"input">, "size">,
    VariantProps<typeof inputVariants> {
  /** Nome do campo, ligado ao input. Sem label, passe um `aria-label`. */
  label?: ReactNode;
  /**
   * Ajuda extra num ícone de info no fim do label, que abre um Toggletip. Para o que não
   * cabe na ajuda abaixo do campo. Precisa de `label`.
   */
  labelInfo?: ReactNode;
  /** Texto de ajuda abaixo do campo, lido pelo leitor de tela junto com o label. */
  description?: ReactNode;
  /** Mensagem de erro. Marca o campo como inválido e aparece com ícone, não só em vermelho. */
  error?: ReactNode;
  /** Ícone antes do texto: `iconLeft={<IconSearch />}`. */
  iconLeft?: ReactNode;
  /** Ícone depois do texto. */
  iconRight?: ReactNode;
  /** Classes do bloco inteiro (label, campo e mensagens), por exemplo a largura. */
  className?: string;
}

/** Ícone decorativo do campo: o leitor de tela lê o label, não o ícone. */
function InputIcon({ children }: { children: ReactNode }) {
  if (children == null || children === false) return null;
  return (
    <span
      aria-hidden="true"
      className="inline-flex text-icon-subtle group-data-disabled:text-icon-disabled"
    >
      {children}
    </span>
  );
}

/**
 * Clique na caixa fora do input (respiro ou ícone) foca o campo. Só para o mouse: pelo
 * teclado o foco já vai direto no input. O preventDefault evita que o clique tire o foco.
 */
function focusField(event: MouseEvent<HTMLDivElement>) {
  const field = event.currentTarget.querySelector("input");
  if (!field || event.target === field || field.disabled) return;
  event.preventDefault();
  field.focus();
}

/** Campo de texto com label, ajuda e erro já ligados ao input para o leitor de tela. */
export function Input({
  className,
  size,
  label,
  labelInfo,
  description,
  error,
  iconLeft,
  iconRight,
  id,
  disabled,
  readOnly,
  "aria-describedby": describedBy,
  ...props
}: InputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const descriptionId = description ? `${inputId}-description` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const invalid = Boolean(error);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <FieldLabel htmlFor={inputId} info={labelInfo} disabled={disabled}>
          {label}
        </FieldLabel>
      ) : null}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: atalho só do mouse; o teclado foca o input direto. */}
      <div
        className={inputVariants({ size })}
        onMouseDown={focusField}
        data-invalid={invalid || undefined}
        data-disabled={disabled || undefined}
        data-readonly={readOnly || undefined}
      >
        <InputIcon>{iconLeft}</InputIcon>
        <input
          id={inputId}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={invalid || undefined}
          aria-describedby={
            [describedBy, descriptionId, errorId].filter(Boolean).join(" ") || undefined
          }
          className={cn(
            "h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-placeholder",
            "disabled:cursor-not-allowed",
            readOnly && "cursor-default",
          )}
          {...props}
        />
        <InputIcon>{iconRight}</InputIcon>
      </div>
      {description ? (
        <p id={descriptionId} className="text-body-sm text-subtle">
          {description}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="flex items-center gap-1.5 text-body-sm text-danger">
          <IconAlertCircle aria-hidden="true" className="size-4 shrink-0 text-icon-danger" />
          {error}
        </p>
      ) : null}
    </div>
  );
}
