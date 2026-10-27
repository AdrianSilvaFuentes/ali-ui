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
  letterSpacing,
  lineHeight,
  neutralDark,
  neutralLight,
  primary,
  red,
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
  foreground: {
    light: neutralLight[900],
    dark: neutralDark[50],
    description: "Texto e ícones principais.",
  },
  "muted-foreground": {
    light: neutralLight[600],
    dark: neutralDark[200],
    description: "Texto secundário: legendas, dicas, metadados.",
  },
  border: {
    light: neutralLight[200],
    dark: neutralDark[600],
    description: "Divisórias e contornos decorativos.",
  },
  "border-strong": {
    light: neutralLight[500],
    dark: neutralDark[400],
    description: "Contorno de campos e controles (contraste mínimo de 3:1).",
  },
  "primary-foreground": {
    light: neutralLight[950],
    dark: neutralDark[950],
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
    dark: red[300],
    description: "Erros e ações destrutivas.",
  },
  "danger-foreground": {
    light: neutralLight[50],
    dark: neutralDark[950],
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
  ["foreground", "surface", 4.5],
  ["muted-foreground", "surface", 4.5],
  ["foreground", "surface-sunken", 4.5],
  ["muted-foreground", "surface-sunken", 4.5],
  ["foreground", "surface-raised", 4.5],
  ["muted-foreground", "surface-raised", 4.5],
  ["foreground", "surface-overlay", 4.5],
  ["muted-foreground", "surface-overlay", 4.5],
  ["link", "surface", 4.5],
  ["danger", "surface", 4.5],
  ["link", "surface-raised", 4.5],
  ["danger", "surface-raised", 4.5],
  ["link", "surface-overlay", 4.5],
  ["danger", "surface-overlay", 4.5],
  ["danger-foreground", "danger", 4.5],
  ["border-strong", "surface", 3],
  ["border-strong", "surface-sunken", 3],
  ["border-strong", "surface-raised", 3],
  ["border-strong", "surface-overlay", 3],
  ["focus-ring", "surface", 3],
  ["focus-ring", "surface-raised", 3],
  ["focus-ring", "surface-overlay", 3],
];

/** Famílias de fonte por uso. */
export const font = {
  body: fontFamily["dm-sans"],
  title: fontFamily["dm-sans"],
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
  readonly letterSpacing: string;
}

/** Estilos de texto: tamanho, altura de linha, peso e espaçamento entre letras combinados. */
export const text = {
  caption: {
    fontSize: fontSize[12],
    lineHeight: lineHeight[140],
    fontWeight: fontWeight.regular,
    letterSpacing: letterSpacing[0],
  },
  label: {
    fontSize: fontSize[14],
    lineHeight: lineHeight[125],
    fontWeight: fontWeight.medium,
    letterSpacing: letterSpacing[0],
  },
  "body-sm": {
    fontSize: fontSize[14],
    lineHeight: lineHeight[150],
    fontWeight: fontWeight.regular,
    letterSpacing: letterSpacing[0],
  },
  body: {
    fontSize: fontSize[16],
    lineHeight: lineHeight[150],
    fontWeight: fontWeight.regular,
    letterSpacing: letterSpacing[0],
  },
  "body-lg": {
    fontSize: fontSize[18],
    lineHeight: lineHeight[150],
    fontWeight: fontWeight.regular,
    letterSpacing: letterSpacing[0],
  },
  "title-sm": {
    fontSize: fontSize[20],
    lineHeight: lineHeight[125],
    fontWeight: fontWeight.strong,
    letterSpacing: letterSpacing[0],
  },
  "title-md": {
    fontSize: fontSize[24],
    lineHeight: lineHeight[125],
    fontWeight: fontWeight.strong,
    letterSpacing: letterSpacing[0],
  },
  "title-lg": {
    fontSize: fontSize[30],
    lineHeight: lineHeight[110],
    fontWeight: fontWeight.strong,
    letterSpacing: letterSpacing[0],
  },
  display: {
    fontSize: fontSize[48],
    lineHeight: lineHeight[100],
    fontWeight: fontWeight.strong,
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

/** Sombra de cada superfície elevada. No tema escuro a elevação vem mais da cor. */
export const elevation = {
  raised: shadow.sm,
  overlay: shadow.lg,
} as const;
