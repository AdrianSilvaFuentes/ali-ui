/**
 * Sincronização com o Figma: descreve as variáveis que o Figma deve ter e gera um
 * plugin de desenvolvimento que cria ou atualiza essas variáveis no arquivo aberto.
 *
 * O código é a fonte da verdade. Rodar o plugin de novo atualiza os valores, cria o
 * que é novo e remove o que saiu do código, sem duplicar coleções.
 */
import {
  blue,
  green,
  neutralDark,
  neutralLight,
  orange,
  primary,
  red,
  yellow,
} from "./primitives.ts";
import { radius, spacing } from "./scales.ts";
import { type ColorName, color } from "./semantic.ts";

/** Nomes das coleções no Figma. */
export const FIGMA_COLLECTIONS = {
  primitives: "Ali UI · Primitives",
  tokens: "Ali UI · Tokens",
} as const;

/** Onde cada variável pode ser aplicada no Figma (os mesmos limites do código). */
export type FigmaScope =
  | "ALL_SCOPES"
  | "GAP"
  | "WIDTH_HEIGHT"
  | "CORNER_RADIUS"
  | "FRAME_FILL"
  | "SHAPE_FILL"
  | "TEXT_FILL"
  | "STROKE_COLOR";

export interface FigmaPrimitive {
  readonly name: string;
  readonly type: "COLOR" | "FLOAT";
  readonly value: string | number;
  readonly scopes: readonly FigmaScope[];
}

export interface FigmaToken {
  readonly name: string;
  /** Nome do primitivo para onde o token aponta em cada modo. */
  readonly light: string;
  readonly dark: string;
  readonly description: string;
  readonly scopes: readonly FigmaScope[];
}

const colorScales = {
  "neutral-light": neutralLight,
  "neutral-dark": neutralDark,
  primary,
  red,
  green,
  orange,
  yellow,
  blue,
} as const;

const toPx = (value: string) =>
  value.endsWith("rem") ? Number.parseFloat(value) * 16 : Number.parseFloat(value);

/** Primitivos: cores, spacing e radius. */
export function figmaPrimitives(): FigmaPrimitive[] {
  const colors = Object.entries(colorScales).flatMap(([scale, steps]) =>
    Object.entries(steps).map(
      ([step, value]): FigmaPrimitive => ({
        name: `colors/${scale}/${scale}-${step}`,
        type: "COLOR",
        value,
        // Primitivos de cor aparecem em todos os seletores, para explorar cores no Figma.
        // No código os componentes continuam usando só os tokens.
        scopes: ["ALL_SCOPES"],
      }),
    ),
  );
  const spacingSteps = (Object.keys(spacing) as (keyof typeof spacing)[]).sort(
    (a, b) => (a === "px" ? 0.25 : Number(a)) - (b === "px" ? 0.25 : Number(b)),
  );
  const spacings = spacingSteps.map(
    (step): FigmaPrimitive => ({
      // O Figma não aceita ponto no nome: 0.5 vira 0_5.
      name: `spacing/${step.replaceAll(".", "_")}`,
      type: "FLOAT",
      value: toPx(spacing[step]),
      scopes: ["GAP", "WIDTH_HEIGHT"],
    }),
  );
  const radii = (Object.keys(radius) as (keyof typeof radius)[]).map(
    (step): FigmaPrimitive => ({
      name: `radius/${step}`,
      type: "FLOAT",
      value: toPx(radius[step]),
      scopes: ["CORNER_RADIUS"],
    }),
  );
  return [...colors, ...spacings, ...radii];
}

/** Nome do primitivo de cor que tem um valor, como "colors/neutral-light/neutral-light-50". */
function primitiveColorName(value: string): string {
  for (const [scale, steps] of Object.entries(colorScales)) {
    const step = Object.entries(steps).find(([, v]) => v === value)?.[0];
    if (step) return `colors/${scale}/${scale}-${step}`;
  }
  throw new Error(`Cor sem primitivo correspondente: ${value}`);
}

/** Caminho do token no Figma: surface/raised, text/status/success, icon/special/inverse. */
function figmaPath(name: ColorName): string {
  const [group = "", ...rest] = name.split("-");
  const leaf = rest.join("-");
  if (group === "surface") return `surface/${leaf || "default"}`;
  if (/^(success|caution|warning|danger|info)$/.test(leaf)) return `${group}/status/${leaf}`;
  if (/^(inverse|static-white|static-black)$/.test(leaf)) return `${group}/special/${leaf}`;
  return `${group}/${leaf}`;
}

function scopesFor(name: ColorName): FigmaScope[] {
  if (name.startsWith("surface")) return ["FRAME_FILL", "SHAPE_FILL"];
  if (name.startsWith("text-")) return ["TEXT_FILL"];
  if (name.startsWith("icon-")) return ["SHAPE_FILL", "STROKE_COLOR"];
  return ["STROKE_COLOR"];
}

/** Tokens de cor, com o primitivo de cada modo. */
export function figmaTokens(): FigmaToken[] {
  return (Object.keys(color) as ColorName[]).map((name) => ({
    name: figmaPath(name),
    light: primitiveColorName(color[name].light),
    dark: primitiveColorName(color[name].dark),
    description: color[name].description,
    scopes: scopesFor(name),
  }));
}

/** Manifesto do plugin de desenvolvimento. */
export function renderFigmaManifest(): string {
  const manifest = {
    name: "Ali UI · Sincronizar tokens",
    id: "ali-ui-tokens-sync",
    api: "1.0.0",
    main: "code.js",
    editorType: ["figma"],
    documentAccess: "dynamic-page",
  };
  return `${JSON.stringify(manifest, null, 2)}\n`;
}

/** Código do plugin: os dados dos tokens e a rotina que cria ou atualiza as variáveis. */
export function renderFigmaPlugin(): string {
  const data = {
    collections: FIGMA_COLLECTIONS,
    primitives: figmaPrimitives(),
    tokens: figmaTokens(),
  };
  return `// Gerado automaticamente por packages/tokens. Não edite à mão.
const DATA = ${JSON.stringify(data, null, 2)};

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 };
}

async function findOrCreateCollection(name) {
  const all = await figma.variables.getLocalVariableCollectionsAsync();
  return all.find((c) => c.name === name) || figma.variables.createVariableCollection(name);
}

async function variablesIn(collection) {
  const all = await figma.variables.getLocalVariablesAsync();
  return new Map(all.filter((v) => v.variableCollectionId === collection.id).map((v) => [v.name, v]));
}

/** Cria ou atualiza as variáveis de uma coleção e remove as que saíram do código. */
async function sync(collection, items, apply, stats) {
  const existing = await variablesIn(collection);
  const names = new Set();
  const byName = {};
  for (const item of items) {
    names.add(item.name);
    let variable = existing.get(item.name);
    if (variable) stats.updated++;
    else {
      variable = figma.variables.createVariable(item.name, collection, item.type || "COLOR");
      stats.created++;
    }
    apply(variable, item);
    variable.scopes = item.scopes.length ? item.scopes : [];
    byName[item.name] = variable;
  }
  for (const [name, variable] of existing) {
    if (!names.has(name)) {
      variable.remove();
      stats.removed++;
    }
  }
  return byName;
}

async function run() {
  const stats = { created: 0, updated: 0, removed: 0 };

  const primitives = await findOrCreateCollection(DATA.collections.primitives);
  const valueMode = primitives.modes[0].modeId;
  primitives.renameMode(valueMode, "Value");
  const byName = await sync(primitives, DATA.primitives, (variable, item) => {
    variable.setValueForMode(valueMode, item.type === "COLOR" ? hexToRgb(item.value) : item.value);
  }, stats);

  const tokens = await findOrCreateCollection(DATA.collections.tokens);
  const lightMode = tokens.modes[0].modeId;
  tokens.renameMode(lightMode, "Light");
  let darkMode = (tokens.modes.find((m) => m.name === "Dark") || {}).modeId;
  if (!darkMode) {
    try {
      darkMode = tokens.addMode("Dark");
    } catch (error) {
      darkMode = undefined; // Plano gratuito: só um modo por coleção.
    }
  }
  const alias = (name) => {
    const target = byName[name];
    if (!target) throw new Error("Primitivo não encontrado: " + name);
    return figma.variables.createVariableAlias(target);
  };
  await sync(tokens, DATA.tokens, (variable, item) => {
    variable.setValueForMode(lightMode, alias(item.light));
    if (darkMode) variable.setValueForMode(darkMode, alias(item.dark));
    variable.description = item.description;
  }, stats);

  const modes = darkMode ? "Light e Dark" : "só Light (o plano gratuito permite um modo)";
  figma.closePlugin(
    stats.created + " criadas, " + stats.updated + " atualizadas, " + stats.removed + " removidas · " + modes,
  );
}

run().catch((error) => figma.closePlugin("Erro: " + error.message));
`;
}
