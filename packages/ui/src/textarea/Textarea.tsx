import { Root as LabelRoot } from "@radix-ui/react-label";
import { IconAlertCircle } from "@tabler/icons-react";
import { cva, type VariantProps } from "class-variance-authority";
import { type ComponentProps, type ReactNode, useId } from "react";
import { cn } from "../lib/cn.ts";

/**
 * A caixa do campo, como no Input: borda, foco, erro e desabilitado ficam nela, e a textarea
 * vai dentro, sem borda. O respiro da caixa em cima, embaixo e à direita mantém a barra de
 * rolagem e a alça de esticar longe do canto arredondado, que o navegador não recorta nelas.
 */
export const textareaVariants = cva(
  [
    // 4px bastam para a curva do canto (raio de até 12px) não alcançar a barra.
    "block w-full py-1 pr-1",
    // Mesma borda e sombra do Input. Exceção consciente: em repouso a borda é subtle (abaixo
    // dos 3:1 da WCAG), para o campo ficar leve. No hover e no foco ela vai para default.
    "border border-subtle bg-neutral text-default shadow-sm",
    "hover:border-default focus-within:border-default",
    "transition-interactive duration-fast",
    // Foco também no clique, como no Input: o contorno surge a 4px e chega a 2px.
    "outline-focus outline-offset-4 focus-within:outline-2 focus-within:outline-offset-2",
    "motion-reduce:outline-offset-2",
    "data-invalid:border-danger",
    "data-readonly:bg-readonly data-readonly:border-subtle",
    "data-disabled:cursor-not-allowed data-disabled:border-disabled data-disabled:text-disabled",
    "data-disabled:shadow-none",
  ],
  {
    variants: {
      // Mesmo raio do Input e do Button. O espaço da textarea, somado aos 4px da caixa, alinha
      // a primeira linha com o texto de um Input do mesmo tamanho ao lado (6px no sm, 10px no md).
      size: {
        sm: "rounded-lg text-body-md [&>textarea]:py-0.5",
        md: "rounded-xl text-body-md [&>textarea]:py-1.5",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export interface TextareaProps
  extends ComponentProps<"textarea">,
    VariantProps<typeof textareaVariants> {
  /** Nome do campo, ligado à textarea. Sem label, passe um `aria-label`. */
  label?: ReactNode;
  /** Texto de ajuda abaixo do campo, lido pelo leitor de tela junto com o label. */
  description?: ReactNode;
  /** Mensagem de erro. Marca o campo como inválido e aparece com ícone, não só em vermelho. */
  error?: ReactNode;
  /** Classes do bloco inteiro (label, campo e mensagens), por exemplo a largura. */
  className?: string;
}

/** Campo de texto longo com label, ajuda e erro já ligados para o leitor de tela. */
export function Textarea({
  className,
  size,
  label,
  description,
  error,
  id,
  disabled,
  readOnly,
  rows = 3,
  "aria-describedby": describedBy,
  ...props
}: TextareaProps) {
  const autoId = useId();
  const textareaId = id ?? autoId;
  const descriptionId = description ? `${textareaId}-description` : undefined;
  const errorId = error ? `${textareaId}-error` : undefined;
  const invalid = Boolean(error);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <LabelRoot
          htmlFor={textareaId}
          className={cn("text-label-md", disabled ? "text-disabled" : "text-default")}
        >
          {label}
        </LabelRoot>
      ) : null}
      <div
        className={textareaVariants({ size })}
        data-invalid={invalid || undefined}
        data-disabled={disabled || undefined}
        data-readonly={readOnly || undefined}
      >
        <textarea
          id={textareaId}
          rows={rows}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={invalid || undefined}
          aria-describedby={
            [describedBy, descriptionId, errorId].filter(Boolean).join(" ") || undefined
          }
          className={cn(
            "block w-full resize-y bg-transparent pr-2 pl-3 outline-none",
            "placeholder:text-placeholder",
            // Barra de rolagem fina, na cor da borda e sem trilho. Formato e quando ela aparece
            // continuam com o navegador e o sistema (no Mac, ela some quando não se está rolando).
            "[scrollbar-width:thin] [scrollbar-color:var(--ali-color-border-default)_transparent]",
            // Degradê em cima e embaixo quando há texto escondido, em vez do corte reto.
            "scroll-fade-y",
            // Desabilitado não estica: a alça sugeriria que o campo ainda responde.
            "disabled:cursor-not-allowed disabled:resize-none",
          )}
          {...props}
        />
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
