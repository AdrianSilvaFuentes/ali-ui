import { Content, List, Root, Trigger } from "@radix-ui/react-tabs";
import { cva, type VariantProps } from "class-variance-authority";
import { type ComponentProps, createContext, type ReactNode, useContext } from "react";
import { cn } from "../lib/cn.ts";
import {
  markerMotion,
  segmentedBox,
  segmentedItem,
  segmentedMarker,
  useSlidingMarker,
} from "../lib/segmented.ts";

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
      // A caixa vem de `lib/segmented.ts`, a mesma do SegmentedControl.
      segmented: [segmentedBox, "rounded-lg"],
    },
  },
  defaultVariants: { variant: "line" },
});

/**
 * Cada aba. A ativa não depende só da cor: em `line` ganha uma linha de 2px embaixo; em
 * `segmented`, o fundo elevado do TabsList desliza até ela. O foco é o mesmo do Button.
 */
export const tabsTriggerVariants = cva([...segmentedItem, "data-[state=active]:text-default"], {
  variants: {
    variant: {
      line: "h-8 rounded-sm px-3",
      segmented: "h-7 rounded-md px-3",
    },
  },
  defaultVariants: { variant: "line" },
});

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
  // Mede onde está a aba ativa e leva a marca até lá (veja `lib/segmented.ts`).
  const {
    ref,
    marker: active,
    ready,
  } = useSlidingMarker<HTMLDivElement>("[role=tab][data-state=active]");

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
            variant === "segmented"
              ? [segmentedMarker, "rounded-md"]
              : "absolute left-0 -bottom-px border-b-2 border-primary",
            ready && markerMotion,
            "motion-reduce:transition-none",
          )}
          style={{ translate: `${active.left}px 0`, width: active.width }}
        />
      ) : null}
      {children}
    </List>
  );
}

export interface TabsTriggerProps extends Omit<ComponentProps<typeof Trigger>, "asChild"> {
  /** Ícone antes do texto: `icon={<IconLayoutGrid />}`. Ganha 16px e fica escondido do leitor de tela. */
  icon?: ReactNode;
}

/** Uma aba. O `value` liga ela ao `TabsContent` de mesmo `value`. Só ícone? Passe um `aria-label`. */
export function TabsTrigger({ className, icon, children, ...props }: TabsTriggerProps) {
  const variant = useContext(TabsContext);
  return (
    <Trigger className={cn(tabsTriggerVariants({ variant }), className)} {...props}>
      {/* O nome da aba vem do texto (ou do aria-label), nunca do ícone. */}
      {icon ? (
        <span aria-hidden="true" className="inline-flex shrink-0">
          {icon}
        </span>
      ) : null}
      {children}
    </Trigger>
  );
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
