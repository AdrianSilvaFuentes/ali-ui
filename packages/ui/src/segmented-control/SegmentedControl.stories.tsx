import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconLayoutGrid, IconList } from "@tabler/icons-react";
import { SegmentedControl, SegmentedControlItem } from "./SegmentedControl.tsx";

const meta = {
  title: "Components/Form/SegmentedControl",
  component: SegmentedControl,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Uma escolha entre poucas opções curtas, lado a lado: Dia, Semana, Mês. Funciona como o RadioGroup, num formato compacto: para o leitor de tela, é um grupo de rádio, e ele ouve 1 de 3. Use com duas a cinco opções de uma ou duas palavras; com mais, ou com textos longos, use o RadioGroup ou o Select. Para trocar o conteúdo da tela, use as Tabs.\n\nO visual é o mesmo das Tabs segmented: uma caixa afundada (surface-sunken e inset-shadow-sunken) e um fundo elevado, com borda, shadow-xs e o brilho no topo, que desliza até a opção escolhida em 200ms (duration-base). Quem pede menos movimento vê a troca direta. A escolhida aparece pelo fundo, não só pela cor do texto.\n\nDois tamanhos, com a mesma altura e o mesmo canto do Input e do Button: sm tem 32px, md tem 40px. Com fullWidth, as opções dividem a largura toda. Pelo teclado, o Tab entra na opção escolhida e as setas trocam a opção. Label, ajuda, erro e labelInfo funcionam como no RadioGroup; com erro, a caixa ganha um contorno vermelho e a mensagem aparece com ícone.",
      },
    },
  },
  args: {
    label: "Período",
    labelInfo: "A semana começa na segunda.",
    description: "Os gráficos mostram este período.",
    defaultValue: "week",
    size: "md",
    fullWidth: false,
    disabled: false,
    children: null,
  },
  argTypes: {
    label: { control: "text", description: "Nome do campo, acima das opções." },
    labelInfo: {
      control: "text",
      description: "Ajuda extra num ícone de info no fim do label, que abre um Toggletip.",
    },
    description: { control: "text", description: "Texto de ajuda abaixo das opções." },
    error: {
      control: "text",
      description: "Mensagem de erro. Substitui a ajuda e aparece com ícone.",
    },
    size: {
      control: "inline-radio",
      options: ["sm", "md"],
      description: "Altura: sm tem 32px, md tem 40px, como o Input.",
      table: { defaultValue: { summary: "md" } },
    },
    fullWidth: {
      control: "boolean",
      description: "As opções dividem a largura toda.",
      table: { defaultValue: { summary: "false" } },
    },
    disabled: {
      control: "boolean",
      description: "Desabilita todas as opções.",
      table: { defaultValue: { summary: "false" } },
    },
    defaultValue: { control: "text", description: "A opção escolhida ao abrir." },
    children: { control: false, description: "Um SegmentedControlItem para cada opção." },
    className: { control: false, description: "Classes do bloco inteiro." },
  },
  render: (args) => (
    <SegmentedControl {...args}>
      <SegmentedControlItem value="day">Dia</SegmentedControlItem>
      <SegmentedControlItem value="week">Semana</SegmentedControlItem>
      <SegmentedControlItem value="month">Mês</SegmentedControlItem>
    </SegmentedControl>
  ),
} satisfies Meta<typeof SegmentedControl>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  name: "Tamanhos",
  render: (args) => (
    <div className="flex flex-col gap-6">
      {(["sm", "md"] as const).map((size) => (
        <SegmentedControl
          key={size}
          {...args}
          size={size}
          label={size === "sm" ? "Pequeno (sm)" : "Médio (md)"}
          labelInfo={undefined}
          description={undefined}
        >
          <SegmentedControlItem value="day">Dia</SegmentedControlItem>
          <SegmentedControlItem value="week">Semana</SegmentedControlItem>
          <SegmentedControlItem value="month">Mês</SegmentedControlItem>
        </SegmentedControl>
      ))}
    </div>
  ),
};

export const FullWidth: Story = {
  name: "Largura toda",
  args: { fullWidth: true, className: "w-sm" },
};

export const WithIcons: Story = {
  name: "Com ícones",
  parameters: {
    docs: {
      description: {
        story:
          "Com icon, o ícone vai à esquerda do texto, com 16px, e fica escondido do leitor de tela, que lê o texto. Só com ícone, deixe a opção sem texto e passe um aria-label, para o leitor de tela ter o que ler.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <SegmentedControl label="Visualização" defaultValue="list" size="sm">
        <SegmentedControlItem value="list" icon={<IconList />}>
          Lista
        </SegmentedControlItem>
        <SegmentedControlItem value="grid" icon={<IconLayoutGrid />}>
          Grade
        </SegmentedControlItem>
      </SegmentedControl>
      <SegmentedControl label="Só ícones" defaultValue="grid" size="sm">
        <SegmentedControlItem value="list" aria-label="Lista" icon={<IconList />} />
        <SegmentedControlItem value="grid" aria-label="Grade" icon={<IconLayoutGrid />} />
      </SegmentedControl>
    </div>
  ),
};

export const WithError: Story = {
  name: "Com erro",
  args: {
    label: "Cobrança",
    labelInfo: undefined,
    defaultValue: undefined,
    error: "Escolha como quer pagar.",
  },
  render: (args) => (
    <SegmentedControl {...args}>
      <SegmentedControlItem value="monthly">Mensal</SegmentedControlItem>
      <SegmentedControlItem value="yearly">Anual</SegmentedControlItem>
    </SegmentedControl>
  ),
};

export const Disabled: Story = {
  name: "Desabilitado",
  args: { disabled: true, labelInfo: undefined, description: undefined },
};
