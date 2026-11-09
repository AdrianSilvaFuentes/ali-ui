import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  IconAlertTriangle,
  IconCircleCheck,
  IconCircleX,
  IconClock,
  IconInfoCircle,
  IconPoint,
} from "@tabler/icons-react";
import type { ReactNode } from "react";
import { Tag } from "../tag/Tag.tsx";
import { Badge } from "./Badge.tsx";

const tones = ["neutral", "info", "success", "caution", "warning", "danger"] as const;
const sizes = ["md", "sm"] as const;

/** Um exemplo de texto e ícone por tom. */
const examples: Record<(typeof tones)[number], { label: string; icon: ReactNode }> = {
  neutral: { label: "Rascunho", icon: <IconPoint /> },
  info: { label: "Novo", icon: <IconInfoCircle /> },
  success: { label: "Ativo", icon: <IconCircleCheck /> },
  caution: { label: "Pendente", icon: <IconClock /> },
  warning: { label: "Expira em breve", icon: <IconAlertTriangle /> },
  danger: { label: "Falhou", icon: <IconCircleX /> },
};

const meta = {
  title: "Components/Data display/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Pílula que mostra o status de um item: texto curto, com ícone opcional à esquerda. Fundo suave no tom, canto totalmente redondo, sombra mínima (shadow-xs) e brilho fino no topo (inset-shadow-highlight), sem borda. É texto, não controle: não tem hover, foco nem clique.\n\nSeis tons: neutral (padrão), info, success, caution, warning e danger. Aqui a cor tem significado: vem dos tokens de status (background-*-subtle, text-* e icon-*). Para dizer o tipo de conteúdo, use a Tag, que é retangular e usa as cores de categoria. A cor nunca é o único sinal: o texto diz o status, e o ícone pode reforçar. Texto e ícone passam no contraste mínimo sobre o fundo de cada tom, nos dois temas.\n\nDois tamanhos, iguais aos da Tag: md 24px (padrão), com texto label-sm e ícone de 14px; sm 20px, com o mesmo texto e ícone de 12px. O ícone é decorativo: o leitor de tela lê só o texto.",
      },
    },
  },
  args: { children: "Ativo", tone: "neutral", size: "md" },
  argTypes: {
    children: { control: "text", description: "O texto do status." },
    tone: {
      control: "inline-radio",
      options: tones,
      description: "O tom do status. A cor reforça o texto, nunca o substitui.",
      table: { defaultValue: { summary: "neutral" } },
    },
    size: {
      control: "inline-radio",
      options: sizes,
      description: "md 24px (padrão) ou sm 20px.",
      table: { defaultValue: { summary: "md" } },
    },
    icon: {
      // Escolha rápida no painel; no código, icon recebe o elemento do ícone.
      control: "inline-radio",
      options: ["Sem ícone", "Com ícone"],
      mapping: { "Sem ícone": undefined, "Com ícone": <IconCircleCheck /> },
      description: "Ícone à esquerda do texto. Decorativo; ganha o tamanho e a cor do tom.",
    },
    className: { control: false },
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Tones: Story = {
  name: "Tons",
  parameters: {
    docs: { description: { story: "Os seis tons, sem e com ícone." } },
  },
  render: (args) => (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {tones.map((tone) => (
          <Badge key={tone} {...args} tone={tone}>
            {examples[tone].label}
          </Badge>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {tones.map((tone) => (
          <Badge key={tone} {...args} tone={tone} icon={examples[tone].icon}>
            {examples[tone].label}
          </Badge>
        ))}
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  name: "Tamanhos",
  parameters: {
    docs: { description: { story: "md 24px e sm 20px, sem e com ícone." } },
  },
  render: (args) => (
    <div className="flex flex-col gap-3">
      {sizes.map((size) => (
        <div key={size} className="flex items-center gap-2">
          <Badge {...args} size={size} tone="success">
            Ativo
          </Badge>
          <Badge {...args} size={size} tone="success" icon={<IconCircleCheck />}>
            Ativo
          </Badge>
        </div>
      ))}
    </div>
  ),
};

export const WithTag: Story = {
  name: "Ao lado da Tag",
  parameters: {
    docs: {
      description: {
        story:
          "A Tag diz o tipo (retangular, cor de categoria); o Badge diz o estado (pílula, cor de status). Mesma altura, para ficarem lado a lado.",
      },
    },
  },
  render: (args) => (
    <div className="flex items-center gap-2">
      <Tag color="blue">Design</Tag>
      <Badge {...args} tone="caution" icon={<IconClock />}>
        Em revisão
      </Badge>
    </div>
  ),
};
