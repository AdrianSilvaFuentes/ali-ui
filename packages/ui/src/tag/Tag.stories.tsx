import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconTag } from "@tabler/icons-react";
import { useRef, useState } from "react";
import { Tag } from "./Tag.tsx";

const colors = ["gray", "teal", "blue", "green", "yellow", "orange", "red"] as const;
const sizes = ["md", "sm"] as const;

const meta = {
  title: "Components/Data display/Tag",
  component: Tag,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Etiqueta retangular para categorizar um item: texto curto, com ícone opcional antes dele. Fundo suave na cor, sombra mínima (shadow-xs), brilho fino no topo (inset-shadow-highlight) e canto pequeno, sem borda: 6px no md e 4px no sm. É texto, não controle: não tem hover, foco nem clique.\n\nSete cores: gray (padrão), teal, blue, green, yellow, orange e red. A cor diz o tipo de conteúdo, não um status: vem dos tokens de categoria (background-category-*, text-category-* e icon-category-*, em Foundations → Colors → Infographics), e não dos de status. Uma tag red não é um erro; para status, use o Badge de status (em breve). Texto e ícone passam no contraste mínimo sobre o fundo de cada cor, nos dois temas.\n\nDois tamanhos: md 24px (padrão), com texto label-sm e ícone de 14px; sm 20px, com o mesmo texto label-sm e ícone de 12px. O ícone é decorativo: o leitor de tela lê só o texto.\n\nCom onRemove, a tag ganha um X no fim: um botão do tamanho da altura da tag, com o nome "Remover" mais o texto (troque com removeLabel). Ele recebe foco com Tab e remove com clique, Enter, espaço, Delete ou Backspace. Depois de remover, leve o foco para outro lugar, como a próxima tag ou o campo de busca, para ele não se perder.',
      },
    },
  },
  args: { children: "Design", color: "gray", size: "md" },
  argTypes: {
    children: { control: "text", description: "O texto da etiqueta." },
    color: {
      control: "inline-radio",
      options: colors,
      description: "A cor da categoria. Diz o tipo de conteúdo, não um status.",
      table: { defaultValue: { summary: "gray" } },
    },
    size: {
      control: "inline-radio",
      options: sizes,
      description: "md 24px com canto de 6px (padrão) ou sm 20px com canto de 4px.",
      table: { defaultValue: { summary: "md" } },
    },
    icon: {
      // Escolha rápida no painel; no código, icon recebe o elemento do ícone.
      control: "inline-radio",
      options: ["Sem ícone", "Com ícone"],
      mapping: { "Sem ícone": undefined, "Com ícone": <IconTag /> },
      description: "Ícone antes do texto. Decorativo; ganha o tamanho e a cor do tom.",
    },
    onRemove: {
      control: false,
      description:
        "Mostra o X no fim e é chamado ao remover (clique, Enter, espaço, Delete ou Backspace).",
    },
    removeLabel: {
      control: "text",
      description: 'O nome do X para o leitor de tela. Padrão: "Remover" mais o texto da tag.',
    },
    className: { control: false },
  },
} satisfies Meta<typeof Tag>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Colors: Story = {
  name: "Tons",
  parameters: {
    docs: {
      description: { story: "As sete cores, sem e com ícone." },
    },
  },
  render: (args) => (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {colors.map((color) => (
          <Tag key={color} {...args} color={color}>
            {color}
          </Tag>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {colors.map((color) => (
          <Tag key={color} {...args} color={color} icon={<IconTag />}>
            {color}
          </Tag>
        ))}
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  name: "Tamanhos",
  parameters: {
    docs: {
      description: { story: "md 24px e sm 20px, sem e com ícone." },
    },
  },
  render: (args) => (
    <div className="flex items-center gap-2">
      {sizes.map((size) => (
        <Tag key={size} {...args} size={size} />
      ))}
      {sizes.map((size) => (
        <Tag key={`${size}-icon`} {...args} size={size} icon={<IconTag />} />
      ))}
    </div>
  ),
};

const filters = ["Design", "Engenharia", "Produto", "Pesquisa"];

export const Removable: Story = {
  name: "Com X de remover",
  parameters: {
    docs: {
      description: {
        story:
          "Clique no X ou use Tab até ele e aperte Enter, espaço, Delete ou Backspace. Depois de remover, o foco vai para a tag seguinte (ou para o botão de restaurar), para não se perder.",
      },
    },
  },
  render: function Render(args) {
    const [items, setItems] = useState(filters);
    const list = useRef<HTMLDivElement>(null);
    const remove = (name: string) => {
      const index = items.indexOf(name);
      setItems(items.filter((item) => item !== name));
      // Foco na tag seguinte; sem ela, na anterior; sem nenhuma, no botão de restaurar.
      requestAnimationFrame(() => {
        const buttons = list.current?.querySelectorAll("button") ?? [];
        (buttons[Math.min(index, buttons.length - 1)] ?? buttons[0])?.focus();
      });
    };
    return (
      <div ref={list} className="flex flex-col items-start gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {items.map((item) => (
            <Tag key={item} {...args} onRemove={() => remove(item)}>
              {item}
            </Tag>
          ))}
        </div>
        {items.length < filters.length ? (
          <button
            type="button"
            className="cursor-pointer text-label-sm text-link underline"
            onClick={() => setItems(filters)}
          >
            Restaurar
          </button>
        ) : null}
      </div>
    );
  },
};

export const RemovableSizesAndColors: Story = {
  name: "Com X: tamanhos e tons",
  parameters: {
    docs: {
      description: { story: "O X em todos os tons, no md e no sm, sem e com ícone." },
    },
  },
  render: (args) => (
    <div className="flex flex-col gap-3">
      {sizes.map((size) => (
        <div key={size} className="flex flex-wrap items-center gap-2">
          {colors.map((color) => (
            <Tag
              key={color}
              {...args}
              size={size}
              color={color}
              icon={color === "gray" ? undefined : <IconTag />}
              onRemove={() => {}}
            >
              {color}
            </Tag>
          ))}
        </div>
      ))}
    </div>
  ),
};
