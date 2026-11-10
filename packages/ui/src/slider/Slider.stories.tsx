import type { Meta, StoryObj } from "@storybook/react-vite";
import { Slider } from "./Slider.tsx";

const meta = {
  title: "Components/Form/Slider",
  component: Slider,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Escolhe um número, ou uma faixa entre dois, arrastando: volume, preço, tamanho. Uma bolinha para um valor (defaultValue={[40]}), duas para uma faixa (defaultValue={[20, 80]}). Use quando o número exato importa menos que a posição dentro de um limite; para digitar um valor preciso, use o Input.\n\nO valor escolhido aparece no fim da linha do label e acompanha o arrasto. Com formatValue, ele ganha unidade (R$ 40, 12px), na tela e no leitor de tela. Pelo teclado, o Tab chega em cada bolinha, as setas andam um passo, Page Up e Page Down andam dez, Home e End vão às pontas. Com duas bolinhas, o leitor de tela ouve o label mais o nome da bolinha: Preço mínimo, Preço máximo.\n\nO trilho tem 6px e é afundado como o Switch desligado: fundo neutral-pressed e inset-shadow-sunken. A parte escolhida usa o degradê de marca do Switch ligado. A bolinha tem 16px, branca e elevada, com shadow-sm e contorno border-subtle, que escurece no hover e no foco. O foco é o mesmo do Button. Label, ajuda, erro e labelInfo funcionam como no Input. O valor aparece em número, nunca só pela cor.",
      },
    },
  },
  args: {
    label: "Volume dos avisos",
    labelInfo: "Os alarmes de segurança tocam sempre no máximo.",
    description: "Vale para todos os avisos do app.",
    defaultValue: [40],
    min: 0,
    max: 100,
    step: 1,
    showValue: true,
    disabled: false,
    className: "w-xs",
  },
  argTypes: {
    label: { control: "text", description: "Nome do controle, acima do trilho." },
    labelInfo: {
      control: "text",
      description: "Ajuda extra num ícone de info no fim do label, que abre um Toggletip.",
    },
    description: { control: "text", description: "Texto de ajuda abaixo do trilho." },
    error: {
      control: "text",
      description: "Mensagem de erro. Substitui a ajuda e aparece com ícone.",
    },
    defaultValue: {
      control: "object",
      description: "Valor inicial. Um número para uma bolinha, dois para uma faixa.",
    },
    min: {
      control: "number",
      description: "Menor valor.",
      table: { defaultValue: { summary: "0" } },
    },
    max: {
      control: "number",
      description: "Maior valor.",
      table: { defaultValue: { summary: "100" } },
    },
    step: {
      control: "number",
      description: "Tamanho de cada passo.",
      table: { defaultValue: { summary: "1" } },
    },
    minStepsBetweenThumbs: {
      control: "number",
      description: "Com duas bolinhas, quantos passos no mínimo entre elas.",
    },
    showValue: {
      control: "boolean",
      description: "Mostra o valor no fim da linha do label.",
      table: { defaultValue: { summary: "true" } },
    },
    formatValue: {
      control: false,
      description: "Como escrever cada valor, com unidade: R$ 40, 12px, 50%.",
    },
    thumbLabels: {
      control: "object",
      description: "Nome de cada bolinha para o leitor de tela. Padrão: mínimo e máximo.",
    },
    disabled: {
      control: "boolean",
      description: "Desabilita o slider.",
      table: { defaultValue: { summary: "false" } },
    },
    className: { control: false, description: "Classes do bloco inteiro, por exemplo a largura." },
  },
} satisfies Meta<typeof Slider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Range: Story = {
  name: "Faixa",
  args: {
    label: "Preço por mês",
    labelInfo: undefined,
    description: "Mostra só os planos dentro da faixa.",
    defaultValue: [20, 80],
    max: 200,
    step: 10,
    minStepsBetweenThumbs: 1,
    formatValue: (v: number) => `R$ ${v}`,
  },
};

export const WithError: Story = {
  name: "Com erro",
  args: {
    label: "Limite de envios por dia",
    labelInfo: undefined,
    defaultValue: [90],
    error: "No plano Grátis, o limite é 50 por dia.",
  },
};

export const Disabled: Story = {
  name: "Desabilitado",
  render: (args) => (
    <div className="flex w-xs flex-col gap-6">
      <Slider
        {...args}
        disabled
        label="Desabilitado"
        labelInfo={undefined}
        description={undefined}
      />
      <Slider
        {...args}
        disabled
        defaultValue={[20, 80]}
        label="Desabilitado, com faixa"
        labelInfo={undefined}
        description={undefined}
      />
    </div>
  ),
};

export const Settings: Story = {
  name: "Ajustes de texto",
  parameters: {
    docs: {
      description: {
        story: "O uso mais comum: valores que mudam algo na hora, com unidade no número.",
      },
    },
  },
  render: () => (
    <div className="flex w-xs flex-col gap-6">
      <Slider
        label="Tamanho da fonte"
        defaultValue={[16]}
        min={12}
        max={24}
        formatValue={(v) => `${v}px`}
      />
      <Slider
        label="Altura da linha"
        defaultValue={[150]}
        min={100}
        max={200}
        step={10}
        formatValue={(v) => `${v}%`}
      />
    </div>
  ),
};
