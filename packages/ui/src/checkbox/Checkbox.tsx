import { Indicator, Root } from "@radix-ui/react-checkbox";
import { IconAlertCircle } from "@tabler/icons-react";
import { cva } from "class-variance-authority";
import { type ComponentProps, type ReactNode, useId } from "react";
import { cn } from "../lib/cn.ts";
import { FieldLabel } from "../lib/FieldLabel.tsx";

/**
 * A caixa do checkbox, de 16px. Um tamanho só: ao lado de um label de 14px, ela equilibra sem
 * pesar. Marcado e indeterminado usam o mesmo preenchimento do Button primary.
 */
export const checkboxVariants = cva([
  "group relative isolate inline-flex size-4 shrink-0 items-center justify-center rounded-sm",
  "[&_svg]:size-3",
  // Como no Input, exceção consciente: em repouso a borda é subtle (abaixo dos 3:1 da WCAG),
  // para a caixa ficar leve. No hover e no foco ela vai para default (3:1), e o label nomeia.
  "border border-subtle bg-neutral text-static-white shadow-sm",
  "hover:border-default focus-visible:border-default",
  "transition-interactive duration-fast",
  // Mesmo foco do Button: surge a 4px e chega a 2px, sem animação para quem pede menos.
  "outline-focus outline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2",
  "motion-reduce:outline-offset-2",
  "aria-invalid:border-danger",
]);

/**
 * Estados com cursor de clique. Marcado e indeterminado ganham o degradê e o brilho no topo
 * numa camada por cima da caixa (before), e não no fundo dela: o navegador não faz fade de um
 * degradê, mas faz da opacidade de uma camada. Assim o verde entra e sai num fade rápido.
 * A camada cobre também a borda (-inset-px) e herda o canto da caixa.
 *
 * O hover marcado repete o do Button primary: uma segunda camada (after), com o degradê mais
 * escuro e o mesmo brilho, que aparece num fade por cima da primeira.
 */
const enabled = [
  "cursor-pointer hover:bg-neutral-hovered",
  "before:absolute before:-inset-px before:-z-10 before:rounded-[inherit]",
  "before:bg-gradient-brand before:inset-shadow-highlight",
  "before:opacity-0 before:transition-opacity before:duration-fast",
  "data-[state=checked]:before:opacity-100 data-[state=indeterminate]:before:opacity-100",
  "after:absolute after:-inset-px after:-z-10 after:rounded-[inherit]",
  "after:bg-gradient-brand-hovered after:inset-shadow-highlight",
  "after:opacity-0 after:transition-opacity after:duration-fast",
  "data-[state=checked]:hover:after:opacity-100 data-[state=indeterminate]:hover:after:opacity-100",
  // Como no Button: sem o fade do hover para quem pede menos movimento.
  "motion-reduce:after:transition-none",
];

/**
 * Desabilitado fica no lugar do `enabled`, e não por cima dele: assim o degradê de marcado
 * nunca vence o cinza de desabilitado, seja qual for a ordem das classes no CSS.
 */
const disabledClasses = "cursor-not-allowed border-disabled bg-disabled text-disabled shadow-none";

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
            className={cn(checkboxVariants(), disabled ? disabledClasses : enabled)}
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
