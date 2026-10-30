/**
 * Tokens semânticos: os nomes que os componentes usam, definidos pelo papel de cada
 * valor ("fundo", "texto", "borda") e não pela aparência ("cinza 200").
 *
 * Cada token aponta para um primitivo. Trocar a identidade é mudar esses apontamentos
 * ou os próprios primitivos, sem tocar em nenhum componente.
 */

import { toOklch } from "./color.ts";
import {
  blue,
  duration as durationScale,
  fontFamily,
  fontSize,
  fontWeight as fontWeightScale,
  green,
  letterSpacing,
  lineHeight,
  neutralDark,
  neutralLight,
  orange,
  primary,
  red,
  teal,
  yellow,
} from "./primitives.ts";
import { shadow } from "./scales.ts";

export type ThemeName = "light" | "dark";

export interface ColorToken {
  readonly light: string;
  readonly dark: string;
  readonly description: string;
}

/** Cores por papel, com um valor para o tema claro e outro para o escuro. */
export const color = {
  "surface-sunken": {
    light: neutralLight[100],
    dark: neutralDark[950],
    description: "Abaixo da página: áreas rebaixadas, fundo de colunas e poços.",
  },
  surface: {
    light: neutralLight[50],
    dark: neutralDark[900],
    description: "A página: fundo padrão.",
  },
  "surface-raised": {
    light: neutralLight[50],
    dark: neutralDark[800],
    description: "Um pouco acima da página: cartões. Use com shadow-raised.",
  },
  "surface-overlay": {
    light: neutralLight[50],
    dark: neutralDark[700],
    description: "Acima de tudo: menus, popovers e diálogos. Use com shadow-overlay.",
  },
  "background-disabled": {
    light: neutralLight[200],
    dark: neutralDark[600],
    description: "Fundo de controles desabilitados. Texto e ícone em disabled.",
  },
  "background-neutral": {
    light: neutralLight[50],
    dark: neutralDark[900],
    description: "Fundo do botão secundário. Texto e ícone em default, borda em default.",
  },
  "background-neutral-hovered": {
    light: neutralLight[100],
    // Um passo a partir do repouso nos dois temas: no claro escurece, no escuro clareia.
    dark: neutralDark[800],
    description: "Botão secundário com o cursor em cima.",
  },
  "background-neutral-pressed": {
    light: neutralLight[200],
    // Dois passos a partir do repouso, um além do hover, nos dois temas.
    dark: neutralDark[700],
    description:
      "Botão secundário pressionado: um passo além do hover. No claro escurece; no escuro clareia.",
  },
  "background-readonly": {
    light: neutralLight[100],
    dark: neutralDark[800],
    description:
      "Fundo de campos somente leitura: o valor aparece, mas não se edita. Texto em default.",
  },
  "background-selected": {
    light: primary[100],
    dark: primary[950],
    description:
      "Fundo de um item escolhido numa lista, como a opção marcada do Select: um tom de hover na cor da marca. Texto em default.",
  },
  "background-danger-subtle-hovered": {
    light: red[50],
    dark: red[950],
    description: "Fundo suave de risco: hover do botão destrutivo com contorno. Texto em danger.",
  },
  "background-danger-subtle-pressed": {
    light: red[100],
    dark: red[950],
    description:
      "Botão destrutivo com contorno pressionado. No claro, um degrau mais forte que o hover; no escuro, igual ao hover, e o retorno vem do botão afundando.",
  },
  "text-default": {
    light: neutralLight[900],
    dark: neutralDark[50],
    description: "Texto principal.",
  },
  "text-subtle": {
    light: neutralLight[600],
    dark: neutralDark[200],
    description: "Texto secundário: legendas, dicas, metadados.",
  },
  "text-placeholder": {
    light: neutralLight[400],
    dark: neutralDark[200],
    description:
      "Placeholder de campos: bem mais claro que o texto digitado, para o campo não parecer preenchido. Só para exemplos; instruções vão na ajuda.",
  },
  "text-disabled": {
    light: neutralLight[400],
    dark: neutralDark[400],
    description: "Texto de elementos desabilitados.",
  },
  "text-link": {
    light: primary[900],
    dark: primary[600],
    description: "Links e textos na cor de marca.",
  },
  "text-inverse": {
    light: neutralLight[50],
    dark: neutralDark[950],
    description: "Texto sobre fundos invertidos, que mudam com o tema: tooltips, toasts.",
  },
  "text-static-white": {
    light: neutralLight[50],
    dark: neutralLight[50],
    description: "Branco nos dois temas: sobre fotos, vídeos ou fundos fixos.",
  },
  "text-static-black": {
    light: neutralLight[950],
    dark: neutralLight[950],
    description: "Quase preto nos dois temas: sobre fotos, vídeos ou fundos fixos.",
  },
  "text-success": {
    light: green[900],
    dark: green[300],
    description: "Sucesso e confirmações: salvo, concluído.",
  },
  "text-caution": {
    light: yellow[900],
    dark: yellow[300],
    description: "Atenção leve: algo merece cuidado, mas não bloqueia.",
  },
  "text-warning": {
    light: orange[800],
    dark: orange[300],
    description: "Aviso: algo pode dar errado se nada for feito.",
  },
  "text-danger": {
    light: red[700],
    dark: red[300],
    description: "Erros e ações destrutivas.",
  },
  "text-info": {
    light: blue[700],
    dark: blue[300],
    description: "Informação neutra: dicas e novidades.",
  },
  "icon-default": {
    light: neutralLight[700],
    dark: neutralDark[100],
    description: "Ícones principais, um degrau mais suaves que o texto.",
  },
  "icon-subtle": {
    light: neutralLight[500],
    dark: neutralDark[300],
    description: "Ícones secundários e decorativos.",
  },
  "icon-disabled": {
    light: neutralLight[400],
    dark: neutralDark[400],
    description: "Ícones de elementos desabilitados.",
  },
  "icon-inverse": {
    light: neutralLight[50],
    dark: neutralDark[950],
    description: "Ícones sobre fundos invertidos, que mudam com o tema.",
  },
  "icon-static-white": {
    light: neutralLight[50],
    dark: neutralLight[50],
    description: "Ícone branco nos dois temas: sobre fotos, vídeos ou fundos fixos.",
  },
  "icon-static-black": {
    light: neutralLight[950],
    dark: neutralLight[950],
    description: "Ícone quase preto nos dois temas: sobre fotos, vídeos ou fundos fixos.",
  },
  "icon-primary": {
    light: primary[800],
    dark: primary[400],
    description:
      "Ícone na cor de marca, como o check da opção escolhida do Select. Mesmos passos dos ícones de status.",
  },
  "icon-success": {
    light: green[800],
    dark: green[400],
    description: "Ícone de sucesso: confirmações e validações.",
  },
  "icon-caution": {
    light: yellow[800],
    dark: yellow[400],
    description: "Ícone de atenção leve.",
  },
  "icon-warning": {
    light: orange[700],
    dark: orange[400],
    description: "Ícone de aviso.",
  },
  "icon-danger": {
    light: red[700],
    dark: red[300],
    description: "Ícone de erro. Mesmo tom do text-danger, para ícone e mensagem combinarem.",
  },
  "icon-info": {
    light: blue[700],
    dark: blue[400],
    description: "Ícone de informação.",
  },
  "border-default": {
    light: neutralLight[400],
    dark: neutralDark[400],
    description: "Contorno de campos e controles (contraste mínimo de 3:1).",
  },
  "border-subtle": {
    light: neutralLight[300],
    dark: neutralDark[500],
    description: "Divisórias e contornos decorativos: tabelas, cartões, separadores.",
  },
  "border-disabled": {
    light: neutralLight[200],
    dark: neutralDark[600],
    description: "Contorno de controles desabilitados.",
  },
  "border-success": {
    light: green[800],
    dark: green[400],
    description: "Borda de sucesso: campo validado, aviso de confirmação.",
  },
  "border-caution": {
    light: yellow[800],
    dark: yellow[400],
    description: "Borda de atenção leve.",
  },
  "border-warning": {
    light: orange[700],
    dark: orange[400],
    description: "Borda de aviso.",
  },
  "border-danger": {
    light: red[500],
    dark: red[400],
    description: "Borda de erro: campo inválido, aviso de erro.",
  },
  "border-info": {
    light: blue[700],
    dark: blue[400],
    description: "Borda de informação.",
  },
  "border-focus": {
    light: primary[800],
    dark: primary[600],
    description: "Contorno de foco visível na navegação por teclado.",
  },
} as const satisfies Record<string, ColorToken>;

export type ColorName = keyof typeof color;

/**
 * Pares de cores que aparecem juntos e o contraste mínimo exigido pela WCAG AA:
 * 4.5:1 para texto, 3:1 para ícones, contornos de controles e foco. Elementos
 * desabilitados são isentos na WCAG, mas aqui ficam acima de 3:1 para continuarem legíveis. Os testes verificam
 * todos os pares nos dois temas, e a documentação mostra o primeiro par de cada token.
 */
export const contrastPairs: readonly (readonly [ColorName, ColorName, number])[] = [
  ["text-default", "surface", 4.5],
  ["text-default", "background-neutral", 4.5],
  ["text-default", "background-neutral-hovered", 4.5],
  ["text-default", "background-neutral-pressed", 4.5],
  ["text-danger", "background-neutral", 4.5],
  // Campo de texto (Input): placeholder, borda, ícone e erro sobre o fundo neutro.
  // Exceção consciente: no claro, o placeholder fica com 3.28:1, abaixo dos 4.5:1 da WCAG AA,
  // para o campo vazio não parecer preenchido. Por isso ele só leva exemplos, nunca instruções.
  ["text-placeholder", "background-neutral", 3],
  // border-default é a borda do campo no hover e no foco; em repouso ele usa subtle (exceção consciente).
  ["border-default", "background-neutral", 3],
  ["icon-subtle", "background-neutral", 3],
  // Campo somente leitura: o texto continua com leitura plena.
  ["text-default", "background-readonly", 4.5],
  ["icon-subtle", "background-readonly", 3],
  ["border-danger", "background-neutral", 3],
  // Item escolhido numa lista (Select): nome, segunda linha e ícone continuam legíveis.
  ["text-default", "background-selected", 4.5],
  ["text-subtle", "background-selected", 4.5],
  ["icon-subtle", "background-selected", 3],
  ["text-danger", "background-danger-subtle-hovered", 4.5],
  // Exceção consciente: no claro, o texto fica com 4.2:1 sobre o pressed, abaixo dos 4.5:1
  // da WCAG AA. O estado dura só o instante do clique, e o texto já foi lido no repouso e no hover.
  ["text-danger", "background-danger-subtle-pressed", 3],
  ["text-subtle", "surface", 4.5],
  ["text-link", "surface", 4.5],
  ["text-default", "surface-sunken", 4.5],
  ["text-subtle", "surface-sunken", 4.5],
  ["text-link", "surface-sunken", 4.5],
  ["text-default", "surface-raised", 4.5],
  ["text-subtle", "surface-raised", 4.5],
  ["text-link", "surface-raised", 4.5],
  ["text-default", "surface-overlay", 4.5],
  ["text-subtle", "surface-overlay", 4.5],
  ["text-link", "surface-overlay", 4.5],
  ["icon-default", "surface", 3],
  ["icon-subtle", "surface", 3],
  ["border-default", "surface", 3],
  ["border-focus", "surface", 3],
  ["icon-default", "surface-sunken", 3],
  ["icon-subtle", "surface-sunken", 3],
  ["border-default", "surface-sunken", 3],
  ["border-focus", "surface-sunken", 3],
  ["icon-default", "surface-raised", 3],
  ["icon-subtle", "surface-raised", 3],
  ["border-default", "surface-raised", 3],
  ["border-focus", "surface-raised", 3],
  ["icon-default", "surface-overlay", 3],
  ["icon-subtle", "surface-overlay", 3],
  ["border-default", "surface-overlay", 3],
  ["border-focus", "surface-overlay", 3],
  ["text-disabled", "surface", 3],
  ["icon-disabled", "surface", 3],
  ["text-disabled", "surface-sunken", 3],
  ["icon-disabled", "surface-sunken", 3],
  ["text-disabled", "surface-raised", 3],
  ["icon-disabled", "surface-raised", 3],
  ["text-disabled", "surface-overlay", 3],
  ["icon-disabled", "surface-overlay", 3],
  ["text-success", "surface", 4.5],
  ["text-success", "surface-sunken", 4.5],
  ["text-success", "surface-raised", 4.5],
  ["text-success", "surface-overlay", 4.5],
  ["text-caution", "surface", 4.5],
  ["text-caution", "surface-sunken", 4.5],
  ["text-caution", "surface-raised", 4.5],
  ["text-caution", "surface-overlay", 4.5],
  ["text-warning", "surface", 4.5],
  ["text-warning", "surface-sunken", 4.5],
  ["text-warning", "surface-raised", 4.5],
  ["text-warning", "surface-overlay", 4.5],
  ["text-danger", "surface", 4.5],
  ["text-danger", "surface-sunken", 4.5],
  ["text-danger", "surface-raised", 4.5],
  ["text-danger", "surface-overlay", 4.5],
  ["text-info", "surface", 4.5],
  ["text-info", "surface-sunken", 4.5],
  ["text-info", "surface-raised", 4.5],
  ["text-info", "surface-overlay", 4.5],
  ["border-success", "surface", 3],
  ["border-success", "surface-sunken", 3],
  ["border-success", "surface-raised", 3],
  ["border-success", "surface-overlay", 3],
  ["border-caution", "surface", 3],
  ["border-caution", "surface-sunken", 3],
  ["border-caution", "surface-raised", 3],
  ["border-caution", "surface-overlay", 3],
  ["border-warning", "surface", 3],
  ["border-warning", "surface-sunken", 3],
  ["border-warning", "surface-raised", 3],
  ["border-warning", "surface-overlay", 3],
  ["border-danger", "surface", 3],
  ["border-danger", "surface-sunken", 3],
  ["border-danger", "surface-raised", 3],
  ["border-danger", "surface-overlay", 3],
  ["border-info", "surface", 3],
  ["border-info", "surface-sunken", 3],
  ["border-info", "surface-raised", 3],
  ["border-info", "surface-overlay", 3],
  // Ícone na cor de marca: nas superfícies e sobre o fundo de item escolhido (Select).
  ["icon-primary", "surface", 3],
  ["icon-primary", "surface-sunken", 3],
  ["icon-primary", "surface-raised", 3],
  ["icon-primary", "surface-overlay", 3],
  ["icon-primary", "background-selected", 3],
  ["icon-success", "surface", 3],
  ["icon-success", "surface-sunken", 3],
  ["icon-success", "surface-raised", 3],
  ["icon-success", "surface-overlay", 3],
  ["icon-caution", "surface", 3],
  ["icon-caution", "surface-sunken", 3],
  ["icon-caution", "surface-raised", 3],
  ["icon-caution", "surface-overlay", 3],
  ["icon-warning", "surface", 3],
  ["icon-warning", "surface-sunken", 3],
  ["icon-warning", "surface-raised", 3],
  ["icon-warning", "surface-overlay", 3],
  ["icon-danger", "surface", 3],
  ["icon-danger", "surface-sunken", 3],
  ["icon-danger", "surface-raised", 3],
  ["icon-danger", "surface-overlay", 3],
  ["icon-info", "surface", 3],
  ["icon-info", "surface-sunken", 3],
  ["icon-info", "surface-raised", 3],
  ["icon-info", "surface-overlay", 3],
  // O inverse vai sobre um fundo na cor do texto padrão (escuro no claro, claro no escuro).
  ["text-inverse", "text-default", 4.5],
  ["icon-inverse", "text-default", 3],
];

/**
 * Famílias de fonte. `body` é a fonte padrão de tudo e não precisa de classe;
 * `mono` é aplicada com `font-mono`, para código, valores e nomes técnicos.
 */
export const font = {
  body: fontFamily["dm-sans"],
  mono: fontFamily.mono,
} as const;

/** Pesos de fonte por intenção. */
export const fontWeight = {
  regular: fontWeightScale[400],
  medium: fontWeightScale[500],
  semibold: fontWeightScale[600],
} as const;

export interface TextStyle {
  readonly fontSize: string;
  readonly lineHeight: string;
  readonly fontWeight: string;
  readonly letterSpacing: string;
}

/** Estilos de texto: tamanho, altura de linha, peso e espaçamento entre letras combinados. */
export const text = {
  "body-xs": {
    fontSize: fontSize[10],
    lineHeight: lineHeight[150],
    fontWeight: fontWeight.regular,
    letterSpacing: letterSpacing[0],
  },
  "body-sm": {
    fontSize: fontSize[12],
    lineHeight: lineHeight[150],
    fontWeight: fontWeight.regular,
    letterSpacing: letterSpacing[0],
  },
  "body-md": {
    fontSize: fontSize[14],
    lineHeight: lineHeight[150],
    fontWeight: fontWeight.regular,
    letterSpacing: letterSpacing[0],
  },
  "body-lg": {
    fontSize: fontSize[16],
    lineHeight: lineHeight[150],
    fontWeight: fontWeight.regular,
    letterSpacing: letterSpacing[0],
  },
  "label-xs": {
    fontSize: fontSize[10],
    lineHeight: lineHeight[125],
    fontWeight: fontWeight.medium,
    letterSpacing: letterSpacing[0],
  },
  "label-sm": {
    fontSize: fontSize[12],
    lineHeight: lineHeight[125],
    fontWeight: fontWeight.medium,
    letterSpacing: letterSpacing[0],
  },
  "label-md": {
    fontSize: fontSize[14],
    lineHeight: lineHeight[125],
    fontWeight: fontWeight.medium,
    letterSpacing: letterSpacing[0],
  },
  "label-lg": {
    fontSize: fontSize[16],
    lineHeight: lineHeight[125],
    fontWeight: fontWeight.medium,
    letterSpacing: letterSpacing[0],
  },
  "title-sm": {
    fontSize: fontSize[20],
    lineHeight: lineHeight[125],
    fontWeight: fontWeight.semibold,
    letterSpacing: letterSpacing[0],
  },
  "title-md": {
    fontSize: fontSize[24],
    lineHeight: lineHeight[125],
    fontWeight: fontWeight.semibold,
    letterSpacing: letterSpacing[0],
  },
  "title-lg": {
    fontSize: fontSize[30],
    lineHeight: lineHeight[110],
    fontWeight: fontWeight.semibold,
    letterSpacing: letterSpacing[0],
  },
  display: {
    fontSize: fontSize[48],
    lineHeight: lineHeight[100],
    fontWeight: fontWeight.semibold,
    letterSpacing: letterSpacing[0],
  },
} as const satisfies Record<string, TextStyle>;

/** Durações de animação por velocidade. */
export const duration = {
  instant: durationScale[0],
  fast: durationScale[100],
  base: durationScale[200],
  slow: durationScale[300],
} as const;

export interface GradientToken {
  /**
   * Ângulo do degradê, em graus, como no CSS: 0 aponta para cima e gira no sentido do
   * relógio. 135 é a diagonal que desce da esquerda (claro) para a direita (escuro).
   */
  readonly angle: number;
  readonly from: string;
  readonly to: string;
  readonly description: string;
}

/**
 * Degradês da identidade. São iguais nos dois temas, então o texto por cima usa as
 * cores static (que também não mudam).
 */
export const gradient = {
  brand: {
    angle: 135,
    from: primary[700],
    to: primary[800],
    description: "Fundo do botão primário. Texto e ícone em static-white.",
  },
  "brand-hovered": {
    angle: 135,
    from: primary[800],
    to: primary[900],
    description: "Botão primário com o cursor em cima.",
  },
  "brand-pressed": {
    angle: 135,
    from: primary[900],
    to: primary[950],
    description: "Botão primário pressionado.",
  },
  danger: {
    angle: 135,
    from: red[700],
    to: red[800],
    description: "Fundo do botão destrutivo. Texto e ícone em static-white.",
  },
  "danger-hovered": {
    angle: 135,
    from: red[800],
    to: red[900],
    description: "Botão destrutivo com o cursor em cima.",
  },
  "danger-pressed": {
    angle: 135,
    from: red[900],
    to: red[950],
    description: "Botão destrutivo pressionado.",
  },
} as const satisfies Record<string, GradientToken>;

export type GradientName = keyof typeof gradient;

/** Valor CSS de um degradê: `linear-gradient(135deg, #26bf92, #219381)`. */
export function gradientCss({ angle, from, to }: GradientToken): string {
  return `linear-gradient(${angle}deg, ${from}, ${to})`;
}

/**
 * Sombras internas. `highlight` é um brilho fino no topo, como luz vinda de cima, que dá
 * volume a botões. Soma com as sombras externas: `shadow-sm inset-shadow-highlight`.
 * `sunken` é o oposto: uma sombra suave no topo, por dentro, que afunda a superfície, como o
 * trilho do Switch desligado. Use sem sombra externa.
 */
export const insetShadow = {
  highlight: "inset 0 1px 0 0 rgb(255 255 255 / 0.3)",
  sunken: "inset 0 1px 2px 0 rgb(0 0 0 / 0.15)",
} as const;

/** Sombra de cada superfície elevada. No tema escuro a elevação vem mais da cor. */
export const elevation = {
  raised: shadow.sm,
  overlay: shadow.lg,
} as const;

/**
 * Paletas que podem fazer o papel de marca. A primeira (teal) é a padrão: é para onde o
 * primary aponta. As outras servem para testar a interface com outra cor de marca, trocando
 * o atributo `data-brand` (veja o CSS gerado). Os tokens semânticos de status continuam os
 * mesmos: com marca vermelha, o erro continua vermelho.
 */
export const brandPalettes = { teal, blue, green, orange, red, yellow } as const;

export type BrandName = keyof typeof brandPalettes;

type Palette = Readonly<Record<string, string>>;

/** Os valores do primary, para saber quais tokens vêm da marca. */
const primaryValues = new Set<string>(Object.values(primary));

/** Claridade de uma cor no OKLCH, de 0 (preto) a 1 (branco). */
function lightness(value: string): number {
  return Number(/^oklch\(([\d.]+)/.exec(toOklch(value))?.[1]);
}

/**
 * A cor de outra paleta com a claridade mais parecida, ou o próprio valor quando ele não vem
 * do primary. Pela claridade, e não pelo mesmo passo: as paletas não têm a mesma claridade em
 * cada passo (o 600 do azul é mais escuro que o do teal), e o contraste depende da claridade.
 * Assim o token mantém o papel e o contraste com outra cor. No teal, devolve o mesmo valor.
 */
function rebrand(value: string, palette: Palette): string {
  if (!primaryValues.has(value)) return value;
  const target = lightness(value);
  return Object.values(palette).reduce((best, candidate) =>
    Math.abs(lightness(candidate) - target) < Math.abs(lightness(best) - target) ? candidate : best,
  );
}

/**
 * Os tokens de cor e os degradês que vêm do primary, refeitos com outra paleta, cada um com a
 * cor de claridade mais parecida (veja `rebrand`). Os outros tokens não mudam.
 */
export function brandTokens(name: BrandName): {
  color: Partial<Record<ColorName, ColorToken>>;
  gradient: Partial<Record<GradientName, GradientToken>>;
} {
  const palette = brandPalettes[name];
  const colors = (Object.entries(color) as [ColorName, ColorToken][])
    .filter(([, token]) => primaryValues.has(token.light) || primaryValues.has(token.dark))
    .map(([key, token]) => [
      key,
      { ...token, light: rebrand(token.light, palette), dark: rebrand(token.dark, palette) },
    ]);
  const gradients = (Object.entries(gradient) as [GradientName, GradientToken][])
    .filter(([, token]) => primaryValues.has(token.from) || primaryValues.has(token.to))
    .map(([key, token]) => [
      key,
      { ...token, from: rebrand(token.from, palette), to: rebrand(token.to, palette) },
    ]);
  return { color: Object.fromEntries(colors), gradient: Object.fromEntries(gradients) };
}

/**
 * Modo "mais contraste": um reforço opcional, como o "Aumentar contraste" do iOS e do macOS.
 * O visual padrão não muda. Liga com `data-contrast="more"` ou sozinho, quando o sistema da
 * pessoa pede mais contraste (`prefers-contrast: more`); `data-contrast="standard"` desliga.
 *
 * - `overlay`: camada preta por cima dos degradês da marca. Com 30%, o texto branco passa de
 *   4.5:1 em todas as paletas de marca (no padrão, fica perto de 2.35:1).
 * - As bordas subtle passam a usar a cor de border-default (3:1).
 */
export const contrastMore = {
  overlay: "linear-gradient(rgb(0 0 0 / 0.3), rgb(0 0 0 / 0.3))",
  overlayOpacity: 0.3,
} as const;
