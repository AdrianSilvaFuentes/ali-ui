import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconTag } from "@tabler/icons-react";
import { Tag } from "./Tag.tsx";

const tones = ["neutral", "primary", "info", "success", "caution", "warning", "danger"] as const;
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
          "Etiqueta retangular para categorizar um item: texto curto, com ícone opcional antes dele. Fundo suave no tom, sombra mínima (shadow-xs), brilho fino no topo (inset-shadow-highlight) e canto pequeno, sem borda: 6px no md e 4px no sm. É texto, não controle: não tem hover, foco nem clique.\n\nSete tons: neutral (padrão), primary (a cor da marca), info, success, caution, warning e danger. O tom reforça o texto, mas o significado está sempre escrito na etiqueta, nunca só na cor. Texto e ícone passam no contraste mínimo sobre o fundo de cada tom, nos dois temas e em todas as marcas.\n\nDois tamanhos: md 24px (padrão), com texto label-sm e ícone de 14px; sm 20px, com o mesmo texto label-sm e ícone de 12px. O ícone é decorativo: o leitor de tela lê só o texto.",
      },
    },
  },
  args: { children: "Design", tone: "neutral", size: "md" },
  argTypes: {
    children: { control: "text", description: "O texto da etiqueta." },
    tone: {
      control: "inline-radio",
      options: tones,
      description: "A cor da etiqueta. O significado vem do texto, não só da cor.",
      table: { defaultValue: { summary: "neutral" } },
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
    className: { control: false },
  },
} satisfies Meta<typeof Tag>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Tones: Story = {
  name: "Tons",
  parameters: {
    docs: {
      description: { story: "Os sete tons, sem e com ícone." },
    },
  },
  render: (args) => (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {tones.map((tone) => (
          <Tag key={tone} {...args} tone={tone}>
            {tone}
          </Tag>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {tones.map((tone) => (
          <Tag key={tone} {...args} tone={tone} icon={<IconTag />}>
            {tone}
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
