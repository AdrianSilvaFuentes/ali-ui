import { Root, Thumb } from "@radix-ui/react-switch";
import { cva } from "class-variance-authority";
import { type ComponentProps, type ReactNode, useId } from "react";
import { choiceBase, choiceDisabled, choiceEnabled } from "../lib/choice.ts";
import { cn } from "../lib/cn.ts";
import { FieldLabel } from "../lib/FieldLabel.tsx";
import { FieldError, FieldHelp } from "../lib/FieldMessage.tsx";

/**
 * O trilho, de 28×16px: a mesma altura do Checkbox. Borda, foco, camada verde e desabilitado
 * vêm de `lib/choice.ts`, iguais aos do Checkbox e do Radio. Desligado, o trilho é afundado:
 * fundo neutral-pressed, sem sombra por fora e com inset-shadow-sunken por dentro. Ligado, a
 * camada verde cobre tudo. A bolinha usa a cor do texto do trilho (bg-current): branca.
 */
export const switchVariants = cva([
  ...choiceBase,
  "h-4 w-7 justify-start rounded-full p-px",
  "bg-neutral-pressed shadow-none inset-shadow-sunken",
]);

/**
 * Habilitado: o hover não clareia o trilho afundado (o neutral-hovered do Checkbox é quase
 * branco); quem responde ao mouse é a borda, que escurece.
 */
const trackEnabled = "hover:bg-neutral-pressed";

export interface SwitchProps extends Omit<ComponentProps<typeof Root>, "asChild" | "children"> {
  /** O texto ao lado do switch. Clicar nele também liga e desliga. Sem label, passe um `aria-label`. */
  label?: ReactNode;
  /** Ajuda extra num ícone de info no fim do label, que abre um Toggletip. Precisa de `label`. */
  labelInfo?: ReactNode;
  /** Texto de ajuda abaixo do label, lido pelo leitor de tela junto com ele. */
  description?: ReactNode;
  /** Mensagem de erro. Substitui a ajuda e aparece com ícone, não só em vermelho. */
  error?: ReactNode;
  /** Classes do bloco inteiro (switch, label e mensagens). */
  className?: string;
}

/**
 * Liga e desliga algo que vale na hora, como "Notificações ativas". Para escolher algo que só
 * vale ao enviar um formulário, use o Checkbox.
 */
export function Switch({
  className,
  label,
  labelInfo,
  description,
  error,
  id,
  disabled,
  "aria-describedby": describedBy,
  ...props
}: SwitchProps) {
  const autoId = useId();
  const switchId = id ?? autoId;
  // Com erro, a mensagem de erro substitui a ajuda, na tela e no leitor de tela.
  const showDescription = Boolean(description) && !error;
  const descriptionId = showDescription ? `${switchId}-description` : undefined;
  const errorId = error ? `${switchId}-error` : undefined;
  const invalid = Boolean(error);

  return (
    // 2px entre label e mensagens, como no Checkbox: a ajuda fica junto da opção.
    <div className={cn("flex flex-col gap-0.5", className)}>
      {/* O estilo do label fica na linha toda, para o 1lh abaixo ser a altura da linha dele. */}
      <div className="flex items-start gap-2 text-label-md">
        {/* Uma linha de texto de altura (1lh): o trilho fica centrado na primeira linha. */}
        <span className="flex h-[1lh] items-center">
          <Root
            id={switchId}
            disabled={disabled}
            aria-invalid={invalid || undefined}
            aria-describedby={
              [describedBy, descriptionId, errorId].filter(Boolean).join(" ") || undefined
            }
            className={cn(
              switchVariants(),
              disabled ? [choiceDisabled, "inset-shadow-none"] : [choiceEnabled, trackEnabled],
            )}
            {...props}
          >
            <Thumb
              className={cn(
                "block size-3 rounded-full bg-current shadow-sm",
                // Elevada sobre o trilho afundado: branca, com sombra e contorno border-subtle,
                // que some sobre o verde.
                !disabled && "ring-1 ring-subtle data-[state=checked]:ring-transparent",
                // Desliza 12px até o outro lado, desacelerando no fim.
                "transition-[translate,width] duration-base ease-out",
                "data-[state=checked]:translate-x-3",
                // Pressionada, estica 2px para o lado em que vai, como se fizesse força.
                // Ligada, ela estica para a esquerda: anda 2px a menos para caber no trilho.
                !disabled && "group-active:w-3.5 data-[state=checked]:group-active:translate-x-2.5",
                "motion-reduce:transition-none",
              )}
            />
          </Root>
        </span>
        {label ? (
          <FieldLabel
            htmlFor={switchId}
            info={labelInfo}
            disabled={disabled}
            className={cn(!disabled && "cursor-pointer")}
          >
            {label}
          </FieldLabel>
        ) : null}
      </div>
      {/* O recuo de 36px (trilho de 28px mais o espaço) alinha as mensagens com o label. */}
      {showDescription ? (
        <FieldHelp id={descriptionId} className="pl-9">
          {description}
        </FieldHelp>
      ) : null}
      {error ? (
        <FieldError id={errorId} className="pl-9">
          {error}
        </FieldError>
      ) : null}
    </div>
  );
}
