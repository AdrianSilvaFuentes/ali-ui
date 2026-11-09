import { IconMinus, IconPlus } from "@tabler/icons-react";
import type { VariantProps } from "class-variance-authority";
import {
  type ComponentProps,
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useId,
  useState,
} from "react";
import { inputVariants } from "../input/Input.tsx";
import { cn } from "../lib/cn.ts";
import { FieldLabel } from "../lib/FieldLabel.tsx";
import { FieldError, FieldHelp } from "../lib/FieldMessage.tsx";

export interface NumberInputProps
  extends Omit<
      ComponentProps<"input">,
      "size" | "type" | "value" | "defaultValue" | "onChange" | "min" | "max" | "step"
    >,
    VariantProps<typeof inputVariants> {
  /** Nome do campo, ligado ao input. Sem label, passe um `aria-label`. */
  label?: ReactNode;
  /** Ajuda extra num ícone de info no fim do label, que abre um Toggletip. Precisa de `label`. */
  labelInfo?: ReactNode;
  /** Texto de ajuda abaixo do campo, lido pelo leitor de tela junto com o label. */
  description?: ReactNode;
  /** Mensagem de erro. Marca o campo como inválido e aparece com ícone, não só em vermelho. */
  error?: ReactNode;
  /** O número, controlado por fora. `null` é o campo vazio. */
  value?: number | null;
  /** O número ao abrir, sem controlar o estado. */
  defaultValue?: number | null;
  /** Avisa o novo número (ou `null`, campo vazio) a cada botão, seta ou ao sair do campo. */
  onValueChange?: (value: number | null) => void;
  /** Menor valor. O botão − para nele. */
  min?: number;
  /** Maior valor. O botão + para nele. */
  max?: number;
  /** Quanto cada botão ou seta soma. Page Up e Page Down andam dez vezes isso. */
  step?: number;
  /** Classes do bloco inteiro (label, campo e mensagens). O campo tem largura própria. */
  className?: string;
}

/** Casas decimais de um número, para a soma não sair 0.30000000000000004. */
function decimals(n: number) {
  return String(n).split(".")[1]?.length ?? 0;
}

/** O número como texto, com vírgula nos decimais: 1,5. */
function format(n: number | null) {
  return n == null ? "" : String(n).replace(".", ",");
}

/** O texto digitado como número. Aceita vírgula ou ponto nos decimais. Vazio é `null`. */
function parse(text: string): number | null {
  const clean = text.trim().replace(",", ".");
  if (clean === "" || clean === "-") return null;
  const n = Number(clean);
  return Number.isFinite(n) ? n : null;
}

/** Campo de número com botões − e + nas pontas: quantidade, pessoas, dias. */
export function NumberInput({
  className,
  size,
  label,
  labelInfo,
  description,
  error,
  value,
  defaultValue = null,
  onValueChange,
  min,
  max,
  step = 1,
  name,
  id,
  disabled,
  readOnly,
  onBlur,
  onKeyDown,
  "aria-describedby": describedBy,
  ...props
}: NumberInputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  // Com erro, a mensagem de erro substitui a ajuda, na tela e no leitor de tela.
  const showDescription = Boolean(description) && !error;
  const descriptionId = showDescription ? `${inputId}-description` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const invalid = Boolean(error);

  const [ownValue, setOwnValue] = useState(defaultValue);
  const current = value === undefined ? ownValue : value;
  // O texto na tela, que pode estar no meio da digitação ("1," ou "-").
  const [draft, setDraft] = useState(format(current));
  useEffect(() => setDraft(format(current)), [current]);

  const clamp = (n: number) => Math.min(max ?? n, Math.max(min ?? n, n));

  function commit(next: number | null) {
    const final = next == null ? null : clamp(next);
    setDraft(format(final));
    if (final === current) return;
    setOwnValue(final);
    onValueChange?.(final);
  }

  /** Soma `steps` passos ao número atual. Vazio começa do mínimo, ou do zero. */
  function stepBy(steps: number) {
    const base = current ?? min ?? 0;
    const places = Math.max(decimals(step), decimals(base));
    commit(Number((base + steps * step).toFixed(places)));
  }

  const editable = !disabled && !readOnly;
  const atMin = current != null && min != null && current <= min;
  const atMax = current != null && max != null && current >= max;

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented || !editable) return;
    switch (event.key) {
      case "ArrowUp":
        stepBy(1);
        break;
      case "ArrowDown":
        stepBy(-1);
        break;
      case "PageUp":
        stepBy(10);
        break;
      case "PageDown":
        stepBy(-10);
        break;
      case "Home":
        if (min == null) return;
        commit(min);
        break;
      case "End":
        if (max == null) return;
        commit(max);
        break;
      case "Enter":
        // Enter confere o número e segue: ele também envia o formulário.
        commit(parse(draft));
        return;
      default:
        return;
    }
    event.preventDefault();
  }

  /**
   * Os botões − e +, do tamanho da altura do campo. Fora da ordem do Tab: pelo teclado, as
   * setas fazem o mesmo dentro do campo, sem duas paradas a mais. O leitor de tela os acha
   * pelo nome.
   */
  function stepButton(direction: -1 | 1) {
    const blocked = !editable || (direction < 0 ? atMin : atMax);
    return (
      <button
        type="button"
        tabIndex={-1}
        aria-label={direction < 0 ? "Diminuir" : "Aumentar"}
        aria-controls={inputId}
        disabled={blocked}
        // Sem tirar o foco do campo ao clicar: quem digita continua digitando.
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => stepBy(direction)}
        className={cn(
          "inline-flex aspect-square h-full shrink-0 cursor-pointer items-center justify-center",
          "text-icon-subtle transition-interactive duration-fast",
          "hover:bg-neutral-hovered hover:text-default active:bg-neutral-pressed",
          "disabled:cursor-not-allowed disabled:bg-transparent disabled:text-icon-disabled",
          // A linha entre o botão e o número, e o canto do lado de fora, o mesmo da caixa.
          direction < 0
            ? "rounded-l-[inherit] border-r border-subtle"
            : "rounded-r-[inherit] border-l border-subtle",
        )}
      >
        {direction < 0 ? <IconMinus aria-hidden /> : <IconPlus aria-hidden />}
      </button>
    );
  }

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <FieldLabel htmlFor={inputId} info={labelInfo} disabled={disabled}>
          {label}
        </FieldLabel>
      ) : null}
      <div
        // A caixa do Input, sem o respiro dos lados: os botões vão até a borda. Ícones de 16px.
        // Do tamanho do conteúdo, não da largura toda: um número pequeno num campo largo fica
        // perdido no meio.
        className={cn(inputVariants({ size }), "w-fit gap-0 px-0 [&_svg]:size-4")}
        data-invalid={invalid || undefined}
        data-disabled={disabled || undefined}
        data-readonly={readOnly || undefined}
      >
        {stepButton(-1)}
        <input
          id={inputId}
          type="text"
          // Teclado numérico no celular, com vírgula.
          inputMode="decimal"
          role="spinbutton"
          aria-valuenow={current ?? undefined}
          aria-valuemin={min}
          aria-valuemax={max}
          autoComplete="off"
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={invalid || undefined}
          aria-describedby={
            [describedBy, descriptionId, errorId].filter(Boolean).join(" ") || undefined
          }
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={(event) => {
            commit(parse(draft));
            onBlur?.(event);
          }}
          onKeyDown={handleKeyDown}
          className={cn(
            // 64px para o número: cabem uns 5 dígitos. Com os botões, o campo tem 126px (sm) e
            // 142px (md).
            "h-full w-16 bg-transparent px-3 text-center tabular-nums outline-none",
            "placeholder:text-placeholder disabled:cursor-not-allowed",
            readOnly && "cursor-default",
          )}
          {...props}
        />
        {stepButton(1)}
        {/* O formulário recebe o número com ponto, não o texto da tela. */}
        {name ? <input type="hidden" name={name} value={current ?? ""} /> : null}
      </div>
      {showDescription ? <FieldHelp id={descriptionId}>{description}</FieldHelp> : null}
      {error ? <FieldError id={errorId}>{error}</FieldError> : null}
    </div>
  );
}
