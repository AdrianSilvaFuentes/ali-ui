import { Content, List, Root, Trigger } from "@radix-ui/react-tabs";
import { cva, type VariantProps } from "class-variance-authority";
import {
  type ComponentProps,
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { cn } from "../lib/cn.ts";

type TabsVariant = "line" | "segmented";

/** As Tabs avisam a lista e as abas qual visual usar. */
const TabsContext = createContext<TabsVariant>("line");

/**
 * A fila de abas. Em `line`, uma linha fina embaixo de todas, onde pousa a linha da aba ativa.
 * Em `segmented`, uma caixa afundada (surface-sunken) com as abas dentro e o fundo da ativa.
 */
export const tabsListVariants = cva("flex items-center", {
  variants: {
    variant: {
      line: "relative border-b border-subtle",
      segmented:
        "relative inline-flex w-fit gap-0.5 rounded-lg bg-surface-sunken p-0.5 inset-shadow-sunken",
    },
  },
  defaultVariants: { variant: "line" },
});

/**
 * Cada aba. A ativa não depende só da cor: em `line` ganha uma linha de 2px embaixo; em
 * `segmented`, o fundo elevado do TabsList desliza até ela. O foco é o mesmo do Button.
 */
export const tabsTriggerVariants = cva(
  [
    "relative inline-flex shrink-0 items-center justify-center gap-2 text-label-md [&_svg]:size-4",
    "text-subtle transition-interactive duration-fast motion-reduce:transition-none",
    "cursor-pointer hover:text-default data-[state=active]:text-default",
    "outline-focus outline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2",
    "motion-reduce:outline-offset-2",
    "disabled:cursor-not-allowed disabled:text-disabled",
  ],
  {
    variants: {
      variant: {
        line: "h-8 rounded-sm px-3",
        segmented: "h-7 rounded-md px-3",
      },
    },
    defaultVariants: { variant: "line" },
  },
);

export interface TabsProps
  extends Omit<ComponentProps<typeof Root>, "asChild" | "dir">,
    VariantProps<typeof tabsListVariants> {}

/**
 * Abas que trocam o conteúdo na mesma página. Monte com `TabsList`, um `TabsTrigger` por aba e
 * um `TabsContent` com o mesmo `value`. Pelo teclado, o Tab entra na aba ativa, as setas
 * andam entre as abas e o Home e o End vão para a primeira e a última.
 */
export function Tabs({ variant, className, ...props }: TabsProps) {
  return (
    <TabsContext.Provider value={variant ?? "line"}>
      <Root className={cn("flex flex-col gap-4", className)} {...props} />
    </TabsContext.Provider>
  );
}

export interface TabsListProps extends Omit<ComponentProps<typeof List>, "asChild"> {}

/** A fila de abas. Dê um `aria-label` quando não houver um título visível que a nomeie. */
export function TabsList({ className, children, ...props }: TabsListProps) {
  const variant = useContext(TabsContext);
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<{ left: number; width: number } | null>(null);
  const [ready, setReady] = useState(false);

  // Mede onde está a aba ativa e leva a marca até lá. Remede quando a aba ativa muda (o
  // Radix troca o data-state) e quando a lista muda de tamanho.
  useLayoutEffect(() => {
    const list = ref.current;
    if (!list) return;
    const measure = () => {
      const tab = list.querySelector<HTMLElement>("[role=tab][data-state=active]");
      if (!tab) return setActive(null);
      // Medidas com fração de pixel, para a marca ter a largura exata da aba.
      const box = tab.getBoundingClientRect();
      setActive({ left: box.left - list.getBoundingClientRect().left, width: box.width });
    };
    measure();
    // Só anima depois de posicionada: ao abrir a página, a marca já aparece no lugar.
    const frame = requestAnimationFrame(() => setReady(true));
    const mutations = new MutationObserver(measure);
    mutations.observe(list, { attributes: true, attributeFilter: ["data-state"], subtree: true });
    const resize = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    resize?.observe(list);
    return () => {
      cancelAnimationFrame(frame);
      mutations.disconnect();
      resize?.disconnect();
    };
  }, []);

  return (
    <List ref={ref} className={cn(tabsListVariants({ variant }), className)} {...props}>
      {active ? (
        // A marca da aba ativa desliza para a direita ou para a esquerda até a aba escolhida,
        // em 200ms (duration-base), desacelerando no fim. Quem pede menos movimento vê direto.
        // Em `line`, a linha de 2px na cor da marca, cobrindo a linha da lista (-bottom-px).
        // Em `segmented`, o fundo elevado com borda.
        <span
          aria-hidden
          className={cn(
            "absolute left-0",
            variant === "segmented"
              ? "inset-y-0.5 rounded-md border border-subtle bg-neutral shadow-xs inset-shadow-highlight"
              : "-bottom-px border-b-2 border-primary",
            ready && "transition-[translate,width] duration-base ease-out",
            "motion-reduce:transition-none",
          )}
          style={{ translate: `${active.left}px 0`, width: active.width }}
        />
      ) : null}
      {children}
    </List>
  );
}

export interface TabsTriggerProps extends Omit<ComponentProps<typeof Trigger>, "asChild"> {}

/** Uma aba. O `value` liga ela ao `TabsContent` de mesmo `value`. */
export function TabsTrigger({ className, ...props }: TabsTriggerProps) {
  const variant = useContext(TabsContext);
  return <Trigger className={cn(tabsTriggerVariants({ variant }), className)} {...props} />;
}

export interface TabsContentProps extends Omit<ComponentProps<typeof Content>, "asChild"> {}

/** O conteúdo de uma aba. Recebe foco pelo Tab logo depois da lista, com o mesmo contorno. */
export function TabsContent({ className, ...props }: TabsContentProps) {
  return (
    <Content
      className={cn(
        "rounded-sm outline-focus outline-offset-4 focus-visible:outline-2",
        "focus-visible:outline-offset-2 motion-reduce:outline-offset-2",
        className,
      )}
      {...props}
    />
  );
}
