import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { MultiSelect } from "./MultiSelect.tsx";

const tools = [
  { value: "figma", label: "Figma" },
  { value: "sketch", label: "Sketch" },
  { value: "framer", label: "Framer" },
  { value: "penpot", label: "Penpot" },
  { value: "illustrator", label: "Illustrator" },
  { value: "photoshop", label: "Photoshop" },
  { value: "after-effects", label: "After Effects" },
  { value: "blender", label: "Blender" },
  { value: "xd", label: "Adobe XD", disabled: true },
];

const meta = {
  title: "Components/Form/MultiSelect",
  component: MultiSelect,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Campo para escolher várias opções de uma lista. As escolhidas viram tags dentro do campo, na ordem em que foram escolhidas, cada uma com um X para remover. Quando as tags não cabem numa linha, elas quebram e o campo cresce.\n\nAo abrir, a lista traz uma busca no topo, que filtra sem diferença de maiúsculas e acentos. As escolhidas ganham o fundo bg-selected e um check à direita, como no Select, e a lista não fecha a cada escolha. Pelo teclado: Enter, Espaço ou seta para baixo abrem; digitar filtra; as setas andam pela lista, pulando as desabilitadas; Enter escolhe ou tira a opção; Esc ou Tab fecham, e o foco volta para o campo. Nas tags, Delete ou Backspace no X removem, e o foco vai para a próxima tag.\n\nO campo é a caixa do Input, com a mesma altura mínima (sm 32px e md 40px), borda, raio, erro e desabilitado. As tags usam o tom neutral, no tamanho que acompanha o campo. Feito à mão, sem dependência nova: o balão é o Popover do Radix e o resto segue o padrão combobox do WAI-ARIA.\n\nLabel, ajuda, erro e labelInfo funcionam como no Input. Com erro, a mensagem substitui a ajuda.",
      },
    },
  },
  args: {
    className: "w-sm",
    label: "Ferramentas",
    labelInfo: "Aparecem no seu perfil público.",
    placeholder: "Escolha as ferramentas",
    searchPlaceholder: "Buscar opção",
    emptyMessage: "Nenhuma opção encontrada",
    description: "As que você usa no dia a dia.",
    size: "sm",
    disabled: false,
    options: tools,
    defaultValue: ["figma"],
  },
  argTypes: {
    label: { control: "text", description: "Nome do campo." },
    labelInfo: {
      control: "text",
      description: "Ajuda extra num ícone de info no fim do label, que abre um Toggletip.",
    },
    placeholder: { control: "text", description: "Texto enquanto nada foi escolhido." },
    searchPlaceholder: {
      control: "text",
      description: "Texto da busca, dentro da lista.",
      table: { defaultValue: { summary: "Buscar opção" } },
    },
    emptyMessage: {
      control: "text",
      description: "Mensagem quando a busca não encontra nada.",
      table: { defaultValue: { summary: "Nenhuma opção encontrada" } },
    },
    description: { control: "text", description: "Texto de ajuda abaixo do campo." },
    error: {
      control: "text",
      description: "Mensagem de erro. Substitui a ajuda e aparece com ícone.",
    },
    size: {
      control: "inline-radio",
      options: ["sm", "md"],
      description: "Altura mínima e raio, os mesmos do Input: sm 32px e md 40px (padrão).",
      table: { defaultValue: { summary: "md" } },
    },
    disabled: {
      control: "boolean",
      description: "Desabilita o campo. As tags ficam sem o X.",
      table: { defaultValue: { summary: "false" } },
    },
    options: {
      control: false,
      description: "As opções: `{ value, label, disabled? }`.",
    },
    defaultValue: { control: false, description: "Valores escolhidos no começo (sem controlar)." },
    value: { control: false, description: "Valores escolhidos (controlado), com onValueChange." },
    onValueChange: { control: false, description: "Chamado com todos os valores escolhidos." },
    className: { control: false, description: "Classes do bloco inteiro, por exemplo a largura." },
  },
} satisfies Meta<typeof MultiSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Sem escolha: o campo mostra o placeholder. */
export const Empty: Story = { args: { defaultValue: [] } };

/** Muitas escolhas: as tags quebram de linha e o campo cresce. */
export const ManySelected: Story = {
  args: { defaultValue: ["figma", "sketch", "framer", "penpot", "illustrator", "blender"] },
};

/** Os dois tamanhos, lado a lado com a altura do Input. */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6">
      <MultiSelect {...args} size="sm" label="Pequeno (sm)" />
      <MultiSelect {...args} size="md" label="Médio (md)" />
    </div>
  ),
};

export const WithError: Story = {
  args: { defaultValue: [], error: "Escolha pelo menos uma ferramenta." },
};

export const Disabled: Story = { args: { disabled: true } };

/** Controlado: o valor fica fora do componente, e a lista abaixo mostra o que foi escolhido. */
export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState(["figma", "blender"]);
    return (
      <div className="flex flex-col gap-3">
        <MultiSelect {...args} value={value} onValueChange={setValue} />
        <p className="text-body-sm text-subtle">Valor: {JSON.stringify(value)}</p>
      </div>
    );
  },
};
