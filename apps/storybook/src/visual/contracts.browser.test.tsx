import { IconPlus, IconStar } from "@tabler/icons-react";
import type { ReactNode } from "react";
import { flushSync } from "react-dom";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test } from "vitest";
import {
  Avatar,
  Badge,
  Button,
  Checkbox,
  Input,
  MultiSelect,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectItem,
  Slider,
  Switch,
  Tabs,
  TabsList,
  TabsTrigger,
  Tag,
  Textarea,
  Toggletip,
} from "../../../../packages/ui/src/index.ts";
import "../styles.css";

/**
 * Contratos de medida: o tamanho que cada componente promete, medido num navegador
 * de verdade. Pegam o caso em que o CSS de quem está em volta muda um componente
 * reaproveitado (como o X da Tag que virou 20px dentro do MultiSelect).
 */

document.documentElement.setAttribute("data-theme", "light");

// Sem transições: as partes são medidas no estado final, não no meio de uma animação.
const still = document.createElement("style");
still.textContent = "*,*::before,*::after{transition:none!important;animation:none!important}";
document.head.append(still);

let root: Root | undefined;
let container: HTMLDivElement | undefined;
afterEach(() => {
  root?.unmount();
  container?.remove();
});

function render(node: ReactNode): HTMLElement {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  flushSync(() => root?.render(node));
  return container;
}

function get(scope: ParentNode, selector: string): HTMLElement {
  const el = scope.querySelector<HTMLElement>(selector);
  if (!el) throw new Error(`Não achei "${selector}"`);
  return el;
}

/** Medidas que os contratos comparam, em px. */
function size(el: Element) {
  const rect = el.getBoundingClientRect();
  return { width: Math.round(rect.width * 100) / 100, height: Math.round(rect.height * 100) / 100 };
}
const height = (el: Element) => size(el).height;
const square = (el: Element) => {
  const { width, height } = size(el);
  return width === height ? width : { width, height };
};
const style = (el: Element) => getComputedStyle(el);

describe("Button", () => {
  test.each([
    ["sm", 32, "12px", "8px", 16],
    ["md", 40, "16px", "12px", 20],
  ] as const)("%s", (s, h, px, radius, icon) => {
    const button = get(
      render(
        <Button size={s} iconLeft={<IconPlus />}>
          Salvar
        </Button>,
      ),
      "button",
    );
    expect(height(button)).toBe(h);
    expect(style(button).paddingLeft).toBe(px);
    expect(style(button).borderTopLeftRadius).toBe(radius);
    expect(square(get(button, "svg"))).toBe(icon);
  });
});

describe("Input", () => {
  test.each([
    ["sm", 32, "8px"],
    ["md", 40, "12px"],
  ] as const)("%s", (s, h, radius) => {
    const input = get(render(<Input size={s} aria-label="Nome" />), "input");
    const box = input.parentElement as HTMLElement;
    expect(height(box)).toBe(h);
    expect(style(box).borderTopLeftRadius).toBe(radius);
  });
});

describe("Select", () => {
  test.each([
    ["sm", 32],
    ["md", 40],
  ] as const)("%s trigger", (s, h) => {
    const trigger = get(
      render(
        <Select size={s} aria-label="Fruta" placeholder="Escolha">
          <SelectItem value="a">Maçã</SelectItem>
        </Select>,
      ),
      "[role=combobox]",
    );
    expect(height(trigger)).toBe(h);
  });
});

describe("Textarea", () => {
  test.each([
    ["sm", "8px"],
    ["md", "12px"],
  ] as const)("%s", (s, radius) => {
    const textarea = get(render(<Textarea size={s} aria-label="Nota" />), "textarea");
    expect(style(textarea.parentElement as HTMLElement).borderTopLeftRadius).toBe(radius);
  });
});

/** Tag com ícone e X; devolve as medidas das partes. */
function tagParts(tag: HTMLElement) {
  const remove = get(tag, "button");
  return {
    height: height(tag),
    radius: style(tag).borderTopLeftRadius,
    icon: square(get(tag, "[data-slot=tag-icon] svg")),
    remove: square(remove),
    x: square(get(remove, "svg")),
  };
}

describe("Tag", () => {
  const expected = {
    sm: { height: 20, radius: "4px", icon: 12, remove: 20, x: 12 },
    md: { height: 24, radius: "6px", icon: 14, remove: 24, x: 14 },
  };
  test.each(["sm", "md"] as const)("%s", (s) => {
    const scope = render(
      <Tag size={s} icon={<IconStar />} onRemove={() => {}}>
        Design
      </Tag>,
    );
    expect(tagParts(scope.firstElementChild as HTMLElement)).toEqual(expected[s]);
  });

  // Dentro do MultiSelect a Tag é md nos dois tamanhos de campo, e não pode herdar
  // o tamanho de ícone da caixa do Input.
  test.each([
    ["sm", 32],
    ["md", 40],
  ] as const)("inside a %s MultiSelect keeps its md size", (s, fieldHeight) => {
    const scope = render(
      <MultiSelect
        size={s}
        label="Tags"
        options={[{ value: "a", label: "Design", icon: <IconStar /> }]}
        defaultValue={["a"]}
      />,
    );
    const tag = get(scope, "[data-slot=tag-icon]").parentElement as HTMLElement;
    expect(tagParts(tag)).toEqual(expected.md);
    // A caixa do campo é a primeira acima da tag com data-state (aberta/fechada).
    expect(height(tag.closest("[data-state]") as HTMLElement)).toBe(fieldHeight);
  });
});

describe("Badge", () => {
  test.each([
    ["sm", 20, 12],
    ["md", 24, 14],
  ] as const)("%s", (s, h, icon) => {
    const badge = render(
      <Badge size={s} icon={<IconStar />}>
        Novo
      </Badge>,
    ).firstElementChild as HTMLElement;
    expect(height(badge)).toBe(h);
    expect(square(get(badge, "[data-slot=badge-icon] svg"))).toBe(icon);
  });
});

describe("Avatar", () => {
  test.each([
    ["xs", 20, 14],
    ["sm", 24, 16],
    ["md", 32, 20],
    ["lg", 40, 24],
    ["xl", 48, 32],
  ] as const)("%s", (s, box, icon) => {
    // Sem nome nem foto, o Avatar mostra o ícone de pessoa.
    const avatar = render(<Avatar size={s} />).firstElementChild as HTMLElement;
    expect(square(avatar)).toBe(box);
    expect(square(get(avatar, "svg"))).toBe(icon);
  });
});

describe("Choice controls", () => {
  test("Checkbox box is 16px with a 12px check", () => {
    const box = get(render(<Checkbox aria-label="Aceito" defaultChecked />), "[role=checkbox]");
    expect(square(box)).toBe(16);
    expect(square(get(box, "svg"))).toBe(12);
  });

  test("Radio is 16px with a 6px dot", () => {
    const radio = get(
      render(
        <RadioGroup aria-label="Plano" defaultValue="a">
          <RadioGroupItem value="a" label="A" />
        </RadioGroup>,
      ),
      "[role=radio]",
    );
    expect(square(radio)).toBe(16);
    expect(square(get(radio, ".rounded-full.bg-current"))).toBe(6);
  });

  test("Switch is 28×16 with a 12px thumb", () => {
    const track = get(render(<Switch aria-label="Avisos" />), "[role=switch]");
    expect(size(track)).toEqual({ width: 28, height: 16 });
    expect(square(get(track, ".rounded-full.bg-current"))).toBe(12);
  });

  test("Slider has a 6px track and a 16px thumb", () => {
    const scope = render(<Slider aria-label="Volume" defaultValue={[40]} className="w-xs" />);
    expect(size(get(scope, ".inset-shadow-sunken")).height).toBe(6);
    expect(square(get(scope, "[role=slider]"))).toBe(16);
  });
});

describe("Tabs", () => {
  function tabs(variant: "line" | "segmented") {
    return render(
      <Tabs variant={variant} defaultValue="a">
        <TabsList aria-label="Seções">
          <TabsTrigger value="a">Visão geral</TabsTrigger>
          <TabsTrigger value="b">Ajustes</TabsTrigger>
        </TabsList>
      </Tabs>,
    );
  }

  test("line tab is 32px, with the 1px list line below it", () => {
    const scope = tabs("line");
    expect(size(get(scope, "[role=tab]")).height).toBe(32);
    expect(size(get(scope, "[role=tablist]")).height).toBe(33);
  });

  test("segmented box is 32px with 28px tabs", () => {
    const scope = tabs("segmented");
    expect(size(get(scope, "[role=tablist]")).height).toBe(32);
    expect(size(get(scope, "[role=tab]")).height).toBe(28);
  });
});

describe("Toggletip", () => {
  test("trigger is 24px with a 14px icon", () => {
    const trigger = get(render(<Toggletip>Ajuda</Toggletip>), "button");
    expect(square(trigger)).toBe(24);
    expect(square(get(trigger, "svg"))).toBe(14);
  });
});
