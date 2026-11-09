import { Anchor, Content, Portal, Root } from "@radix-ui/react-popover";
import { IconCheck, IconChevronDown } from "@tabler/icons-react";
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
import { inputVariants } from "../input/Input.tsx";
import { cn } from "../lib/cn.ts";
import { FieldLabel } from "../lib/FieldLabel.tsx";
import { FieldError, FieldHelp } from "../lib/FieldMessage.tsx";
import { normalize } from "../lib/normalize.ts";

export interface ComboboxOption {
  /** O que o formulário envia. */
  value: string;
  /** O nome na lista e no campo. A busca procura nele. */
  label: string;
  /** Segunda linha da opção, menor, em cinza. */
  description?: ReactNode;
  /** Ícone de 20px antes do nome, só na lista. */
  icon?: ReactNode;
  disabled?: boolean;
}

export interface ComboboxProps extends VariantProps<typeof inputVariants> {
  /** As opções da lista. */
  options: ComboboxOption[];
  /** A opção escolhida, controlada por fora. `null` é nenhuma. */
  value?: string | null;
  /** A opção escolhida ao abrir, sem controlar o estado. */
  defaultValue?: string | null;
  /** Avisa a nova escolha (ou `null`, quando a pessoa apaga o texto e sai do campo). */
  onValueChange?: (value: string | null) => void;
  /** Nome do campo, ligado ao input. Sem label, passe um `aria-label`. */
  label?: ReactNode;
  /** Ajuda extra num ícone de info no fim do label, que abre um Toggletip. Precisa de `label`. */
  labelInfo?: ReactNode;
  /** Texto do campo vazio, como "Busque um país". */
  placeholder?: string;
  /** O aviso quando a busca não encontra nada. */
  emptyMessage?: ReactNode;
  /** Texto de ajuda abaixo do campo, lido pelo leitor de tela junto com o label. */
  description?: ReactNode;
  /** Mensagem de erro. Marca o campo como inválido e aparece com ícone, não só em vermelho. */
  error?: ReactNode;
  disabled?: boolean;
  /** Nome no formulário: envia o `value` da opção escolhida. */
  name?: string;
  id?: string;
  "aria-label"?: string;
  /** Classes do bloco inteiro (label, campo e mensagens), por exemplo a largura. */
  className?: string;
}

/**
 * Campo de texto com uma lista embaixo: digitar filtra, e a pessoa escolhe uma opção. Para
 * listas longas (países, cidades, pessoas); com até umas 15 opções, use o Select. Só vale o
 * que está na lista: ao sair do campo sem escolher, o texto volta para a opção escolhida.
 * Pelo teclado: digitar ou a seta para baixo abrem; as setas andam pela lista; Enter escolhe;
 * Esc fecha e desfaz a busca.
 */
export function Combobox({
  options,
  value: valueProp,
  defaultValue = null,
  onValueChange,
  size,
  label,
  labelInfo,
  placeholder,
  emptyMessage = "Nenhuma opção encontrada",
  description,
  error,
  disabled,
  name,
  id,
  "aria-label": ariaLabel,
  className,
}: ComboboxProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const listboxId = `${inputId}-listbox`;
  // Com erro, a mensagem de erro substitui a ajuda, na tela e no leitor de tela.
  const showDescription = Boolean(description) && !error;
  const descriptionId = showDescription ? `${inputId}-description` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const invalid = Boolean(error);
  const compact = size === "sm";

  const [ownValue, setOwnValue] = useState(defaultValue);
  const selected = valueProp === undefined ? ownValue : valueProp;
  const selectedOption = options.find((option) => option.value === selected) ?? null;

  const [open, setOpen] = useState(false);
  // O texto digitado. `null` é sem busca: o campo mostra o nome da escolhida.
  const [query, setQuery] = useState<string | null>(null);
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);

  const visible = useMemo(() => {
    const term = normalize(query?.trim() ?? "");
    return term ? options.filter((option) => normalize(option.label).includes(term)) : options;
  }, [options, query]);
  const enabled = visible.filter((option) => !option.disabled);
  const optionId = (value: string) => `${listboxId}-${options.findIndex((o) => o.value === value)}`;

  const setValue = (next: string | null) => {
    if (valueProp === undefined) setOwnValue(next);
    if (next !== selected) onValueChange?.(next);
  };

  /** Abre a lista inteira, com a escolhida em destaque (ou a primeira). */
  const openList = () => {
    if (disabled || open) return;
    setOpen(true);
    const start = enabled.find((option) => option.value === selected) ?? enabled[0];
    setHighlighted(start?.value ?? null);
  };

  /** Fecha e desfaz a busca: o campo volta a mostrar a escolhida. */
  const close = () => {
    setOpen(false);
    setQuery(null);
  };

  const choose = (option: ComboboxOption) => {
    if (option.disabled) return;
    setValue(option.value);
    close();
  };

  // A opção em destaque sempre à vista, ao andar com as setas numa lista que rola.
  useEffect(() => {
    if (!open || !highlighted) return;
    document.getElementById(optionId(highlighted))?.scrollIntoView?.({ block: "nearest" });
  });

  const handleChange = (text: string) => {
    setQuery(text);
    setOpen(true);
    const term = normalize(text.trim());
    const first = options.find(
      (option) => !option.disabled && (!term || normalize(option.label).includes(term)),
    );
    setHighlighted(first?.value ?? null);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) return openList();
      if (enabled.length === 0) return;
      const index = enabled.findIndex((option) => option.value === highlighted);
      const step = event.key === "ArrowDown" ? 1 : -1;
      const next = index === -1 ? 0 : (index + step + enabled.length) % enabled.length;
      setHighlighted(enabled[next]?.value ?? null);
    } else if (event.key === "Enter" && open) {
      // Com a lista aberta, Enter escolhe (e não envia o formulário).
      event.preventDefault();
      const option = enabled.find((o) => o.value === highlighted);
      if (option) choose(option);
    } else if (event.key === "Escape" && (open || query !== null)) {
      event.preventDefault();
      close();
    }
  };

  /** Ao sair do campo: texto apagado limpa a escolha; qualquer outro volta para a escolhida. */
  const handleBlur = () => {
    if (query?.trim() === "") setValue(null);
    close();
  };

  /**
   * Clique na caixa (respiro ou seta) foca o campo e abre ou fecha a lista. Só o mouse.
   * O primeiro clique, de fora, seleciona o texto todo: o que a pessoa digitar substitui a
   * escolhida. Com o campo já em foco, o clique põe o cursor onde caiu, para corrigir uma letra.
   * Pelo Tab, o navegador já seleciona tudo.
   */
  const handleFieldMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    const input = inputRef.current;
    const focused = document.activeElement === input;
    if (event.target !== input || !focused) event.preventDefault();
    input?.focus();
    if (!focused) input?.select();
    if (open && event.target !== input) close();
    else openList();
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <FieldLabel htmlFor={inputId} id={`${inputId}-label`} info={labelInfo} disabled={disabled}>
          {label}
        </FieldLabel>
      ) : null}
      <Root open={open} onOpenChange={(next) => (next ? openList() : close())}>
        <Anchor asChild>
          {/* biome-ignore lint/a11y/noStaticElementInteractions: atalho só do mouse; o teclado usa o input. */}
          <div
            ref={fieldRef}
            onMouseDown={handleFieldMouseDown}
            data-state={open ? "open" : "closed"}
            data-invalid={invalid || undefined}
            data-disabled={disabled || undefined}
            // A caixa do Input, com 10px nas laterais como o Select: o texto alinha com o das
            // opções. Aberta, a borda fica em default, como no foco.
            className={cn(inputVariants({ size }), "px-2.5 data-[state=open]:border-default")}
          >
            <input
              ref={inputRef}
              id={inputId}
              type="text"
              role="combobox"
              aria-label={label ? undefined : ariaLabel}
              aria-expanded={open}
              aria-controls={listboxId}
              aria-autocomplete="list"
              aria-activedescendant={open && highlighted ? optionId(highlighted) : undefined}
              aria-invalid={invalid || undefined}
              aria-describedby={[descriptionId, errorId].filter(Boolean).join(" ") || undefined}
              autoComplete="off"
              disabled={disabled}
              placeholder={placeholder}
              value={query ?? selectedOption?.label ?? ""}
              onChange={(event) => handleChange(event.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              className={cn(
                "h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-placeholder",
                "disabled:cursor-not-allowed",
              )}
            />
            {/* A seta é só visual: o clique nela cai na caixa, que abre e fecha a lista. */}
            <IconChevronDown
              aria-hidden="true"
              className={cn(
                "cursor-pointer text-icon-subtle transition-transform duration-fast",
                "group-data-[state=open]:rotate-180 group-data-disabled:cursor-not-allowed",
                "group-data-disabled:text-icon-disabled motion-reduce:transition-none",
              )}
            />
          </div>
        </Anchor>
        <Portal>
          {/*
           * Mesmo balão do Select e do MultiSelect: abre abaixo do campo, com a largura dele e no
           * máximo a altura que cabe na tela, até 320px. O foco fica no campo; as setas mudam a
           * opção em destaque sem tirar o foco dele (aria-activedescendant).
           */}
          <Content
            align="start"
            sideOffset={4}
            // O balão é só a moldura da lista, não um diálogo: o leitor de tela ouve a lista
            // (role listbox), ligada ao campo.
            role="presentation"
            onOpenAutoFocus={(event) => event.preventDefault()}
            onCloseAutoFocus={(event) => event.preventDefault()}
            // Nenhum clique no balão (nem na barra de rolagem) tira o foco do campo.
            onMouseDown={(event) => event.preventDefault()}
            // O clique no próprio campo já abre e fecha: não conta como clique fora.
            onInteractOutside={(event) => {
              if (fieldRef.current?.contains(event.target as Node)) event.preventDefault();
            }}
            className={cn(
              "z-50 flex w-[var(--radix-popover-trigger-width)] flex-col",
              // No máximo 320px (container-xs), ou menos se não couber: a lista rola por dentro.
              "max-h-[min(var(--container-xs),var(--radix-popover-content-available-height))]",
              compact ? "rounded-lg" : "rounded-xl",
              "bg-surface p-1 ring-1 ring-subtle shadow-overlay outline-none",
              "inset-shadow-highlight animate-enter-exit",
            )}
          >
            {visible.length === 0 ? (
              <p role="status" className="px-2.5 py-2 text-body-md text-subtle">
                {emptyMessage}
              </p>
            ) : null}
            <div
              id={listboxId}
              role="listbox"
              aria-labelledby={label ? `${inputId}-label` : undefined}
              aria-label={label ? undefined : ariaLabel}
              // 2px entre as opções, como no Select. A barra de rolagem fina, como no Textarea.
              className={cn(
                "flex min-h-0 flex-col gap-0.5 overflow-y-auto",
                "[scrollbar-width:thin] [scrollbar-color:var(--ali-color-border-default)_transparent]",
              )}
            >
              {visible.map((option) => {
                const isSelected = option.value === selected;
                return (
                  // biome-ignore lint/a11y/useKeyWithClickEvents: o teclado fica no campo (aria-activedescendant).
                  <div
                    key={option.value}
                    id={optionId(option.value)}
                    role="option"
                    tabIndex={-1}
                    aria-selected={isSelected}
                    aria-disabled={option.disabled || undefined}
                    data-highlighted={highlighted === option.value || undefined}
                    data-disabled={option.disabled || undefined}
                    // O mouse não tira o foco do campo.
                    onMouseDown={(event) => event.preventDefault()}
                    onMouseMove={() => !option.disabled && setHighlighted(option.value)}
                    onClick={() => choose(option)}
                    className={cn(
                      // Mesmas medidas e estados das opções do Select: 10px nas laterais, espaço
                      // à direita para o check de 20px, destaque em neutral-hovered e a
                      // escolhida em bg-selected.
                      "relative flex cursor-pointer gap-2 pr-9 pl-2.5 select-none",
                      "text-body-md text-default",
                      compact ? "rounded-md py-1.5" : "rounded-lg py-2",
                      option.description ? "items-start" : "items-center",
                      compact && !option.description && "h-8",
                      "data-highlighted:bg-neutral-hovered",
                      isSelected && "bg-selected data-highlighted:bg-selected",
                      "data-disabled:cursor-not-allowed data-disabled:text-disabled",
                    )}
                  >
                    {option.icon ? (
                      <span
                        aria-hidden="true"
                        className={cn(
                          "flex h-[1lh] shrink-0 items-center text-icon-subtle [&_svg]:size-5",
                          option.disabled && "text-icon-disabled",
                        )}
                      >
                        {option.icon}
                      </span>
                    ) : null}
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate">{option.label}</span>
                      {option.description ? (
                        <span
                          className={cn(
                            "text-body-sm",
                            option.disabled ? "text-disabled" : "text-subtle",
                          )}
                        >
                          {option.description}
                        </span>
                      ) : null}
                    </span>
                    {isSelected ? (
                      <IconCheck
                        aria-hidden="true"
                        className={cn(
                          "absolute right-2.5 size-5 text-icon-primary",
                          option.description
                            ? compact
                              ? "top-1.5"
                              : "top-2"
                            : "inset-y-0 my-auto",
                        )}
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>
          </Content>
        </Portal>
      </Root>
      {/* O formulário recebe o value da escolhida, não o nome que aparece no campo. */}
      {name ? <input type="hidden" name={name} value={selected ?? ""} /> : null}
      {showDescription ? <FieldHelp id={descriptionId}>{description}</FieldHelp> : null}
      {error ? <FieldError id={errorId}>{error}</FieldError> : null}
    </div>
  );
}
