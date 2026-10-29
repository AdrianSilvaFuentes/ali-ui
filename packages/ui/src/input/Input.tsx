import { Root as LabelRoot } from "@radix-ui/react-label";
import { IconAlertCircle } from "@tabler/icons-react";
import { cva, type VariantProps } from "class-variance-authority";
import { type ComponentProps, type ReactNode, useId } from "react";
import { cn } from "../lib/cn.ts";

/**
 * A caixa do campo. O input fica dentro dela, sem borda própria, para os ícones caberem
 * ao lado do texto. Por isso foco, erro e desabilitado ficam na caixa.
 */
export const inputVariants = cva(
  [
    "group flex w-full items-center gap-2",
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

/** Campo de texto com label, ajuda e erro já ligados ao input para o leitor de tela. */
export function Input({
  className,
  size,
  label,
  description,
  error,
  iconLeft,
  iconRight,
  id,
  disabled,
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
        <LabelRoot
          htmlFor={inputId}
          className={cn("text-label-md", disabled ? "text-disabled" : "text-default")}
        >
          {label}
        </LabelRoot>
      ) : null}
      <div
        className={inputVariants({ size })}
        data-invalid={invalid || undefined}
        data-disabled={disabled || undefined}
      >
        <InputIcon>{iconLeft}</InputIcon>
        <input
          id={inputId}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          aria-describedby={
            [describedBy, descriptionId, errorId].filter(Boolean).join(" ") || undefined
          }
          className="h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-placeholder disabled:cursor-not-allowed"
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
