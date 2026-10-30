import { Anchor, Content, Portal, Root, Trigger } from "@radix-ui/react-popover";
import {
  IconCheck,
  IconChevronDown,
  IconGripVertical,
  IconPlus,
  IconSearch,
} from "@tabler/icons-react";
import type { VariantProps } from "class-variance-authority";
import {
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Input, inputVariants } from "../input/Input.tsx";
import { cn } from "../lib/cn.ts";
import { FieldLabel } from "../lib/FieldLabel.tsx";
import { FieldError, FieldHelp } from "../lib/FieldMessage.tsx";
import { Tag, type TagProps } from "../tag/Tag.tsx";

export interface MultiSelectOption {
  /** O valor guardado na escolha. Único na lista. */
  value: string;
  /** O nome da opção, na lista e na tag. */
  label: string;
  /** Cor da categoria, na tag do campo e na da lista. Diz o tipo, não um status. Padrão: gray. */
  color?: TagProps["color"];
  /** Ícone decorativo antes do nome, na tag do campo e na da lista: `icon={<IconMusic />}`. */
  icon?: ReactNode;
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
  /**
   * Liga a criação de opções: um texto novo na busca vira a linha "Criar “texto”", no fim da
   * lista, e Enter nela cria a opção e já a escolhe. Recebe o texto e devolve a opção nova
   * (`{ value, label }`, cor gray por padrão); guarde-a em `options`.
   */
  onCreate?: (label: string) => MultiSelectOption;
  /** O começo da linha de criar: "Criar “texto”". */
  createLabel?: string;
  /**
   * Liga a reordenação das opções da lista, arrastando ou com Alt+setas na opção em destaque.
   * Recebe as opções na ordem nova; guarde-as em `options`. Com ela, tags e lista têm uma ordem
   * só: mover uma muda a outra, e a escolha nova entra no lugar dela na lista. Com a busca
   * preenchida, não reordena.
   */
  onOptionsReorder?: (options: MultiSelectOption[]) => void;
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

/** O destaque na linha de criar, no lugar do valor de uma opção. */
const CREATE = "__create__";

/** A lista com o item de `from` levado para `to`. */
function move<T>(list: T[], from: number, to: number) {
  const next = [...list];
  const [item] = next.splice(from, 1);
  if (item !== undefined) next.splice(to, 0, item);
  return next;
}

/** Os valores na ordem da lista. Um valor que não está nela fica no fim. */
function sortByList(values: string[], list: MultiSelectOption[]) {
  const order = list.map((option) => option.value);
  const rank = (value: string) => (order.indexOf(value) + order.length + 1) % (order.length + 1);
  return [...values].sort((a, b) => rank(a) - rank(b));
}

/** O tempo de uma animação curta (duration-fast), ou 0 para quem pede menos movimento. */
function fastDuration(element: HTMLElement) {
  if (!element.animate || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return 0;
  return Number.parseFloat(getComputedStyle(element).getPropertyValue("--ali-duration-fast")) || 0;
}

/** O lugar do elemento sem o deslocamento de uma animação, para não mirar num alvo andando. */
function layoutRect(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const transform = getComputedStyle(element).transform;
  if (!transform || transform === "none") return rect;
  const { m41: x, m42: y } = new DOMMatrixReadOnly(transform);
  return new DOMRect(rect.left - x, rect.top - y, rect.width, rect.height);
}

/** O arrasto em curso, em `useDragReorder`. */
interface DragSession {
  item: HTMLElement;
  /** Onde o item e o ponteiro começaram, e onde o ponteiro está. */
  origin: DOMRect;
  start: { x: number; y: number };
  pointer: { x: number; y: number };
  /** Onde cada item estava à vista antes da última mudança de ordem: de onde os outros deslizam. */
  before: Map<HTMLElement, DOMRect>;
}

/** Põe o item embaixo do ponteiro: o deslocamento do ponteiro menos o quanto o lugar dele mudou. */
function follow({ item, origin, start, pointer }: DragSession, axis: "x" | "y") {
  item.style.transform = "";
  const slot = item.getBoundingClientRect();
  const dx = axis === "y" ? 0 : pointer.x - start.x - (slot.left - origin.left);
  const dy = pointer.y - start.y - (slot.top - origin.top);
  item.style.transform = `translate(${dx}px, ${dy}px)`;
}

/** Desliza o elemento de onde está à vista até o seu lugar. */
function slide(element: HTMLElement, from: string, duration: number) {
  return element.animate([{ transform: from }, { transform: "none" }], {
    duration,
    easing: "ease-out",
  });
}

/**
 * Arrastar para reordenar, à mão, com pointer events (mouse e caneta; no toque o arrasto rola a
 * página). Os itens são os irmãos com `data-reorder`. O item arrastado segue o ponteiro, e os
 * outros deslizam para abrir o vão onde ele vai cair: `drag` diz de onde ele saiu e para onde
 * vai, para a lista já se mostrar na ordem nova. Ao soltar, ele desliza até o vão e `onDrop` é
 * chamado. `axis` "y" é uma coluna (o item só sobe e desce); "x" são itens lado a lado, que
 * podem quebrar linha.
 */
function useDragReorder(axis: "x" | "y", onDrop: (from: number, to: number) => void) {
  const [drag, setDrag] = useState<{ from: number; to: number } | null>(null);
  // O clique que vem junto com o soltar não conta como clique.
  const dragged = useRef(false);
  const session = useRef<DragSession | null>(null);

  // Depois de cada mudança de ordem: o item volta para baixo do ponteiro, e os outros deslizam
  // de onde estavam até o lugar novo.
  useLayoutEffect(() => {
    const current = session.current;
    if (!drag || !current) return;
    follow(current, axis);
    const duration = fastDuration(current.item);
    if (!duration) return;
    for (const [element, old] of current.before) {
      if (element === current.item || !element.isConnected) continue;
      for (const animation of element.getAnimations()) animation.cancel();
      const now = element.getBoundingClientRect();
      const dx = old.left - now.left;
      const dy = old.top - now.top;
      if (dx || dy) slide(element, `translate(${dx}px, ${dy}px)`, duration);
    }
  }, [drag, axis]);

  const itemProps = (index: number) => ({
    "data-reorder": "",
    "data-dragging": drag?.to === index || undefined,
    onPointerDown: (event: PointerEvent<HTMLElement>) => {
      dragged.current = false;
      if (event.button !== 0 || event.pointerType === "touch") return;
      const item = event.currentTarget;
      const container = item.parentElement;
      if (!container) return;
      const start = { x: event.clientX, y: event.clientY };
      let to = index;
      let moving = false;
      let shown = false;

      const handleMove = (e: globalThis.PointerEvent) => {
        // Só vira arrasto depois de 4px: um clique com a mão tremendo continua um clique.
        if (!moving && Math.hypot(e.clientX - start.x, e.clientY - start.y) < 4) return;
        const items = [...container.querySelectorAll<HTMLElement>(":scope > [data-reorder]")];
        if (!moving) {
          moving = true;
          // Por cima dos vizinhos enquanto anda.
          item.style.position = "relative";
          item.style.zIndex = "1";
          session.current = {
            item,
            origin: item.getBoundingClientRect(),
            start,
            pointer: start,
            before: new Map(),
          };
        }
        const current = session.current;
        if (!current) return;
        current.pointer = { x: e.clientX, y: e.clientY };
        follow(current, axis);
        const rects = items.filter((el) => el !== item).map(layoutRect);
        // O lugar novo é quantos outros itens ficam antes do ponteiro.
        let next: number;
        if (axis === "y") {
          next = rects.filter((r) => r.top + r.height / 2 < e.clientY).length;
        } else {
          // Acima ou abaixo de todas as linhas, conta como na primeira ou na última.
          const top = Math.min(...rects.map((r) => r.top));
          const bottom = Math.max(...rects.map((r) => r.bottom));
          const y = Math.min(Math.max(e.clientY, top), bottom - 1);
          next = rects.filter(
            (r) => r.bottom <= y || (r.top <= y && r.left + r.width / 2 < e.clientX),
          ).length;
        }
        if (next === to && shown) return;
        to = next;
        shown = true;
        current.before = new Map(items.map((el) => [el, el.getBoundingClientRect()]));
        setDrag({ from: index, to });
      };
      const handleUp = (e: globalThis.PointerEvent) => {
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleUp);
        window.removeEventListener("pointercancel", handleUp);
        if (!moving) return;
        dragged.current = true;
        session.current = null;
        // Do ponteiro até o vão.
        const from = item.style.transform;
        item.style.transform = "";
        const reset = () => {
          item.style.position = "";
          item.style.zIndex = "";
        };
        const duration = fastDuration(item);
        if (duration && from) slide(item, from, duration).onfinish = reset;
        else reset();
        setDrag(null);
        if (e.type === "pointerup" && to !== index) onDrop(index, to);
      };
      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", handleUp);
      window.addEventListener("pointercancel", handleUp);
    },
    onClickCapture: (event: MouseEvent<HTMLElement>) => {
      if (!dragged.current) return;
      dragged.current = false;
      event.preventDefault();
      event.stopPropagation();
    },
  });

  return { drag, itemProps };
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
 * lista; Enter escolhe ou tira a opção; Esc ou Tab fecham. Com `onCreate`, Enter num texto novo
 * cria a opção.
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
  onCreate,
  createLabel = "Criar",
  onOptionsReorder,
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
  // Tags que a pessoa acabou de escolher: só elas entram com animação, até ela terminar.
  const entering = useRef(new Set<string>());
  // Tags que acabaram de sair da escolha: continuam na tela, sem interação, até a animação de
  // saída terminar. `index` é onde estavam, para saírem do mesmo lugar.
  const [leaving, setLeaving] = useState<{ option: MultiSelectOption; index: number }[]>([]);
  // Depois de remover uma tag, o foco vai para o X da próxima, ou para o campo. Depois de
  // mover uma tag, vai para o X dela, no lugar novo.
  const focusTag = useRef<number | null>(null);
  // O aviso ao leitor de tela depois de mover uma tag ou opção: "Figma, posição 2 de 4".
  const [announcement, setAnnouncement] = useState("");

  const selectedOptions = selected
    .map((v) => options.find((option) => option.value === v))
    .filter((option): option is MultiSelectOption => Boolean(option));

  // Fechado, as tags ficam numa linha só, e as que não cabem viram um contador "+N". Aberto,
  // o campo mostra todas. A medida vale para esta escolha nesta largura do campo.
  const [fieldWidth, setFieldWidth] = useState(0);
  const fitKey = `${selected.join("\n")}|${fieldWidth}`;
  const [fit, setFit] = useState<{ key: string; count: number } | null>(null);
  // Tags e lista têm uma ordem só: reordenar, aqui ou lá, só com `onOptionsReorder`.
  const reorderable = Boolean(onOptionsReorder) && !disabled;
  const tagDrag = useDragReorder("x", (from, to) => reorderTags(from, to));
  // Enquanto arrasta, as tags já aparecem na ordem nova.
  const orderedOptions = tagDrag.drag
    ? move(selectedOptions, tagDrag.drag.from, tagDrag.drag.to)
    : selectedOptions;
  const shownCount = !open && fit?.key === fitKey ? fit.count : selectedOptions.length;
  const hiddenCount = selectedOptions.length - shownCount;

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    const observer = new ResizeObserver(([entry]) =>
      setFieldWidth(Math.round(entry?.contentRect.width ?? 0)),
    );
    observer.observe(field);
    return () => observer.disconnect();
  }, []);

  // Mede antes de pintar, então a pessoa nunca vê as tags passando da borda.
  useLayoutEffect(() => {
    const list = tagsRef.current;
    if (open || !list) return;
    const overflows = list.scrollWidth > list.clientWidth;
    if (fit?.key !== fitKey) {
      // Com todas as tags na linha: conta as que terminam antes da borda da lista.
      const right = list.getBoundingClientRect().right;
      const count = overflows
        ? [...list.children].filter(
            (item) =>
              !item.hasAttribute("data-leaving") && item.getBoundingClientRect().right <= right,
          ).length
        : selectedOptions.length;
      setFit({ key: fitKey, count });
    } else if (overflows && fit.count > 0) {
      // O "+N" ocupa espaço e a lista encolhe: a última tag que deixou de caber vira contador.
      setFit({ key: fitKey, count: fit.count - 1 });
    }
  });

  // A altura do campo muda com as tags (escolher, remover, abrir e fechar). O CSS não anima
  // uma altura que cresce pelo conteúdo, então animamos da altura anterior à nova, em
  // duration-base. Sem animação para quem pede menos movimento.
  const fieldHeight = useRef<number | null>(null);
  const heightAnimation = useRef<Animation | null>(null);
  const layoutKey = `${selected.length}|${leaving.length}|${open}|${shownCount}`;
  useLayoutEffect(() => {
    const field = fieldRef.current;
    if (!field || !layoutKey) return;
    // No meio de uma animação, parte da altura em que o campo está agora.
    const running = heightAnimation.current?.playState === "running";
    const from = running ? field.offsetHeight : fieldHeight.current;
    heightAnimation.current?.cancel();
    const to = field.offsetHeight;
    fieldHeight.current = to;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (from === null || from === to || reduce || !field.animate) return;
    const duration = Number.parseFloat(
      getComputedStyle(field).getPropertyValue("--ali-duration-base"),
    );
    heightAnimation.current = field.animate([{ height: `${from}px` }, { height: `${to}px` }], {
      duration,
      easing: "ease-out",
    });
  }, [layoutKey]);

  // Quando a ordem das tags muda sem arrasto (lista reordenada, Alt+setas), cada tag desliza
  // de onde estava até o lugar novo, em duration-fast. Guarda onde cada uma estava a cada render.
  const tagRects = useRef(new Map<string, DOMRect>());
  const orderKey = useRef(selected.join("\n"));
  useLayoutEffect(() => {
    const key = selected.join("\n");
    const reordered = key !== orderKey.current;
    orderKey.current = key;
    const list = tagsRef.current;
    const items = list ? [...list.querySelectorAll<HTMLElement>(":scope > [data-value]")] : [];
    const duration = reordered && list ? fastDuration(list) : 0;
    const rects = new Map<string, DOMRect>();
    for (const item of items) {
      const value = item.dataset.value ?? "";
      const rect = layoutRect(item);
      const old = tagRects.current.get(value);
      rects.set(value, rect);
      if (!duration || !old) continue;
      const dx = old.left - rect.left;
      const dy = old.top - rect.top;
      if (dx || dy) slide(item, `translate(${dx}px, ${dy}px)`, duration);
    }
    tagRects.current = rects;
  });

  const visible = useMemo(() => {
    const term = normalize(query.trim());
    return term ? options.filter((option) => normalize(option.label).includes(term)) : options;
  }, [options, query]);
  const enabled = visible.filter((option) => !option.disabled);
  // Com a busca preenchida, a lista é só um pedaço: reordenar nela confundiria.
  const canReorderOptions = Boolean(onOptionsReorder) && !query.trim();
  const optionDrag = useDragReorder("y", (from, to) => reorderOptions(from, to));
  const listed = optionDrag.drag
    ? move(visible, optionDrag.drag.from, optionDrag.drag.to)
    : visible;

  /** Com `onCreate`, um texto que não é o nome de nenhuma opção pode virar uma opção nova. */
  const canCreate = (text: string) => {
    const term = normalize(text.trim());
    return Boolean(onCreate && term && !options.some((option) => normalize(option.label) === term));
  };
  const creating = canCreate(query);
  // A ordem das setas: as opções que podem ser escolhidas e, no fim, a linha de criar.
  const navigable = [...enabled.map((option) => option.value), ...(creating ? [CREATE] : [])];

  const setValue = (next: string[]) => {
    if (valueProp === undefined) setInnerValue(next);
    onValueChange?.(next);
  };

  /** Muda a ordem da lista, e as tags do campo passam a seguir a ordem nova. */
  const reorderOptions = (from: number, to: number) => {
    const next = move(options, from, to);
    onOptionsReorder?.(next);
    const sorted = sortByList(selected, next);
    if (sorted.some((v, i) => v !== selected[i])) setValue(sorted);
  };

  /**
   * Muda a ordem das tags. Com a lista reordenável, as duas ordens são uma só: as escolhidas
   * trocam de lugar entre si na lista, e as outras opções ficam onde estão.
   */
  const reorderTags = (from: number, to: number) => {
    const next = move(selected, from, to);
    setValue(next);
    if (!onOptionsReorder) return;
    const queue = next
      .map((v) => options.find((option) => option.value === v))
      .filter((option): option is MultiSelectOption => Boolean(option));
    onOptionsReorder(
      options.map((option) =>
        selected.includes(option.value) ? (queue.shift() ?? option) : option,
      ),
    );
  };

  /** Uma escolha nova: no fim das tags, ou, com a lista reordenável, no lugar dela na lista. */
  const add = (value: string) => {
    const next = [...selected, value];
    setValue(onOptionsReorder ? sortByList(next, options) : next);
  };

  const markLeaving = (value: string) => {
    const option = options.find((o) => o.value === value);
    if (option) setLeaving((list) => [...list, { option, index: selected.indexOf(value) }]);
  };

  const toggle = (option: MultiSelectOption) => {
    if (option.disabled) return;
    if (selected.includes(option.value)) {
      markLeaving(option.value);
      setValue(selected.filter((v) => v !== option.value));
    } else {
      // Escolhida de novo antes de terminar de sair: volta a ser uma tag comum.
      setLeaving((list) => list.filter((item) => item.option.value !== option.value));
      entering.current.add(option.value);
      add(option.value);
    }
  };

  const create = () => {
    const option = onCreate?.(query.trim());
    if (!option) return;
    setQuery("");
    setHighlighted(option.value);
    if (selected.includes(option.value)) return;
    entering.current.add(option.value);
    add(option.value);
  };

  const remove = (index: number) => {
    focusTag.current = index;
    const value = selected[index];
    if (value !== undefined) markLeaving(value);
    setValue(selected.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const index = focusTag.current;
    if (index === null) return;
    focusTag.current = null;
    const buttons = tagsRef.current?.querySelectorAll<HTMLButtonElement>(
      "li:not([data-leaving]) button",
    );
    (buttons?.[index] ?? triggerRef.current)?.focus();
  });

  /** Alt+← e Alt+→ no X de uma tag a levam um lugar para o lado, entre as que aparecem. */
  const handleTagKeyDown = (event: KeyboardEvent<HTMLLIElement>, index: number) => {
    if (!reorderable || !event.altKey) return;
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const to = index + (event.key === "ArrowLeft" ? -1 : 1);
    if (to < 0 || to >= shownCount) return;
    focusTag.current = to;
    reorderTags(index, to);
    setAnnouncement(`${selectedOptions[index]?.label}, posição ${to + 1} de ${selected.length}`);
  };

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
    // Sem nenhuma parecida, o destaque vai para a linha de criar: Enter já cria.
    setHighlighted(first?.value ?? (canCreate(text) ? CREATE : null));
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const index = highlighted === null ? -1 : navigable.indexOf(highlighted);
    const isArrow = event.key === "ArrowDown" || event.key === "ArrowUp";
    if (isArrow && event.altKey && canReorderOptions) {
      // Alt+setas levam a opção em destaque um lugar para cima ou para baixo.
      event.preventDefault();
      const from = options.findIndex((option) => option.value === highlighted);
      const to = from + (event.key === "ArrowUp" ? -1 : 1);
      if (from === -1 || to < 0 || to >= options.length) return;
      reorderOptions(from, to);
      setAnnouncement(`${options[from]?.label}, posição ${to + 1} de ${options.length}`);
    } else if (isArrow) {
      event.preventDefault();
      if (navigable.length === 0) return;
      const step = event.key === "ArrowDown" ? 1 : -1;
      const next = index === -1 ? 0 : (index + step + navigable.length) % navigable.length;
      setHighlighted(navigable[next] ?? null);
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (highlighted === CREATE) create();
      const option = enabled.find((o) => o.value === highlighted);
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
    const target = event.target as Element;
    if (disabled || target.closest("button")) return;
    event.preventDefault();
    // Numa tag, abre no clique, que só vem se não houve arrasto.
    if (!target.closest("[data-reorder]")) changeOpen(!open);
  };

  // As tags na tela: as escolhidas que cabem, mais as que estão saindo, no lugar onde estavam.
  const shownTags: { option: MultiSelectOption; index: number; isLeaving: boolean }[] =
    orderedOptions.slice(0, shownCount).map((option, index) => ({
      option,
      index,
      isLeaving: false,
    }));
  for (const item of leaving) {
    shownTags.splice(Math.min(item.index, shownTags.length), 0, { ...item, isLeaving: true });
  }

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
              // overflow-hidden: enquanto a altura anima, as tags não passam da borda.
              "h-auto cursor-pointer overflow-hidden px-2.5 data-[state=open]:border-default",
              // A tag é sempre md (24px), nos dois tamanhos: no sm sobram 3px em cima e embaixo.
              compact ? "min-h-8 py-0.5" : "min-h-10 py-1.5",
              shownTags.length > 0 && (compact ? "pl-1" : "pl-1.5"),
            )}
          >
            {shownTags.length > 0 ? (
              <ul
                ref={tagsRef}
                className={cn("flex min-w-0 flex-1 gap-1", open ? "flex-wrap" : "overflow-hidden")}
              >
                {shownTags.map(({ option, index, isLeaving }) =>
                  isLeaving ? (
                    // Saindo: escondida do leitor de tela e sem foco, só para a animação.
                    <li
                      key={`leaving-${option.value}`}
                      data-leaving=""
                      aria-hidden="true"
                      inert
                      onAnimationEnd={() =>
                        setLeaving((list) => list.filter((item) => item.option !== option))
                      }
                      className="flex shrink-0 animate-pop-out"
                    >
                      <Tag
                        size="md"
                        icon={option.icon}
                        color={option.color}
                        onRemove={disabled ? undefined : () => {}}
                      >
                        {option.label}
                      </Tag>
                    </li>
                  ) : (
                    <li
                      key={option.value}
                      data-value={option.value}
                      {...(reorderable ? tagDrag.itemProps(index) : {})}
                      onClick={(event) => {
                        // Sem reordenar, o clique na tag já abriu no mousedown do campo.
                        if (reorderable && !(event.target as Element).closest("button")) {
                          changeOpen(!open);
                        }
                      }}
                      onKeyDown={(event) => handleTagKeyDown(event, index)}
                      onAnimationEnd={() => entering.current.delete(option.value)}
                      className={cn(
                        "flex shrink-0 select-none data-dragging:cursor-grabbing",
                        entering.current.has(option.value) && "animate-pop-in",
                      )}
                    >
                      <Tag
                        size="md"
                        icon={option.icon}
                        color={option.color}
                        onRemove={disabled ? undefined : () => remove(index)}
                      >
                        {option.label}
                      </Tag>
                    </li>
                  ),
                )}
              </ul>
            ) : (
              <span className="min-w-0 flex-1 truncate text-placeholder group-data-disabled:text-disabled">
                {placeholder}
              </span>
            )}
            {/* Só visual: o leitor de tela já ouve todas as escolhidas no nome do campo. */}
            {hiddenCount > 0 ? (
              <span
                aria-hidden="true"
                className="shrink-0 text-body-md text-subtle group-data-disabled:text-disabled"
              >
                +{hiddenCount}
              </span>
            ) : null}
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
                // Só a seta de 20px, a 10px da borda, como no Select. O clique no resto do campo
                // também abre a lista.
                "inline-flex shrink-0 cursor-pointer items-center outline-none",
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
            {visible.length === 0 && !creating ? (
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
              // 2px entre as opções, como no Select: aqui várias ficam escolhidas ao mesmo tempo,
              // e sem o espaço as escolhidas seguidas viravam um bloco só.
              className="flex min-h-0 flex-col gap-0.5 overflow-y-auto"
            >
              {listed.map((option, index) => {
                const isSelected = selected.includes(option.value);
                return (
                  // biome-ignore lint/a11y/useKeyWithClickEvents: o teclado fica na busca (aria-activedescendant).
                  <div
                    key={option.value}
                    {...(canReorderOptions ? optionDrag.itemProps(index) : {})}
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
                      compact ? "h-8 rounded-md py-1" : "rounded-lg py-2",
                      "data-highlighted:bg-neutral-hovered",
                      isSelected && "bg-selected data-highlighted:bg-selected",
                      "data-disabled:cursor-not-allowed data-dragging:cursor-grabbing data-dragging:shadow-overlay",
                    )}
                  >
                    {/* A alça diz que a linha se arrasta. Some com a busca, que não reordena. */}
                    {canReorderOptions ? (
                      <IconGripVertical
                        aria-hidden="true"
                        className="size-4 shrink-0 cursor-grab text-icon-subtle"
                      />
                    ) : null}
                    {/* Desabilitada, a tag fica com o texto e o ícone em cinza. */}
                    <Tag
                      size="md"
                      icon={option.icon}
                      color={option.color}
                      className={cn(option.disabled && "text-disabled [&_svg]:text-icon-disabled")}
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
              {creating ? (
                // biome-ignore lint/a11y/useKeyWithClickEvents: o teclado fica na busca (aria-activedescendant).
                <div
                  id={`${listboxId}-${CREATE}`}
                  role="option"
                  tabIndex={-1}
                  aria-selected={false}
                  data-highlighted={highlighted === CREATE || undefined}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseMove={() => setHighlighted(CREATE)}
                  onClick={create}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 px-2.5 text-body-md text-default select-none",
                    compact ? "h-8 rounded-md py-1" : "rounded-lg py-2",
                    "data-highlighted:bg-neutral-hovered",
                  )}
                >
                  <IconPlus aria-hidden="true" className="size-5 shrink-0 text-icon-subtle" />
                  <span className="min-w-0 truncate">
                    {createLabel} “{query.trim()}”
                  </span>
                </div>
              ) : null}
            </div>
          </Content>
        </Portal>
      </Root>
      <span role="status" className="sr-only">
        {announcement}
      </span>
      {showDescription ? <FieldHelp id={descriptionId}>{description}</FieldHelp> : null}
      {error ? <FieldError id={errorId}>{error}</FieldError> : null}
    </div>
  );
}
