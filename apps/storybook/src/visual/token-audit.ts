import {
  color,
  cssVarName,
  elevation,
  fontWeight,
  gradient,
  insetShadow,
  radius,
  shadow,
  spacing,
  text,
} from "@ali/tokens";

/**
 * Auditoria de tokens: lê os valores calculados pelo navegador e aponta o que não
 * vem das escalas do `@ali/tokens`. Os valores permitidos também são lidos no
 * navegador, com o tema já aplicado, para cair no mesmo formato dos elementos.
 */

export interface Finding {
  element: string;
  property: string;
  value: string;
}

export interface Allowed {
  spacing: Set<string>;
  radius: Set<string>;
  fontSize: Set<string>;
  fontWeight: Set<string>;
  color: Set<string>;
  gradient: Set<string>;
  shadowLayer: Set<string>;
}

const rem = (value: string) =>
  value.endsWith("rem") ? `${Number.parseFloat(value) * 16}px` : value;

/** Valor calculado de `value` numa propriedade, lido num elemento de prova. */
function probe(property: string, values: string[]): string[] {
  const el = document.createElement("div");
  document.body.append(el);
  const style = el.style as unknown as Record<string, string>;
  const out = values.map((value) => {
    style[property] = value;
    return (getComputedStyle(el) as unknown as Record<string, string>)[property] as string;
  });
  el.remove();
  return out;
}

const vars = (group: Parameters<typeof cssVarName>[0], tokens: object) =>
  Object.keys(tokens).map((key) => `var(${cssVarName(group, key)})`);

/** Lê os valores permitidos no tema que estiver aplicado no <html>. */
export function readAllowed(): Allowed {
  const shadows = probe("boxShadow", [
    ...vars("shadow", shadow),
    ...vars("elevation", elevation),
    ...vars("inset-shadow", insetShadow),
  ]);
  return {
    spacing: new Set(Object.values(spacing).map(rem)),
    radius: new Set(Object.values(radius).map(rem)),
    fontSize: new Set(Object.values(text).map((t) => rem(t.fontSize))),
    fontWeight: new Set(Object.values(fontWeight).map(String)),
    color: new Set([...probe("color", vars("color", color)), "rgba(0, 0, 0, 0)"]),
    // Os utilitários de degradê põem a camada de alto contraste na frente do degradê.
    gradient: new Set(
      probe("backgroundImage", [
        ...vars("gradient", gradient),
        ...vars("gradient", gradient).map((v) => `var(--ali-contrast-overlay), ${v}`),
      ]),
    ),
    shadowLayer: new Set(shadows.flatMap(splitLayers)),
  };
}

/** Separa as camadas de um box-shadow, sem cortar as vírgulas de dentro de rgb(). */
function splitLayers(value: string): string[] {
  if (value === "none") return [];
  const layers: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < value.length; i++) {
    const ch = value[i];
    if (ch === "(") depth++;
    else if (ch === ")") depth--;
    else if (ch === "," && depth === 0) {
      layers.push(value.slice(start, i).trim());
      start = i + 1;
    }
  }
  layers.push(value.slice(start).trim());
  return layers;
}

/** Camada vazia que o Tailwind deixa no lugar das sombras não usadas. */
const isEmptyLayer = (layer: string) =>
  /^rgba\(0, 0, 0, 0\)/.test(layer) || /^(inset )?\S+ 0px 0px 0px 0px$/.test(layer);

/** Anel de foco ou de borda: cor de token, sem deslocamento, espessura da escala. */
function isRing(layer: string, allowed: Allowed): boolean {
  const match = layer.match(/^(.*\)) 0px 0px 0px (\S+)( inset)?$/);
  return (
    !!match && allowed.color.has(match[1] as string) && allowed.spacing.has(match[2] as string)
  );
}

const CONTROL =
  "button, input:not([type=hidden]), select, [role=combobox], [role=checkbox], [role=radio], [role=switch], [role=tab], [role=option], [role=menuitem]";

function describe(el: Element, pseudo: string): string {
  const slot = el.getAttribute("data-slot");
  const role = el.getAttribute("role");
  const classes = (el.getAttribute("class") ?? "").split(/\s+/).filter(Boolean).slice(0, 4);
  return [
    el.tagName.toLowerCase(),
    slot ? `[data-slot=${slot}]` : "",
    role ? `[role=${role}]` : "",
    classes.length ? `.${classes.join(".")}` : "",
    pseudo,
  ].join("");
}

const hasOwnText = (el: Element) =>
  [...el.childNodes].some((n) => n.nodeType === Node.TEXT_NODE && n.textContent?.trim());

/** Audita um elemento (e seus ::before/::after) e todos os descendentes. */
export function audit(root: Element, allowed: Allowed): Finding[] {
  const findings: Finding[] = [];
  const elements = [root, ...root.querySelectorAll("*")].filter(
    (el) => !el.closest("svg") || el.tagName.toLowerCase() === "svg",
  );

  for (const el of elements) {
    const isSvg = el.tagName.toLowerCase() === "svg";
    for (const pseudo of isSvg ? [""] : ["", "::before", "::after"]) {
      const s = getComputedStyle(el, pseudo || null);
      if (pseudo && (s.content === "none" || s.content === "normal")) continue;
      if (s.display === "none") continue;
      const name = describe(el, pseudo);
      const flag = (property: string, value: string, ok: boolean) => {
        if (!ok) findings.push({ element: name, property, value });
      };

      // Cor do texto e dos ícones (que usam currentColor).
      if (isSvg || hasOwnText(el)) flag("color", s.color, allowed.color.has(s.color));
      if (isSvg) continue;

      if (hasOwnText(el)) {
        flag("font-size", s.fontSize, allowed.fontSize.has(s.fontSize));
        flag("font-weight", s.fontWeight, allowed.fontWeight.has(s.fontWeight));
      }

      flag("background-color", s.backgroundColor, allowed.color.has(s.backgroundColor));
      if (s.backgroundImage !== "none") {
        flag("background-image", s.backgroundImage, allowed.gradient.has(s.backgroundImage));
      }

      for (const side of ["Top", "Right", "Bottom", "Left"]) {
        const st = s as unknown as Record<string, string>;
        if (st[`border${side}Style`] === "none" || st[`border${side}Width`] === "0px") continue;
        const value = st[`border${side}Color`] as string;
        flag(`border-${side.toLowerCase()}-color`, value, allowed.color.has(value));
      }
      if (s.outlineStyle !== "none" && s.outlineWidth !== "0px") {
        flag("outline-color", s.outlineColor, allowed.color.has(s.outlineColor));
      }

      for (const corner of ["TopLeft", "TopRight", "BottomRight", "BottomLeft"]) {
        const value = (s as unknown as Record<string, string>)[`border${corner}Radius`] as string;
        flag("border-radius", value, allowed.radius.has(value));
      }

      for (const prop of ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"]) {
        const value = (s as unknown as Record<string, string>)[prop] as string;
        flag(
          prop.replace(/[A-Z]/, (c) => `-${c.toLowerCase()}`),
          value,
          allowed.spacing.has(value),
        );
      }
      for (const prop of ["rowGap", "columnGap"] as const) {
        const value = s[prop];
        if (value === "normal") continue;
        flag(prop === "rowGap" ? "row-gap" : "column-gap", value, allowed.spacing.has(value));
      }

      for (const layer of splitLayers(s.boxShadow)) {
        if (isEmptyLayer(layer)) continue;
        flag("box-shadow", layer, allowed.shadowLayer.has(layer) || isRing(layer, allowed));
      }

      // Altura só de controles com caixa visível. Um <input> sem borda nem fundo é o
      // miolo de um campo: quem tem a altura é a caixa em volta dele.
      const hasBox =
        s.borderTopWidth !== "0px" ||
        s.backgroundColor !== "rgba(0, 0, 0, 0)" ||
        s.backgroundImage !== "none";
      if (!pseudo && hasBox && el.matches(CONTROL)) {
        flag("height", s.height, allowed.spacing.has(s.height));
      }
    }
  }
  return findings;
}
