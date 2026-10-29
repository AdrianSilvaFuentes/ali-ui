import { Indicator, Item, Root } from "@radix-ui/react-radio-group";
import { IconAlertCircle } from "@tabler/icons-react";
import { cva } from "class-variance-authority";
import { type ComponentProps, createContext, type ReactNode, useContext, useId } from "react";
import { choiceBase, choiceDisabled, choiceEnabled } from "../lib/choice.ts";
import { cn } from "../lib/cn.ts";
import { FieldLabel } from "../lib/FieldLabel.tsx";

/**
 * A bolinha de cada opção, de 16px, redonda. Borda, foco, camada verde e desabilitado vêm de
 * `lib/choice.ts`, iguais aos do Checkbox. Com erro no grupo, a borda fica vermelha.
 */
export const radioVariants = cva([
  ...choiceBase,
  "rounded-full group-data-invalid/radios:border-danger",
]);

/** O grupo avisa as opções se está todo desabilitado. */
const RadioGroupContext = createContext({ disabled: false });

export interface RadioGroupProps extends Omit<ComponentProps<typeof Root>, "asChild" | "dir"> {
  /** O título do grupo, que nomeia as opções juntas. Sem ele, passe um `aria-label`. */
  label?: ReactNode;
  /** Ajuda extra num ícone de info no fim do título, que abre um Toggletip. */
  labelInfo?: ReactNode;
  /** Texto de ajuda abaixo das opções, lido pelo leitor de tela junto com o grupo. */
  description?: ReactNode;
  /** Mensagem de erro. Substitui a ajuda, aparece com ícone e deixa as bolinhas em vermelho. */
  error?: ReactNode;
  /** As opções: um `RadioGroupItem` para cada. */
  children: ReactNode;
  /** Classes do bloco inteiro (título, opções e mensagens). */
  className?: string;
}

/**
 * Grupo de opções em que só uma pode ser escolhida. Pelo teclado, o Tab entra no grupo (na
 * opção marcada) e as setas trocam a opção.
 */
export function RadioGroup({
  className,
  label,
  labelInfo,
  description,
  error,
  children,
  disabled = false,
  orientation = "vertical",
  "aria-describedby": describedBy,
  ...props
}: RadioGroupProps) {
  const id = useId();
  const labelId = label ? `${id}-label` : undefined;
  // Com erro, a mensagem de erro substitui a ajuda, na tela e no leitor de tela.
  const showDescription = Boolean(description) && !error;
  const descriptionId = showDescription ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const invalid = Boolean(error);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label ? (
        <FieldLabel id={labelId} info={labelInfo} disabled={disabled}>
          {label}
        </FieldLabel>
      ) : null}
      <Root
        aria-labelledby={labelId}
        aria-describedby={
          [describedBy, descriptionId, errorId].filter(Boolean).join(" ") || undefined
        }
        aria-invalid={invalid || undefined}
        data-invalid={invalid || undefined}
        disabled={disabled}
        orientation={orientation}
        className={cn(
          "group/radios flex",
          orientation === "horizontal" ? "flex-row flex-wrap gap-x-6 gap-y-3" : "flex-col gap-3",
        )}
        {...props}
      >
        <RadioGroupContext.Provider value={{ disabled }}>{children}</RadioGroupContext.Provider>
      </Root>
      {showDescription ? (
        <p id={descriptionId} className="text-body-md text-subtle">
          {description}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="flex items-center gap-1.5 text-body-md text-danger">
          <IconAlertCircle aria-hidden="true" className="size-4 shrink-0 text-icon-danger" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

export interface RadioGroupItemProps
  extends Omit<ComponentProps<typeof Item>, "asChild" | "children"> {
  /** O texto da opção. Clicar nele também escolhe. */
  label: ReactNode;
  /** Ajuda extra num ícone de info no fim do label, que abre um Toggletip. */
  labelInfo?: ReactNode;
  /** Texto de ajuda abaixo do label da opção. */
  description?: ReactNode;
  /** Classes do bloco da opção. */
  className?: string;
}

/** Uma opção do RadioGroup. Ao ser escolhida, o ponto branco cresce do centro. */
export function RadioGroupItem({
  className,
  label,
  labelInfo,
  description,
  id,
  disabled: itemDisabled,
  ...props
}: RadioGroupItemProps) {
  const group = useContext(RadioGroupContext);
  const disabled = group.disabled || Boolean(itemDisabled);
  const autoId = useId();
  const itemId = id ?? autoId;
  const descriptionId = description ? `${itemId}-description` : undefined;

  return (
    // 2px entre label e ajuda, como no Checkbox: a ajuda fica junto da opção.
    <div className={cn("flex flex-col gap-0.5", className)}>
      {/* O estilo do label fica na linha toda, para o 1lh abaixo ser a altura da linha dele. */}
      <div className="flex items-start gap-2 text-label-md">
        {/* Uma linha de texto de altura (1lh): a bolinha fica centrada na primeira linha. */}
        <span className="flex h-[1lh] items-center">
          <Item
            id={itemId}
            disabled={itemDisabled}
            aria-describedby={descriptionId}
            className={cn(radioVariants(), disabled ? choiceDisabled : choiceEnabled)}
            {...props}
          >
            {/* O ponto cresce ao marcar e some num fade quando outra opção é escolhida. */}
            <Indicator className="flex items-center justify-center data-[state=checked]:animate-scale-in data-[state=unchecked]:animate-fade-out">
              <span className="size-1.5 rounded-full bg-current" />
            </Indicator>
          </Item>
        </span>
        <FieldLabel
          htmlFor={itemId}
          info={labelInfo}
          disabled={disabled}
          className={cn(!disabled && "cursor-pointer")}
        >
          {label}
        </FieldLabel>
      </div>
      {description ? (
        // O recuo de 24px (bolinha de 16px mais o espaço) alinha a ajuda com o texto do label.
        <p id={descriptionId} className="pl-6 text-body-md text-subtle">
          {description}
        </p>
      ) : null}
    </div>
  );
}
