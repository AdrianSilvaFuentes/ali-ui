import { Indicator, Root } from "@radix-ui/react-checkbox";
import { IconAlertCircle } from "@tabler/icons-react";
import { cva } from "class-variance-authority";
import { type ComponentProps, type ReactNode, useId } from "react";
import { choiceBase, choiceDisabled, choiceEnabled } from "../lib/choice.ts";
import { cn } from "../lib/cn.ts";
import { FieldLabel } from "../lib/FieldLabel.tsx";

/**
 * A caixa do checkbox, de 16px. Um tamanho só: ao lado de um label de 14px, ela equilibra sem
 * pesar. Borda, foco, camada verde e desabilitado vêm de `lib/choice.ts`, iguais aos do Radio.
 */
export const checkboxVariants = cva([...choiceBase, "rounded-sm [&_svg]:size-3"]);

export interface CheckboxProps extends Omit<ComponentProps<typeof Root>, "asChild" | "children"> {
  /** O texto ao lado da caixa. Clicar nele também marca. Sem label, passe um `aria-label`. */
  label?: ReactNode;
  /** Ajuda extra num ícone de info no fim do label, que abre um Toggletip. Precisa de `label`. */
  labelInfo?: ReactNode;
  /** Texto de ajuda abaixo do label, lido pelo leitor de tela junto com ele. */
  description?: ReactNode;
  /** Mensagem de erro. Marca o checkbox como inválido e aparece com ícone, não só em vermelho. */
  error?: ReactNode;
  /** Classes do bloco inteiro (caixa, label e mensagens). */
  className?: string;
}

/**
 * Caixa de seleção com label, ajuda e erro. Ao marcar, o check se desenha; no indeterminado
 * (`checked="indeterminate"`), aparece um traço, para "alguns itens marcados".
 */
export function Checkbox({
  className,
  label,
  labelInfo,
  description,
  error,
  id,
  disabled,
  "aria-describedby": describedBy,
  ...props
}: CheckboxProps) {
  const autoId = useId();
  const checkboxId = id ?? autoId;
  // Com erro, a mensagem de erro substitui a ajuda, na tela e no leitor de tela.
  const showDescription = Boolean(description) && !error;
  const descriptionId = showDescription ? `${checkboxId}-description` : undefined;
  const errorId = error ? `${checkboxId}-error` : undefined;
  const invalid = Boolean(error);

  return (
    // 2px entre label e mensagens: a altura de linha da ajuda (body-md) já soma uns 4px de ar,
    // e ela fica junto da opção, como uma explicação dela.
    <div className={cn("flex flex-col gap-0.5", className)}>
      {/* O estilo do label fica na linha toda, para o 1lh abaixo ser a altura da linha dele. */}
      <div className="flex items-start gap-2 text-label-md">
        {/* Uma linha de texto de altura (1lh): a caixa fica centrada na primeira linha do label. */}
        <span className="flex h-[1lh] items-center">
          <Root
            id={checkboxId}
            disabled={disabled}
            aria-invalid={invalid || undefined}
            aria-describedby={
              [describedBy, descriptionId, errorId].filter(Boolean).join(" ") || undefined
            }
            className={cn(checkboxVariants(), disabled ? choiceDisabled : choiceEnabled)}
            {...props}
          >
            {/* Ao desmarcar, o check some num fade junto com o verde, em vez de sumir de uma vez. */}
            <Indicator className="flex items-center justify-center data-[state=unchecked]:animate-fade-out">
              {/* Traço de 2px: no tamanho do check, o 1.5px dos ícones do Tabler fica fino. */}
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path
                  d="M3.5 8.5 6.5 11.5 12.5 5"
                  pathLength={1}
                  className="animate-draw group-data-[state=indeterminate]:hidden"
                />
                <path
                  d="M4 8h8"
                  pathLength={1}
                  className="hidden animate-draw group-data-[state=indeterminate]:block"
                />
              </svg>
            </Indicator>
          </Root>
        </span>
        {label ? (
          <FieldLabel
            htmlFor={checkboxId}
            info={labelInfo}
            disabled={disabled}
            className={cn(!disabled && "cursor-pointer")}
          >
            {label}
          </FieldLabel>
        ) : null}
      </div>
      {showDescription ? (
        // body-md, como o label: abaixo de uma opção, a ajuda é lida junto com ela. O recuo
        // de 24px (caixa de 16px mais o espaço) alinha as mensagens com o texto do label.
        <p id={descriptionId} className="pl-6 text-body-md text-subtle">
          {description}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="flex items-center gap-1.5 pl-6 text-body-md text-danger">
          <IconAlertCircle aria-hidden="true" className="size-4 shrink-0 text-icon-danger" />
          {error}
        </p>
      ) : null}
    </div>
  );
}
