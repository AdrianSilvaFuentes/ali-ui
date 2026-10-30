import { Anchor, Content, Portal, Root, Trigger } from "@radix-ui/react-popover";
import { IconCheck, IconChevronDown, IconSearch } from "@tabler/icons-react";
import type { VariantProps } from "class-variance-authority";
import {
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { Input, inputVariants } from "../input/Input.tsx";
import { cn } from "../lib/cn.ts";
import { FieldLabel } from "../lib/FieldLabel.tsx";
import { FieldError, FieldHelp } from "../lib/FieldMessage.tsx";
import { Tag } from "../tag/Tag.tsx";

export interface MultiSelectOption {
  /** O valor guardado na escolha. Único na lista. */
  value: string;
  /** O nome da opção, na lista e na tag. */
  label: string;
  /** Aparece na lista, mas não pode ser escolhida. */
  disabled?: boolean;
}

export interface MultiSelectProps extends VariantProps<typeof inputVariants> {
  /** As opções da lista. */
  options: MultiSelectOption[];
  /** Os valores escolhidos (controlado). Use com `onValueChange`. */
  value?: string[];
  /** Os valores escolhidos no começo (sem controlar). */
  defaultValue?: string[];
  /** Chamado a cada escolha ou remoção, com todos os valores escolhidos. */
  onValueChange?: (value: string[]) => void;
  /** Nome do campo. Sem label, passe um `aria-label`. */
  label?: ReactNode;
  /** Ajuda extra num ícone de info no fim do label, que abre um Toggletip. Precisa de `label`. */
  labelInfo?: ReactNode;
  /** Texto do campo enquanto nada foi escolhido. Não substitui o label. */
  placeholder?: ReactNode;
  /** Texto do campo de busca, dentro da lista. */
  searchPlaceholder?: string;
  /** Mensagem quando a busca não encontra nada. */
  emptyMessage?: ReactNode;
  /** Texto de ajuda abaixo do campo, lido pelo leitor de tela junto com o label. */
  description?: ReactNode;
  /** Mensagem de erro. Substitui a ajuda e aparece com ícone, não só em vermelho. */
  error?: ReactNode;
  disabled?: boolean;
  /** Nome para o leitor de tela quando não há label visível. */
  "aria-label"?: string;
  id?: string;
  /** Classes do bloco inteiro (label, campo e mensagens), por exemplo a largura. */
  className?: string;
}

/** Busca sem diferença de maiúsculas e acentos: "edicao" encontra "Edição". */
function normalize(text: string) {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

/**
 * Campo de escolha de várias opções. As escolhidas viram tags dentro do campo, cada uma com um
 * X para remover. Ao abrir, a lista traz uma busca no topo e marca as escolhidas com um check.
 * Pelo teclado: Enter, Espaço ou seta para baixo abrem; digitar filtra; as setas andam pela
 * lista; Enter escolhe ou tira a opção; Esc ou Tab fecham.
 */
export function MultiSelect({
  options,
  value: valueProp,
  defaultValue = [],
  onValueChange,
  size,
  label,
  labelInfo,
  placeholder,
  searchPlaceholder = "Buscar opção",
  emptyMessage = "Nenhuma opção encontrada",
  description,
  error,
  disabled,
  id,
  "aria-label": ariaLabel,
  className,
}: MultiSelectProps) {
  const autoId = useId();
  const triggerId = id ?? autoId;
  const labelId = `${triggerId}-label`;
  const summaryId = `${triggerId}-summary`;
  const listboxId = `${triggerId}-listbox`;
  // Com erro, a mensagem de erro substitui a ajuda, na tela e no leitor de tela.
  const showDescription = Boolean(description) && !error;
  const descriptionId = showDescription ? `${triggerId}-description` : undefined;
  const errorId = error ? `${triggerId}-error` : undefined;
  const invalid = Boolean(error);
  const compact = size === "sm";

  const [innerValue, setInnerValue] = useState(defaultValue);
  const selected = valueProp ?? innerValue;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState<string | null>(null);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const tagsRef = useRef<HTMLUListElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  // Depois de remover uma tag, o foco vai para o X da próxima, ou para o campo.
  const focusAfterRemove = useRef<number | null>(null);

  const selectedOptions = selected
    .map((v) => options.find((option) => option.value === v))
    .filter((option): option is MultiSelectOption => Boolean(option));

  const visible = useMemo(() => {
    const term = normalize(query.trim());
    return term ? options.filter((option) => normalize(option.label).includes(term)) : options;
  }, [options, query]);
  const enabled = visible.filter((option) => !option.disabled);

  const setValue = (next: string[]) => {
    if (valueProp === undefined) setInnerValue(next);
    onValueChange?.(next);
  };

  const toggle = (option: MultiSelectOption) => {
    if (option.disabled) return;
    setValue(
      selected.includes(option.value)
        ? selected.filter((v) => v !== option.value)
        : [...selected, option.value],
    );
  };

  const remove = (index: number) => {
    focusAfterRemove.current = index;
    setValue(selected.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const index = focusAfterRemove.current;
    if (index === null) return;
    focusAfterRemove.current = null;
    const buttons = tagsRef.current?.querySelectorAll("button");
    (buttons?.[index] ?? triggerRef.current)?.focus();
  });

  const changeOpen = (next: boolean) => {
    if (disabled) return;
    setOpen(next);
    if (next) {
      // Começa na primeira escolhida, ou na primeira que pode ser escolhida.
      const start =
        options.find((option) => !option.disabled && selected.includes(option.value)) ??
        options.find((option) => !option.disabled);
      setHighlighted(start?.value ?? null);
    } else {
      setQuery("");
    }
  };

  // A opção em destaque sempre à vista, ao andar com as setas numa lista que rola.
  useEffect(() => {
    if (!open || !highlighted) return;
    document.getElementById(`${listboxId}-${highlighted}`)?.scrollIntoView({ block: "nearest" });
  }, [open, highlighted, listboxId]);

  const handleSearchChange = (text: string) => {
    setQuery(text);
    const term = normalize(text.trim());
    const first = options.find(
      (option) => !option.disabled && (!term || normalize(option.label).includes(term)),
    );
    setHighlighted(first?.value ?? null);
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const index = enabled.findIndex((option) => option.value === highlighted);
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (enabled.length === 0) return;
      const step = event.key === "ArrowDown" ? 1 : -1;
      const next = index === -1 ? 0 : (index + step + enabled.length) % enabled.length;
      setHighlighted(enabled[next]?.value ?? null);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const option = enabled[index];
      if (option) toggle(option);
    } else if (event.key === "Tab") {
      // A lista fica num portal, no fim da página: o Tab sairia para lá. Fecha e o foco
      // volta para o campo.
      event.preventDefault();
      changeOpen(false);
    }
  };

  /**
   * Clique no respiro do campo (fora das tags e da seta) abre ou fecha a lista. Só para o
   * mouse: pelo teclado o foco vai direto no botão da seta.
   */
  const handleFieldMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (disabled || (event.target as Element).closest("button")) return;
    event.preventDefault();
    changeOpen(!open);
  };

  const summary = selectedOptions.map((option) => option.label).join(", ");

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <FieldLabel id={labelId} info={labelInfo} disabled={disabled}>
          {label}
        </FieldLabel>
      ) : null}
      <Root open={open} onOpenChange={changeOpen}>
        <Anchor asChild>
          {/* biome-ignore lint/a11y/noStaticElementInteractions: atalho só do mouse; o teclado usa o botão da seta. */}
          <div
            ref={fieldRef}
            onMouseDown={handleFieldMouseDown}
            data-state={open ? "open" : "closed"}
            data-invalid={invalid || undefined}
            data-disabled={disabled || undefined}
            className={cn(
              inputVariants({ size }),
              // A caixa do Input, mas cresce quando as tags quebram de linha. Com tags, o
              // respiro da esquerda fica perto do de cima, para a tag não parecer solta.
              "h-auto cursor-pointer data-[state=open]:border-default",
              compact ? "min-h-8 py-1" : "min-h-10 py-1.5",
              selectedOptions.length > 0 && (compact ? "pl-1" : "pl-1.5"),
            )}
          >
            {selectedOptions.length > 0 ? (
              <ul ref={tagsRef} className="flex min-w-0 flex-1 flex-wrap gap-1">
                {selectedOptions.map((option, index) => (
                  <li key={option.value} className="flex">
                    <Tag
                      size={compact ? "sm" : "md"}
                      onRemove={disabled ? undefined : () => remove(index)}
                    >
                      {option.label}
                    </Tag>
                  </li>
                ))}
              </ul>
            ) : (
              <span className="min-w-0 flex-1 truncate text-placeholder group-data-disabled:text-disabled">
                {placeholder}
              </span>
            )}
            <Trigger
              ref={triggerRef}
              id={triggerId}
              disabled={disabled}
              // O nome é o label mais o que está escolhido: "Ferramentas, Figma, Sketch".
              aria-labelledby={label ? `${labelId} ${summaryId}` : undefined}
              aria-label={label ? undefined : ariaLabel}
              aria-invalid={invalid || undefined}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  changeOpen(true);
                }
              }}
              aria-describedby={[descriptionId, errorId].filter(Boolean).join(" ") || undefined}
              className={cn(
                "-my-1 inline-flex shrink-0 cursor-pointer items-center rounded-md p-1 outline-none",
                "disabled:cursor-not-allowed",
              )}
            >
              <span id={summaryId} className="sr-only">
                {summary || "Nenhuma opção escolhida"}
              </span>
              {/* A seta vira para cima com a lista aberta, como no Select. */}
              <IconChevronDown
                aria-hidden="true"
                className={cn(
                  "text-icon-subtle transition-transform duration-fast",
                  "group-data-[state=open]:rotate-180 group-data-disabled:text-icon-disabled",
                  "motion-reduce:transition-none",
                )}
              />
            </Trigger>
          </div>
        </Anchor>
        <Portal>
          {/*
           * Mesmo balão do Select: abre abaixo do campo, com a largura dele e no máximo a
           * altura que cabe na tela. O foco vai para a busca; as setas mudam a opção em
           * destaque sem tirar o foco dela (aria-activedescendant).
           */}
          <Content
            align="start"
            sideOffset={4}
            aria-labelledby={label ? labelId : undefined}
            aria-label={label ? undefined : ariaLabel}
            onOpenAutoFocus={(event) => {
              event.preventDefault();
              searchRef.current?.focus();
            }}
            // O clique no próprio campo já abre e fecha: não conta como clique fora.
            onInteractOutside={(event) => {
              if (fieldRef.current?.contains(event.target as Node)) event.preventDefault();
            }}
            className={cn(
              "z-50 flex w-[var(--radix-popover-trigger-width)] flex-col gap-1",
              "max-h-[var(--radix-popover-content-available-height)]",
              compact ? "rounded-lg" : "rounded-xl",
              "bg-surface p-1 ring-1 ring-subtle shadow-overlay outline-none",
              "inset-shadow-highlight animate-enter-exit",
            )}
          >
            <Input
              ref={searchRef}
              size={size}
              aria-label={searchPlaceholder}
              placeholder={searchPlaceholder}
              iconLeft={<IconSearch />}
              value={query}
              onChange={(event) => handleSearchChange(event.target.value)}
              onKeyDown={handleSearchKeyDown}
              role="combobox"
              aria-expanded="true"
              aria-controls={listboxId}
              aria-autocomplete="list"
              aria-activedescendant={highlighted ? `${listboxId}-${highlighted}` : undefined}
              autoComplete="off"
            />
            {visible.length === 0 ? (
              <p role="status" className="px-2.5 py-2 text-body-md text-subtle">
                {emptyMessage}
              </p>
            ) : null}
            <div
              id={listboxId}
              role="listbox"
              aria-multiselectable="true"
              aria-labelledby={label ? labelId : undefined}
              aria-label={label ? undefined : ariaLabel}
              className="flex min-h-0 flex-col gap-1 overflow-y-auto"
            >
              {visible.map((option) => {
                const isSelected = selected.includes(option.value);
                return (
                  // biome-ignore lint/a11y/useKeyWithClickEvents: o teclado fica na busca (aria-activedescendant).
                  <div
                    key={option.value}
                    id={`${listboxId}-${option.value}`}
                    role="option"
                    tabIndex={-1}
                    aria-selected={isSelected}
                    aria-disabled={option.disabled || undefined}
                    data-highlighted={highlighted === option.value || undefined}
                    data-disabled={option.disabled || undefined}
                    // O mouse não tira o foco da busca.
                    onMouseDown={(event) => event.preventDefault()}
                    onMouseMove={() => !option.disabled && setHighlighted(option.value)}
                    onClick={() => toggle(option)}
                    className={cn(
                      // Mesmas medidas e estados das opções do Select.
                      "relative flex cursor-pointer items-center gap-2 pr-9 pl-2.5 select-none",
                      compact ? "h-8 rounded-md py-1.5" : "rounded-lg py-2",
                      "data-highlighted:bg-neutral-hovered",
                      isSelected && "bg-selected data-highlighted:bg-selected",
                      "data-disabled:cursor-not-allowed",
                    )}
                  >
                    {/* Desabilitada, a tag fica com o texto em cinza. */}
                    <Tag
                      size={compact ? "sm" : "md"}
                      className={cn(option.disabled && "text-disabled")}
                    >
                      {option.label}
                    </Tag>
                    {isSelected ? (
                      <IconCheck
                        aria-hidden="true"
                        className="absolute right-2.5 size-5 text-icon-primary"
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>
          </Content>
        </Portal>
      </Root>
      {showDescription ? <FieldHelp id={descriptionId}>{description}</FieldHelp> : null}
      {error ? <FieldError id={errorId}>{error}</FieldError> : null}
    </div>
  );
}
