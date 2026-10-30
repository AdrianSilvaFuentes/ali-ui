import {
  Content,
  Group,
  Icon,
  Item,
  ItemIndicator,
  ItemText,
  Label,
  Portal,
  Root,
  ScrollDownButton,
  ScrollUpButton,
  Separator,
  Trigger,
  Value,
  Viewport,
} from "@radix-ui/react-select";
import { IconCheck, IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import type { VariantProps } from "class-variance-authority";
import { type ComponentProps, createContext, type ReactNode, useContext, useId } from "react";
import { inputVariants } from "../input/Input.tsx";
import { cn } from "../lib/cn.ts";
import { FieldLabel } from "../lib/FieldLabel.tsx";
import { FieldError, FieldHelp } from "../lib/FieldMessage.tsx";

/** O Select avisa as opções do tamanho dele, para a altura das linhas acompanhar o gatilho. */
const SelectSizeContext = createContext<"sm" | "md">("md");

export interface SelectProps
  extends Omit<ComponentProps<typeof Root>, "children" | "dir">,
    VariantProps<typeof inputVariants> {
  /** Nome do campo, ligado ao gatilho. Sem label, passe um `aria-label`. */
  label?: ReactNode;
  /** Ajuda extra num ícone de info no fim do label, que abre um Toggletip. Precisa de `label`. */
  labelInfo?: ReactNode;
  /** Texto do gatilho enquanto nada foi escolhido. Não substitui o label. */
  placeholder?: ReactNode;
  /** Texto de ajuda abaixo do campo, lido pelo leitor de tela junto com o label. */
  description?: ReactNode;
  /** Mensagem de erro. Substitui a ajuda e aparece com ícone, não só em vermelho. */
  error?: ReactNode;
  /** As opções: um `SelectItem` para cada. */
  children: ReactNode;
  /** Nome para o leitor de tela quando não há label visível. */
  "aria-label"?: string;
  id?: string;
  /** Classes do bloco inteiro (label, campo e mensagens), por exemplo a largura. */
  className?: string;
}

/**
 * Campo de escolha numa lista. O gatilho é a caixa do Input, com a mesma altura, borda, foco e
 * estados, mais uma seta que vira ao abrir. Pelo teclado: Enter, Espaço ou as setas abrem; as
 * setas andam pela lista; digitar uma letra pula para a opção que começa com ela; Esc fecha.
 */
export function Select({
  className,
  size,
  label,
  labelInfo,
  placeholder,
  description,
  error,
  children,
  disabled,
  id,
  "aria-label": ariaLabel,
  ...props
}: SelectProps) {
  const autoId = useId();
  const triggerId = id ?? autoId;
  // Com erro, a mensagem de erro substitui a ajuda, na tela e no leitor de tela.
  const showDescription = Boolean(description) && !error;
  const descriptionId = showDescription ? `${triggerId}-description` : undefined;
  const errorId = error ? `${triggerId}-error` : undefined;
  const invalid = Boolean(error);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <FieldLabel htmlFor={triggerId} info={labelInfo} disabled={disabled}>
          {label}
        </FieldLabel>
      ) : null}
      <Root disabled={disabled} {...props}>
        <Trigger
          id={triggerId}
          aria-label={ariaLabel}
          aria-invalid={invalid || undefined}
          aria-describedby={[descriptionId, errorId].filter(Boolean).join(" ") || undefined}
          data-invalid={invalid || undefined}
          className={cn(
            inputVariants({ size }),
            // Um botão, e não um campo de texto: cursor de clique e texto à esquerda.
            "cursor-pointer text-left data-disabled:cursor-not-allowed",
            // 10px nas laterais, como no MultiSelect: o texto alinha com o das opções (pl-2.5).
            "px-2.5",
            "data-placeholder:text-placeholder",
          )}
        >
          {/*
           * data-slot avisa as opções que estão no gatilho: lá o ícone (leading) aparece. O
           * truncate corta o que passa da linha (para as reticências). O py-1, e o pl-1 com a
           * margem negativa do mesmo tamanho, dão espaço para o contorno e a sombra de um avatar
           * não serem cortados, sem tirar nada do lugar.
           */}
          <span
            data-slot="select-value"
            className="-ml-1 flex min-w-0 flex-1 items-center truncate py-1 pl-1"
          >
            {/* Bloco flexível, e não linha de texto: ícone e nome centrados entre si, sem
                depender da base das letras (que mudava com a fonte e a altura de linha). */}
            <Value placeholder={placeholder} className="flex min-w-0 items-center" />
          </span>
          <Icon asChild>
            {/* A seta vira para cima com a lista aberta, como quem diz "fechar". */}
            <IconChevronDown
              aria-hidden="true"
              className={cn(
                "text-icon-subtle transition-transform duration-fast",
                "group-data-[state=open]:rotate-180 group-data-disabled:text-icon-disabled",
                "motion-reduce:transition-none",
              )}
            />
          </Icon>
        </Trigger>
        <Portal>
          {/*
           * A lista abre logo abaixo do gatilho (popper), com pelo menos a largura dele, e no
           * máximo a altura que cabe na tela. Fundo surface, e não surface-overlay: no escuro,
           * a lista fica no tom base da página, e quem a destaca é o contorno e a sombra de menus.
           */}
          <Content
            position="popper"
            className={cn(
              "z-50 min-w-[var(--radix-select-trigger-width)]",
              "max-h-[var(--radix-select-content-available-height)] overflow-hidden",
              // Canto da lista: 8px no sm, 12px no md.
              size === "sm" ? "rounded-lg" : "rounded-xl",
              "bg-surface p-1 ring-1 ring-subtle shadow-overlay",
              "inset-shadow-highlight animate-enter-exit",
              "data-[side=bottom]:mt-1 data-[side=top]:mb-1",
            )}
          >
            <ScrollUpButton className="flex h-6 items-center justify-center text-icon-subtle">
              <IconChevronUp aria-hidden="true" className="size-4" />
            </ScrollUpButton>
            {/* 2px entre as opções, como no MultiSelect: duas linhas em destaque seguidas não
                viram um bloco só. */}
            <Viewport className="flex flex-col gap-0.5">
              <SelectSizeContext.Provider value={size ?? "md"}>
                {children}
              </SelectSizeContext.Provider>
            </Viewport>
            <ScrollDownButton className="flex h-6 items-center justify-center text-icon-subtle">
              <IconChevronDown aria-hidden="true" className="size-4" />
            </ScrollDownButton>
          </Content>
        </Portal>
      </Root>
      {showDescription ? <FieldHelp id={descriptionId}>{description}</FieldHelp> : null}
      {error ? <FieldError id={errorId}>{error}</FieldError> : null}
    </div>
  );
}

export interface SelectItemProps extends Omit<ComponentProps<typeof Item>, "asChild" | "children"> {
  /** O nome da opção. É o que aparece no gatilho depois de escolhida. */
  children: ReactNode;
  /** Ícone ou avatar à esquerda. Também aparece no gatilho quando a opção é escolhida. */
  leading?: ReactNode;
  /** Uma segunda linha, em cinza, só na lista: um email, um telefone, um detalhe. */
  description?: ReactNode;
  /** Algo pequeno à direita, antes do check, como uma tag de status. Só na lista. */
  trailing?: ReactNode;
}

/**
 * Uma opção do Select. Pode ter ícone ou avatar à esquerda, uma segunda linha e uma tag à
 * direita. A escolhida ganha um check. Nada dentro dela pode ser clicável: a opção inteira é
 * um item só para o leitor de tela, e o clique nela já escolhe.
 */
export function SelectItem({
  className,
  children,
  leading,
  description,
  trailing,
  textValue,
  ...props
}: SelectItemProps) {
  // Ícones e avatares ficam na primeira linha, numa caixa de uma linha de altura (1lh).
  const firstLine = "flex h-[1lh] shrink-0 items-center";
  // O ícone da opção tem 20px, na lista e no gatilho, nos dois tamanhos: não muda ao ser
  // escolhido. O data-slot dá peso extra à regra, para vencer os 16px dos outros ícones
  // (check e, no gatilho sm, a regra da caixa do Input).
  const leadingSize = "data-[slot=select-leading]:[&_svg]:size-5";
  const compact = useContext(SelectSizeContext) === "sm";
  // Uma linha só: tudo centrado. Com segunda linha: tudo alinhado ao topo, para ícone, tag e
  // check acompanharem a primeira linha.
  const oneLine = !description;

  return (
    <Item
      // Para digitar e pular até a opção, só o nome conta (sem as iniciais de um avatar).
      textValue={textValue ?? (typeof children === "string" ? children : undefined)}
      className={cn(
        "group/item relative flex cursor-pointer gap-2 select-none",
        // 10px nas laterais e espaço à direita para o check de 20px, nos dois tamanhos.
        // sm: 6px em cima e embaixo e canto de 6px. md: canto de 8px.
        "pr-9 pl-2.5",
        compact ? "rounded-md" : "rounded-lg",
        oneLine ? "items-center" : "items-start",
        compact ? "py-1.5" : "py-2",
        // sm de uma linha travado em 32px, a altura do campo, mesmo com os 6px de padding.
        compact && oneLine && "h-8",
        "text-body-md text-default outline-none",
        // Destaque (mouse ou setas) em neutral-hovered, como o hover do Button secondary.
        // A escolhida fica em bg-selected, um tom de hover na cor da marca, e continua assim
        // mesmo em destaque (duas condições pesam mais que uma).
        "data-highlighted:bg-neutral-hovered",
        "data-[state=checked]:bg-selected data-highlighted:data-[state=checked]:bg-selected",
        "data-disabled:cursor-not-allowed data-disabled:text-disabled",
        "[&_svg]:size-4",
        className,
      )}
      {...props}
    >
      {leading ? (
        <span
          aria-hidden="true"
          data-slot="select-leading"
          className={cn(
            firstLine,
            leadingSize,
            "text-icon-subtle group-data-disabled/item:text-icon-disabled",
          )}
        >
          {leading}
        </span>
      ) : null}
      <span className="flex min-w-0 flex-1 flex-col">
        {/*
         * O ItemText é o que o Radix copia para o gatilho. O ícone vai junto, mas escondido na
         * lista (já aparece à esquerda) e visível só dentro do gatilho (data-slot).
         */}
        <ItemText>
          <span className="flex min-w-0 items-center gap-2">
            {leading ? (
              <span
                aria-hidden="true"
                data-slot="select-leading"
                className={cn(
                  "hidden shrink-0 text-icon-subtle in-data-[slot=select-value]:inline-flex",
                  leadingSize,
                )}
              >
                {leading}
              </span>
            ) : null}
            <span className="truncate">{children}</span>
          </span>
        </ItemText>
        {/* Desabilitada, a opção inteira fica em cinza: o nome, a segunda linha e o ícone. */}
        {description ? (
          // body-sm: na lista, a segunda linha é um detalhe da opção, menor que o nome.
          <span className="text-body-sm text-subtle group-data-disabled/item:text-disabled">
            {description}
          </span>
        ) : null}
      </span>
      {trailing ? <span className={firstLine}>{trailing}</span> : null}
      {/* O check fica no meio da linha, ou na primeira linha quando há uma segunda. */}
      <ItemIndicator
        className={cn(
          "absolute right-2.5 flex items-center",
          oneLine ? "inset-y-0" : ["h-[1lh]", compact ? "top-1.5" : "top-2"],
        )}
      >
        {/* 20px nos dois tamanhos: o tamanho dos ícones do campo (como a seta). */}
        <IconCheck
          aria-hidden="true"
          data-slot="select-check"
          // O data-slot dá peso extra, para vencer a regra de 16px dos ícones do item.
          className="text-icon-primary data-[slot=select-check]:size-5"
        />
      </ItemIndicator>
    </Item>
  );
}

export interface SelectGroupProps extends Omit<ComponentProps<typeof Group>, "asChild"> {
  /** O título da seção, em cinza, acima das opções dela. */
  label: ReactNode;
  children: ReactNode;
}

/** Uma seção da lista, com título. O leitor de tela anuncia o título junto das opções. */
export function SelectGroup({ label, children, className, ...props }: SelectGroupProps) {
  return (
    <Group className={cn("flex flex-col gap-0.5", className)} {...props}>
      <Label className="px-3 pt-2 pb-1 text-label-md text-subtle">{label}</Label>
      {children}
    </Group>
  );
}

/** Linha fina entre seções da lista. */
export function SelectSeparator({ className }: { className?: string }) {
  return <Separator className={cn("mx-2 my-1 border-t border-subtle", className)} />;
}
