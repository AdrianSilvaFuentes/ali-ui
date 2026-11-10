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
  Chip,
  Combobox,
  FileUpload,
  Input,
  MultiSelect,
  NumberInput,
  RadioGroup,
  RadioGroupItem,
  SegmentedControl,
  SegmentedControlItem,
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

describe("Chip", () => {
  test.each([
    ["sm", 24, 20],
    ["md", 28, 24],
  ] as const)("%s chip is %ipx with a %ipx avatar and a 14px X", (s, chip, avatar) => {
    const scope = render(<Chip name="Lia Martins" size={s} onRemove={() => {}} />);
    const pill = scope.firstElementChild as HTMLElement;
    expect(size(pill).height).toBe(chip);
    expect(square(get(pill, "[aria-hidden] > span"))).toBe(avatar);
    expect(square(get(pill, "button"))).toBe(14);
    expect(square(get(pill, "button svg"))).toBe(14);
    // Contorno por dentro: o avatar fica a 2px da borda de fora, e o X a 6px.
    const box = pill.getBoundingClientRect();
    expect(get(pill, "[aria-hidden] > span").getBoundingClientRect().left - box.left).toBe(2);
    expect(box.right - get(pill, "button").getBoundingClientRect().right).toBe(6);
  });

  test.each([
    ["sm", 8],
    ["md", 10],
  ] as const)("%s chip without X ends %ipx after the name", (s, right) => {
    const scope = render(<Chip name="Lia Martins" size={s} />);
    const pill = scope.firstElementChild as HTMLElement;
    expect(getComputedStyle(pill).paddingRight).toBe(`${right}px`);
    expect(getComputedStyle(pill).borderRightWidth).toBe("0px");
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

describe("Combobox", () => {
  test.each([
    ["sm", 32],
    ["md", 40],
  ] as const)("%s field is %ipx, like the Input, with a 20px arrow", (s, box) => {
    const scope = render(
      <Combobox aria-label="País" size={s} options={[{ value: "br", label: "Brasil" }]} />,
    );
    const field = get(scope, "[role=combobox]").parentElement as HTMLElement;
    expect(size(field).height).toBe(box);
    expect(square(get(field, "svg"))).toBe(20);
  });
});

describe("FileUpload", () => {
  test("drop area is 128px; file row is 40px with a 32px square X and 20px icons", () => {
    const scope = render(
      <FileUpload
        aria-label="Anexos"
        defaultValue={[new File(["x"], "contrato.pdf", { type: "application/pdf" })]}
      />,
    );
    const row = get(scope, "li");
    expect(size(row).height).toBe(40);
    expect(size(get(row, "button"))).toEqual({ width: 32, height: 32 });
    expect(square(get(row, "svg"))).toBe(20);
    const zone = get(scope, "button[aria-label=Anexos]");
    expect(size(zone).height).toBe(128);
    expect(square(get(zone, "svg"))).toBe(20);
  });
});

describe("NumberInput", () => {
  test.each([
    ["sm", 32, 126],
    ["md", 40, 142],
  ] as const)("%s box is %ipx tall (like the Input) and %ipx wide", (s, box, width) => {
    const scope = render(<NumberInput aria-label="Pessoas" defaultValue={3} size={s} />);
    const field = get(scope, "[role=spinbutton]").parentElement as HTMLElement;
    // Largura própria: 64px para o número, os dois botões e a borda.
    expect(size(field)).toEqual({ width, height: box });
    // Os botões ficam dentro da borda de 1px: 2px a menos que a caixa.
    const button = get(scope, "button");
    expect(size(button)).toEqual({ width: box - 2, height: box - 2 });
    expect(square(get(button, "svg"))).toBe(16);
  });
});

describe("SegmentedControl", () => {
  test.each([
    ["sm", 32, 28],
    ["md", 40, 36],
  ] as const)("%s box is %ipx with %ipx options, like the Input", (s, box, item) => {
    const scope = render(
      <SegmentedControl aria-label="Período" defaultValue="a" size={s}>
        <SegmentedControlItem value="a">Dia</SegmentedControlItem>
        <SegmentedControlItem value="b">Semana</SegmentedControlItem>
      </SegmentedControl>,
    );
    expect(size(get(scope, "[role=radiogroup]")).height).toBe(box);
    expect(size(get(scope, "[role=radio]")).height).toBe(item);
    // O fundo elevado tem a altura da opção.
    expect(size(get(scope, "[role=radiogroup] > [aria-hidden]")).height).toBe(item);
  });
});

describe("Toggletip", () => {
  test("trigger is 24px with a 14px icon", () => {
    const trigger = get(render(<Toggletip>Ajuda</Toggletip>), "button");
    expect(square(trigger)).toBe(24);
    expect(square(get(trigger, "svg"))).toBe(14);
  });
});
