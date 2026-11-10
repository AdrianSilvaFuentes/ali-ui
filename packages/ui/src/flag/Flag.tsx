import { type CSSProperties, cloneElement, type ReactElement, type SVGProps } from "react";
import { cn } from "../lib/cn.ts";

export interface FlagProps {
  /**
   * A bandeira, um SVG na proporção 3:2, como as do `country-flag-icons`:
   * `<Flag><BR /></Flag>`. O design system não traz as bandeiras: quem usa escolhe a fonte.
   */
  children: ReactElement<SVGProps<SVGSVGElement>>;
  /**
   * O nome do país, para o leitor de tela. Sem ele, a bandeira é decorativa: use assim quando o
   * nome já aparece ao lado, como nas opções do Select e do Combobox.
   */
  label?: string;
  className?: string;
}

/**
 * A bandeira ocupa a moldura toda, cortando o que sobrar (slice), em vez de deixar faixas
 * vazias. O tamanho vai no próprio SVG (style), e não numa classe: assim vale mesmo dentro de
 * quem dá tamanho aos ícones de dentro, como o campo do Input, que deixa todo ícone com 20px.
 */
const fill: CSSProperties = { width: "100%", height: "100%" };

/**
 * A bandeira de um país numa moldura de 20×14px, perto da proporção 3:2 das bandeiras, com o
 * canto sm (4px). O contorno border-subtle é por dentro (uma camada por cima, como no Avatar),
 * para bandeiras com branco na borda, como a do Japão, não sumirem no fundo.
 */
export function Flag({ children, label, className }: FlagProps) {
  const classes = cn(
    "relative inline-flex h-3.5 w-5 shrink-0 overflow-hidden rounded-sm",
    "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit]",
    "after:border after:border-subtle",
    className,
  );
  const svg = cloneElement(children, {
    "aria-hidden": true,
    focusable: false,
    preserveAspectRatio: "xMidYMid slice",
    style: { ...children.props.style, ...fill },
  });

  // Com nome, a bandeira é uma imagem com o nome do país; sem nome, é decorativa.
  return label ? (
    <span role="img" aria-label={label} className={classes}>
      {svg}
    </span>
  ) : (
    <span aria-hidden="true" className={classes}>
      {svg}
    </span>
  );
}
