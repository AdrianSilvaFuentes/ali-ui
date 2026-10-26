/**
 * Tokens semânticos: os nomes que os componentes usam, definidos pelo papel de cada
 * valor ("fundo", "texto", "borda") e não pela aparência ("cinza 200").
 *
 * Cada token aponta para um primitivo. Trocar a identidade é mudar esses apontamentos
 * ou os próprios primitivos, sem tocar em nenhum componente.
 */
import {
  accent,
  duration as durationScale,
  fontFamily,
  fontSize,
  fontWeight as fontWeightScale,
  gray,
  lineHeight,
  radius as radiusScale,
  red,
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
    dark: gray[400],
    description: "Texto secundário: legendas, dicas, metadados.",
  },
  border: {
    light: gray[200],
    dark: gray[800],
    description: "Divisórias e contornos decorativos.",
  },
  "border-strong": {
    light: gray[500],
    dark: gray[500],
    description: "Contorno de campos e controles (contraste mínimo de 3:1).",
  },
  accent: {
    light: accent[600],
    dark: accent[400],
    description: "Cor de destaque: ação principal, links, seleção.",
  },
  "accent-hover": {
    light: accent[700],
    dark: accent[300],
    description: "Cor de destaque ao passar o mouse ou pressionar.",
  },
  "accent-foreground": {
    light: gray[50],
    dark: gray[950],
    description: "Texto e ícones sobre a cor de destaque.",
  },
  "focus-ring": {
    light: accent[500],
    dark: accent[400],
    description: "Contorno de foco visível na navegação por teclado.",
  },
  danger: {
    light: red[600],
    dark: red[400],
    description: "Erros e ações destrutivas.",
  },
  "danger-foreground": {
    light: gray[50],
    dark: gray[950],
    description: "Texto e ícones sobre a cor de erro.",
  },
} as const satisfies Record<string, ColorToken>;

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
