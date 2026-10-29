import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioGroup, RadioGroupItem } from "./RadioGroup.tsx";

const meta = {
  title: "Components/Form/RadioGroup",
  component: RadioGroup,
  subcomponents: { RadioGroupItem },
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Grupo de opções em que só uma pode ser escolhida, como um plano ou uma forma de entrega. Para várias escolhas ao mesmo tempo, use o Checkbox. Clicar no texto da opção também escolhe. Pelo teclado, o Tab entra no grupo, direto na opção marcada, e as setas trocam a opção.\n\nCada opção é uma bolinha de 16px com a mesma borda, foco, camada verde e hover do Checkbox. Ao escolher, o ponto branco cresce do centro (duration-fast); o da opção anterior some num fade. Quem pede menos movimento vê o ponto pronto.\n\nO grupo tem título (label), com labelInfo opcional, ajuda e erro abaixo das opções. Com erro, a mensagem substitui a ajuda, aparece com ícone e as bolinhas ganham borda vermelha: escreva o erro dizendo o que falta. Cada opção pode ter a própria ajuda, em body-md, a 2px do label.\n\nComo no Input e no Checkbox, exceção consciente: em repouso a borda da bolinha é subtle, abaixo dos 3:1 da WCAG, e escurece no hover e no foco. Por isso cada opção tem sempre um label visível.",
      },
    },
  },
  args: {
    label: "Plano",
    labelInfo: "A cobrança é mensal. Dá para trocar de plano quando quiser.",
    description: "Você pode trocar depois, em Assinatura.",
    defaultValue: "pro",
    orientation: "vertical",
    disabled: false,
    children: null,
  },
  argTypes: {
    label: { control: "text", description: "Título do grupo." },
    labelInfo: {
      control: "text",
      description: "Ajuda extra num ícone de info no fim do título, que abre um Toggletip.",
    },
    description: { control: "text", description: "Texto de ajuda abaixo das opções." },
    error: {
      control: "text",
      description: "Mensagem de erro. Substitui a ajuda e deixa as bolinhas em vermelho.",
    },
    orientation: {
      control: "inline-radio",
      options: ["vertical", "horizontal"],
      description: "Opções uma embaixo da outra (padrão) ou lado a lado.",
      table: { defaultValue: { summary: "vertical" } },
    },
    disabled: {
      control: "boolean",
      description: "Desabilita o grupo inteiro.",
      table: { defaultValue: { summary: "false" } },
    },
    defaultValue: { control: "text", description: "Opção marcada no começo (sem controlar)." },
    children: { control: false, description: "As opções: um RadioGroupItem para cada." },
    className: { control: false, description: "Classes do bloco inteiro." },
  },
  render: (args) => (
    <RadioGroup {...args} className="w-xs">
      <RadioGroupItem value="free" label="Grátis" description="Um projeto, sem colaboradores." />
      <RadioGroupItem
        value="pro"
        label="Pro"
        description="Projetos ilimitados, até 5 pessoas."
        labelInfo="O mais escolhido por times pequenos."
      />
      <RadioGroupItem
        value="team"
        label="Time"
        description="Para empresas, com suporte dedicado."
      />
    </RadioGroup>
  ),
} satisfies Meta<typeof RadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Horizontal: Story = {
  name: "Lado a lado",
  args: {
    label: "Tema",
    labelInfo: undefined,
    description: undefined,
    defaultValue: "claro",
    orientation: "horizontal",
  },
  render: (args) => (
    <RadioGroup {...args}>
      <RadioGroupItem value="claro" label="Claro" />
      <RadioGroupItem value="escuro" label="Escuro" />
      <RadioGroupItem value="sistema" label="Do sistema" />
    </RadioGroup>
  ),
};

export const WithError: Story = {
  name: "Com erro",
  args: { defaultValue: undefined, error: "Escolha um plano para continuar." },
};

export const Disabled: Story = {
  name: "Desabilitado",
  args: { disabled: true },
};

export const DisabledOption: Story = {
  name: "Uma opção desabilitada",
  args: { labelInfo: undefined, description: undefined, defaultValue: "free" },
  render: (args) => (
    <RadioGroup {...args} className="w-xs">
      <RadioGroupItem value="free" label="Grátis" />
      <RadioGroupItem value="pro" label="Pro" />
      <RadioGroupItem
        value="team"
        label="Time"
        description="Disponível a partir de 3 pessoas."
        disabled
      />
    </RadioGroup>
  ),
};
