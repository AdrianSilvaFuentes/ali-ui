import { Range, Root, Thumb, Track } from "@radix-ui/react-slider";
import { cva } from "class-variance-authority";
import { type ComponentProps, type ReactNode, useId, useState } from "react";
import { cn } from "../lib/cn.ts";
import { FieldLabel } from "../lib/FieldLabel.tsx";
import { FieldError, FieldHelp } from "../lib/FieldMessage.tsx";

/**
 * O trilho, de 6px de altura: afundado como o Switch desligado (fundo neutral-pressed e
 * inset-shadow-sunken por dentro). A parte escolhida (Range) usa o degradê de marca do Switch
 * ligado. Desabilitado, os dois ficam cinza.
 */
export const sliderVariants = cva(
  "relative h-1.5 grow overflow-hidden rounded-full bg-neutral-pressed inset-shadow-sunken",
);

/**
 * A bolinha, de 16px: branca e elevada como a do Switch, com sombra e contorno border-subtle,
 * que escurece no hover. O foco é o mesmo do Button: surge a 4px e chega a 2px.
 */
export const sliderThumbVariants = cva([
  "block size-4 rounded-full bg-current text-static-white shadow-sm ring-1 ring-subtle",
  "outline-focus outline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2",
  "transition-interactive duration-fast motion-reduce:outline-offset-2",
  "aria-invalid:ring-danger",
]);

/** Habilitada: cursor de pegar, contorno mais escuro no hover e no foco. */
const thumbEnabled =
  "cursor-grab hover:ring-default focus-visible:ring-default active:cursor-grabbing";

/** Desabilitada: sem sombra, com contorno disabled. */
const thumbDisabled = "cursor-not-allowed shadow-none ring-disabled";

export interface SliderProps
  extends Omit<ComponentProps<typeof Root>, "asChild" | "children" | "orientation" | "dir"> {
  /** Nome do controle, acima do trilho. Sem label, passe um `aria-label`. */
  label?: ReactNode;
  /** Ajuda extra num ícone de info no fim do label, que abre um Toggletip. Precisa de `label`. */
  labelInfo?: ReactNode;
  /** Texto de ajuda abaixo do trilho, lido pelo leitor de tela junto com o label. */
  description?: ReactNode;
  /** Mensagem de erro. Substitui a ajuda e aparece com ícone, não só em vermelho. */
  error?: ReactNode;
  /**
   * Mostra o valor escolhido no fim da linha do label. Ligado por padrão. Com duas bolinhas,
   * mostra a faixa: "20–80".
   */
  showValue?: boolean;
  /**
   * Como escrever cada valor, na tela e no leitor de tela: `(v) => \`R$ ${v}\``. Sem ele, o
   * número puro.
   */
  formatValue?: (value: number) => string;
  /**
   * Nome de cada bolinha para o leitor de tela, somado ao label. Com duas bolinhas, o padrão
   * é "mínimo" e "máximo".
   */
  thumbLabels?: string[];
  /** Classes do bloco inteiro (label, trilho e mensagens), por exemplo a largura. */
  className?: string;
}

/**
 * Escolhe um número, ou uma faixa entre dois, arrastando: volume, preço, tamanho. Pelo
 * teclado, as setas andam um passo, Page Up e Page Down andam dez, Home e End vão às pontas.
 * Uma bolinha para um valor (`defaultValue={[40]}`), duas para uma faixa (`[20, 80]`).
 */
export function Slider({
  className,
  label,
  labelInfo,
  description,
  error,
  showValue = true,
  formatValue = String,
  thumbLabels,
  id,
  disabled,
  value,
  defaultValue,
  onValueChange,
  min = 0,
  max = 100,
  "aria-label": ariaLabel,
  "aria-describedby": describedBy,
  ...props
}: SliderProps) {
  const autoId = useId();
  const sliderId = id ?? autoId;
  const labelId = label ? `${sliderId}-label` : undefined;
  // Com erro, a mensagem de erro substitui a ajuda, na tela e no leitor de tela.
  const showDescription = Boolean(description) && !error;
  const descriptionId = showDescription ? `${sliderId}-description` : undefined;
  const errorId = error ? `${sliderId}-error` : undefined;
  const invalid = Boolean(error);

  // O valor da tela acompanha o arrasto, controlado ou não.
  const [ownValue, setOwnValue] = useState(defaultValue ?? [min]);
  const current = value ?? ownValue;
  const range = current.length > 1;
  const names = thumbLabels ?? (range ? ["mínimo", "máximo"] : []);
  const shown = current.map(formatValue).join("–");

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label || showValue ? (
        <div className="flex items-center justify-between gap-3">
          {label ? (
            <FieldLabel id={labelId} info={labelInfo} disabled={disabled}>
              {label}
            </FieldLabel>
          ) : null}
          {showValue ? (
            // O leitor de tela já ouve o valor na bolinha; aqui ele seria lido duas vezes.
            <span
              aria-hidden="true"
              className={cn(
                "ml-auto text-label-md tabular-nums",
                disabled ? "text-disabled" : "text-default",
              )}
            >
              {shown}
            </span>
          ) : null}
        </div>
      ) : null}
      <Root
        id={sliderId}
        disabled={disabled}
        value={value}
        defaultValue={defaultValue}
        min={min}
        max={max}
        onValueChange={(next) => {
          setOwnValue(next);
          onValueChange?.(next);
        }}
        className={cn(
          "relative flex h-4 w-full touch-none items-center select-none",
          disabled && "cursor-not-allowed",
        )}
        {...props}
      >
        <Track className={cn(sliderVariants(), disabled && "bg-disabled inset-shadow-none")}>
          <Range
            className={cn(
              "absolute h-full",
              disabled ? "bg-current text-disabled" : "bg-gradient-brand",
            )}
          />
        </Track>
        {current.map((thumbValue, index) => {
          const thumbId = `${sliderId}-thumb-${index}`;
          const name = names[index];
          return (
            <Thumb
              // A posição da bolinha não muda: a de índice 0 é sempre a do mínimo.
              // biome-ignore lint/suspicious/noArrayIndexKey: a ordem das bolinhas é fixa.
              key={index}
              id={thumbId}
              // Com label, o nome é o label mais o da bolinha ("Preço mínimo"): o
              // aria-labelledby aponta para o label e para a própria bolinha, que traz o
              // aria-label com o nome dela.
              aria-labelledby={
                labelId ? [labelId, name && thumbId].filter(Boolean).join(" ") : undefined
              }
              aria-label={labelId ? name : [ariaLabel, name].filter(Boolean).join(" ") || undefined}
              aria-valuetext={formatValue(thumbValue)}
              aria-describedby={
                [describedBy, descriptionId, errorId].filter(Boolean).join(" ") || undefined
              }
              aria-invalid={invalid || undefined}
              className={cn(sliderThumbVariants(), disabled ? thumbDisabled : thumbEnabled)}
            />
          );
        })}
      </Root>
      {showDescription ? <FieldHelp id={descriptionId}>{description}</FieldHelp> : null}
      {error ? <FieldError id={errorId}>{error}</FieldError> : null}
    </div>
  );
}
