/**
 * Tokens semânticos: os nomes que os componentes usam, definidos pelo papel de cada
 * valor ("fundo", "texto", "borda") e não pela aparência ("cinza 200").
 *
 * Cada token aponta para um primitivo. Trocar a identidade é mudar esses apontamentos
 * ou os próprios primitivos, sem tocar em nenhum componente.
 */
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
  "border-default": {
    light: neutralLight[200],
    dark: neutralDark[600],
    description: "Divisórias e contornos decorativos.",
  },
  "border-strong": {
    light: neutralLight[500],
    dark: neutralDark[400],
    description: "Contorno de campos e controles (contraste mínimo de 3:1).",
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
  ["border-strong", "surface", 3],
  ["border-focus", "surface", 3],
  ["icon-default", "surface-sunken", 3],
  ["icon-subtle", "surface-sunken", 3],
  ["border-strong", "surface-sunken", 3],
  ["border-focus", "surface-sunken", 3],
  ["icon-default", "surface-raised", 3],
  ["icon-subtle", "surface-raised", 3],
  ["border-strong", "surface-raised", 3],
  ["border-focus", "surface-raised", 3],
  ["icon-default", "surface-overlay", 3],
  ["icon-subtle", "surface-overlay", 3],
  ["border-strong", "surface-overlay", 3],
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

/** Sombra de cada superfície elevada. No tema escuro a elevação vem mais da cor. */
export const elevation = {
  raised: shadow.sm,
  overlay: shadow.lg,
} as const;
