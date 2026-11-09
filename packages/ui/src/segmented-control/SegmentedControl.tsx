import { Item, Root } from "@radix-ui/react-radio-group";
import { cva, type VariantProps } from "class-variance-authority";
import { type ComponentProps, createContext, type ReactNode, useContext, useId } from "react";
import { cn } from "../lib/cn.ts";
import { FieldLabel } from "../lib/FieldLabel.tsx";
import { FieldError, FieldHelp } from "../lib/FieldMessage.tsx";
import {
  markerMotion,
  segmentedBox,
  segmentedItem,
  segmentedMarker,
  useSlidingMarker,
} from "../lib/segmented.ts";

type SegmentedSize = "sm" | "md";

/**
 * A caixa afundada, a mesma das Tabs `segmented` (veja `lib/segmented.ts`). Com a mesma altura
 * e o mesmo canto do Input e do Button em cada tamanho, para ficar lado a lado com eles. Com
 * erro, ganha um contorno vermelho de 1px.
 */
export const segmentedControlVariants = cva([segmentedBox, "data-invalid:ring-1 ring-danger"], {
  variants: {
    size: {
      sm: "rounded-lg",
      md: "rounded-xl",
    },
    fullWidth: {
      true: "flex w-full",
      false: "",
    },
  },
  defaultVariants: { size: "md", fullWidth: false },
});

/**
 * Cada opção. A escolhida não depende só da cor: o fundo elevado desliza até ela. Os 2px de
 * respiro da caixa ficam em volta: 28px dentro dos 32px (sm), 36px dentro dos 40px (md).
 */
export const segmentedControlItemVariants = cva(
  [...segmentedItem, "data-[state=checked]:text-default"],
  {
    variants: {
      size: {
        sm: "h-7 rounded-md px-3",
        md: "h-9 rounded-lg px-4",
      },
      fullWidth: {
        true: "flex-1",
        false: "",
      },
    },
    defaultVariants: { size: "md", fullWidth: false },
  },
);

/** O canto do fundo elevado, o mesmo da opção. */
const markerRadius: Record<SegmentedSize, string> = { sm: "rounded-md", md: "rounded-lg" };

/** A caixa avisa as opções o tamanho e se ocupam a largura toda. */
const SegmentedContext = createContext<{ size: SegmentedSize; fullWidth: boolean }>({
  size: "md",
  fullWidth: false,
});

export interface SegmentedControlProps
  extends Omit<ComponentProps<typeof Root>, "asChild" | "dir" | "orientation">,
    VariantProps<typeof segmentedControlVariants> {
  /** O nome do campo, acima das opções. Sem ele, passe um `aria-label`. */
  label?: ReactNode;
  /** Ajuda extra num ícone de info no fim do label, que abre um Toggletip. */
  labelInfo?: ReactNode;
  /** Texto de ajuda abaixo das opções, lido pelo leitor de tela junto com o grupo. */
  description?: ReactNode;
  /** Mensagem de erro. Substitui a ajuda e aparece com ícone, não só em vermelho. */
  error?: ReactNode;
  /** As opções: um `SegmentedControlItem` para cada. */
  children: ReactNode;
  /** Classes do bloco inteiro (label, caixa e mensagens). */
  className?: string;
}

/**
 * Uma escolha entre poucas opções curtas, lado a lado: "Dia | Semana | Mês". Para o leitor de
 * tela, é um grupo de rádio: ele ouve "1 de 3". Pelo teclado, o Tab entra na opção escolhida e
 * as setas trocam a opção. Para trocar o conteúdo da tela, use as Tabs.
 */
export function SegmentedControl({
  className,
  label,
  labelInfo,
  description,
  error,
  children,
  size,
  fullWidth,
  disabled = false,
  "aria-describedby": describedBy,
  ...props
}: SegmentedControlProps) {
  const id = useId();
  const labelId = label ? `${id}-label` : undefined;
  // Com erro, a mensagem de erro substitui a ajuda, na tela e no leitor de tela.
  const showDescription = Boolean(description) && !error;
  const descriptionId = showDescription ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const invalid = Boolean(error);
  const sizeName = size ?? "md";

  // Mede onde está a opção escolhida e leva o fundo elevado até lá.
  const { ref, marker, ready } = useSlidingMarker<HTMLDivElement>(
    "[role=radio][data-state=checked]",
  );

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <FieldLabel id={labelId} info={labelInfo} disabled={disabled}>
          {label}
        </FieldLabel>
      ) : null}
      <Root
        ref={ref}
        aria-labelledby={labelId}
        aria-describedby={
          [describedBy, descriptionId, errorId].filter(Boolean).join(" ") || undefined
        }
        aria-invalid={invalid || undefined}
        data-invalid={invalid || undefined}
        disabled={disabled}
        orientation="horizontal"
        className={segmentedControlVariants({ size, fullWidth })}
        {...props}
      >
        {marker ? (
          <span
            aria-hidden
            className={cn(
              segmentedMarker,
              markerRadius[sizeName],
              // Desabilitado, o fundo continua mostrando a escolhida, mas sem relevo.
              disabled && "border-disabled shadow-none inset-shadow-none",
              ready && markerMotion,
              "motion-reduce:transition-none",
            )}
            style={{ translate: `${marker.left}px 0`, width: marker.width }}
          />
        ) : null}
        <SegmentedContext.Provider value={{ size: sizeName, fullWidth: Boolean(fullWidth) }}>
          {children}
        </SegmentedContext.Provider>
      </Root>
      {showDescription ? <FieldHelp id={descriptionId}>{description}</FieldHelp> : null}
      {error ? <FieldError id={errorId}>{error}</FieldError> : null}
    </div>
  );
}

export interface SegmentedControlItemProps extends Omit<ComponentProps<typeof Item>, "asChild"> {
  /** O texto da opção, com ícone opcional. Só ícone? Passe um `aria-label`. */
  children: ReactNode;
}

/** Uma opção do SegmentedControl. O `value` é o que o formulário envia. */
export function SegmentedControlItem({ className, ...props }: SegmentedControlItemProps) {
  const { size, fullWidth } = useContext(SegmentedContext);
  return (
    <Item className={cn(segmentedControlItemVariants({ size, fullWidth }), className)} {...props} />
  );
}
