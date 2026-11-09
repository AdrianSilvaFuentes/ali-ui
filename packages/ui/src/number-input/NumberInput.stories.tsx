import type { Meta, StoryObj } from "@storybook/react-vite";
import { NumberInput } from "./NumberInput.tsx";

const meta = {
  title: "Components/Form/NumberInput",
  component: NumberInput,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Campo de número com os botões − e + nas pontas: quantidade, pessoas, dias. Use quando o número é pequeno e muda de um em um; para escolher dentro de uma faixa arrastando, use o Slider.\n\nA caixa é a do Input, com a mesma altura, borda, foco, erro e desabilitado. Os botões têm a altura do campo e ficam separados do número por uma linha border-subtle. No hover, ganham o fundo neutral-hovered. Nos limites (min e max), o botão daquele lado fica desabilitado.\n\nPelo teclado, o Tab chega no campo, as setas para cima e para baixo somam um passo, Page Up e Page Down somam dez, Home e End vão ao mínimo e ao máximo. Os botões ficam fora do Tab, porque as setas fazem o mesmo; o leitor de tela os acha pelo nome (Diminuir, Aumentar). Dá para digitar com vírgula ou ponto nos decimais: ao sair do campo, o número é conferido e trazido para dentro dos limites. O formulário recebe o número com ponto (1.5).\n\nO campo tem largura própria, do tamanho do conteúdo: 64px para o número (w-16), cerca de 5 dígitos, mais os dois botões. No total, 126px no sm e 142px no md. Ele não estica com a linha do formulário, porque um número pequeno num campo largo fica perdido no meio.",
      },
    },
  },
  args: {
    label: "Pessoas no time",
    labelInfo: "Contamos você também.",
    description: "De 1 a 20 pessoas.",
    defaultValue: 3,
    min: 1,
    max: 20,
    step: 1,
    size: "md",
    disabled: false,
  },
  argTypes: {
    label: { control: "text", description: "Nome do campo, ligado ao input." },
    labelInfo: {
      control: "text",
      description: "Ajuda extra num ícone de info no fim do label, que abre um Toggletip.",
    },
    description: { control: "text", description: "Texto de ajuda abaixo do campo." },
    error: {
      control: "text",
      description: "Mensagem de erro. Substitui a ajuda e aparece com ícone.",
    },
    defaultValue: { control: "number", description: "O número ao abrir." },
    min: { control: "number", description: "Menor valor. O botão − para nele." },
    max: { control: "number", description: "Maior valor. O botão + para nele." },
    step: {
      control: "number",
      description: "Quanto cada botão ou seta soma.",
      table: { defaultValue: { summary: "1" } },
    },
    size: {
      control: "inline-radio",
      options: ["sm", "md"],
      description: "Altura: sm tem 32px, md tem 40px, como o Input.",
      table: { defaultValue: { summary: "md" } },
    },
    disabled: {
      control: "boolean",
      description: "Desabilita o campo e os botões.",
      table: { defaultValue: { summary: "false" } },
    },
    readOnly: { control: "boolean", description: "Só leitura: mostra o número sem deixar mudar." },
    className: {
      control: false,
      description: "Classes do bloco inteiro. O campo tem largura própria.",
    },
  },
} satisfies Meta<typeof NumberInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  name: "Tamanhos",
  render: (args) => (
    <div className="flex flex-col gap-4">
      <NumberInput
        {...args}
        size="sm"
        label="Pequeno (sm)"
        labelInfo={undefined}
        description={undefined}
      />
      <NumberInput
        {...args}
        size="md"
        label="Médio (md)"
        labelInfo={undefined}
        description={undefined}
      />
    </div>
  ),
};

export const Decimals: Story = {
  name: "Decimais",
  args: {
    label: "Peso do pacote (kg)",
    labelInfo: undefined,
    description: "Digite com vírgula ou use os botões, de 0,5 em 0,5.",
    defaultValue: 1.5,
    min: 0.5,
    max: 30,
    step: 0.5,
  },
};

export const AtLimit: Story = {
  name: "No limite",
  args: {
    label: "Pessoas no time",
    labelInfo: undefined,
    description: "No mínimo: o botão − fica desabilitado.",
    defaultValue: 1,
  },
};

export const WithError: Story = {
  name: "Com erro",
  args: {
    label: "Dias de férias",
    labelInfo: undefined,
    defaultValue: 35,
    max: undefined,
    error: "O máximo é 30 dias por ano.",
  },
};

export const Disabled: Story = {
  name: "Desabilitado",
  args: { disabled: true, labelInfo: undefined, description: undefined },
};
