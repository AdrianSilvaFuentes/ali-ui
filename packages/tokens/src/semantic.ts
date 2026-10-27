/**
 * Tokens semânticos: os nomes que os componentes usam, definidos pelo papel de cada
 * valor ("fundo", "texto", "borda") e não pela aparência ("cinza 200").
 *
 * Cada token aponta para um primitivo. Trocar a identidade é mudar esses apontamentos
 * ou os próprios primitivos, sem tocar em nenhum componente.
 */
import {
  duration as durationScale,
  fontFamily,
  fontSize,
  fontWeight as fontWeightScale,
  gray,
  lineHeight,
  primary,
  radius as radiusScale,
  red,
  shadow as shadowScale,
  space,
} from "./primitives.ts";

export type ThemeName = "light" | "dark";

export interface ColorToken {
  readonly light: string;
  readonly dark: string;
  readonly description: string;
}

/** Cores por papel, com um valor para o tema claro e outro para o escuro. */
export const color = {
  background: {
    light: gray[50],
    dark: gray[950],
    description: "Fundo da página.",
  },
  foreground: {
    light: gray[900],
    dark: gray[50],
    description: "Texto e ícones principais.",
  },
  surface: {
    light: gray[100],
    dark: gray[900],
    description: "Fundo de elementos elevados: cartões, menus, diálogos.",
  },
  muted: {
    light: gray[100],
    dark: gray[800],
    description: "Fundo discreto: áreas secundárias e destaque sutil ao passar o mouse.",
  },
  "muted-foreground": {
    light: gray[600],
    dark: gray[300],
    description: "Texto secundário: legendas, dicas, metadados.",
  },
  border: {
    light: gray[200],
    dark: gray[800],
    description: "Divisórias e contornos decorativos.",
  },
  "border-strong": {
    light: gray[500],
    dark: gray[400],
    description: "Contorno de campos e controles (contraste mínimo de 3:1).",
  },
  primary: {
    light: primary[600],
    dark: primary[600],
    description: "Cor de marca: fundo de botões primários e marcadores.",
  },
  "primary-hover": {
    light: primary[700],
    dark: primary[500],
    description: "Cor de marca ao passar o mouse ou pressionar.",
  },
  "primary-foreground": {
    light: gray[950],
    dark: gray[950],
    description: "Texto e ícones sobre a cor de marca.",
  },
  link: {
    light: primary[900],
    dark: primary[600],
    description: "Links e textos na cor de marca.",
  },
  "focus-ring": {
    light: primary[800],
    dark: primary[600],
    description: "Contorno de foco visível na navegação por teclado.",
  },
  danger: {
    light: red[700],
    dark: red[400],
    description: "Erros e ações destrutivas.",
  },
  "danger-foreground": {
    light: gray[50],
    dark: gray[950],
    description: "Texto e ícones sobre a cor de erro.",
  },
} as const satisfies Record<string, ColorToken>;

export type ColorName = keyof typeof color;

/**
 * Pares de cores que aparecem juntos e o contraste mínimo exigido pela WCAG AA:
 * 4.5:1 para texto, 3:1 para contornos de controles e foco. Os testes verificam
 * todos os pares nos dois temas, e a documentação mostra o primeiro par de cada token.
 */
export const contrastPairs: readonly (readonly [ColorName, ColorName, number])[] = [
  ["foreground", "background", 4.5],
  ["muted-foreground", "background", 4.5],
  ["foreground", "surface", 4.5],
  ["muted-foreground", "surface", 4.5],
  ["foreground", "muted", 4.5],
  ["muted-foreground", "muted", 4.5],
  ["link", "background", 4.5],
  ["link", "surface", 4.5],
  ["primary-foreground", "primary", 4.5],
  ["primary-foreground", "primary-hover", 4.5],
  ["danger", "background", 4.5],
  ["danger-foreground", "danger", 4.5],
  ["border-strong", "background", 3],
  ["border-strong", "surface", 3],
  ["focus-ring", "background", 3],
  ["focus-ring", "surface", 3],
];

/** Espaçamentos em tamanhos de camiseta, do menor (3xs) ao maior (4xl). */
export const spacing = {
  "3xs": space[2],
  "2xs": space[4],
  xs: space[8],
  sm: space[12],
  md: space[16],
  lg: space[24],
  xl: space[32],
  "2xl": space[48],
  "3xl": space[64],
  "4xl": space[96],
} as const;

/** Raios de canto por tipo de elemento. */
export const radius = {
  control: radiusScale[4],
  surface: radiusScale[6],
  pill: radiusScale.full,
} as const;

/** Famílias de fonte por uso. */
export const font = {
  body: fontFamily.sans,
  heading: fontFamily.sans,
  mono: fontFamily.mono,
} as const;

/** Pesos de fonte por intenção. */
export const fontWeight = {
  regular: fontWeightScale[400],
  medium: fontWeightScale[500],
  strong: fontWeightScale[600],
} as const;

export interface TextStyle {
  readonly fontSize: string;
  readonly lineHeight: string;
  readonly fontWeight: string;
}

/** Estilos de texto: tamanho, altura de linha e peso combinados. */
export const text = {
  caption: { fontSize: fontSize[12], lineHeight: lineHeight[140], fontWeight: fontWeight.regular },
  label: { fontSize: fontSize[14], lineHeight: lineHeight[125], fontWeight: fontWeight.medium },
  "body-sm": {
    fontSize: fontSize[14],
    lineHeight: lineHeight[150],
    fontWeight: fontWeight.regular,
  },
  body: { fontSize: fontSize[16], lineHeight: lineHeight[150], fontWeight: fontWeight.regular },
  "body-lg": {
    fontSize: fontSize[18],
    lineHeight: lineHeight[150],
    fontWeight: fontWeight.regular,
  },
  "heading-sm": {
    fontSize: fontSize[20],
    lineHeight: lineHeight[125],
    fontWeight: fontWeight.strong,
  },
  "heading-md": {
    fontSize: fontSize[24],
    lineHeight: lineHeight[125],
    fontWeight: fontWeight.strong,
  },
  "heading-lg": {
    fontSize: fontSize[30],
    lineHeight: lineHeight[110],
    fontWeight: fontWeight.strong,
  },
  display: { fontSize: fontSize[48], lineHeight: lineHeight[100], fontWeight: fontWeight.strong },
} as const satisfies Record<string, TextStyle>;

/** Durações de animação por velocidade. */
export const duration = {
  instant: durationScale[0],
  fast: durationScale[100],
  base: durationScale[200],
  slow: durationScale[300],
} as const;

/** Sombras por nível de elevação, do mais baixo (2xs) ao mais alto (2xl). */
export const shadow = {
  "2xs": shadowScale["2xs"],
  xs: shadowScale.xs,
  sm: shadowScale.sm,
  md: shadowScale.md,
  lg: shadowScale.lg,
  xl: shadowScale.xl,
  "2xl": shadowScale["2xl"],
} as const;
