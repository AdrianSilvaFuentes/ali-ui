import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  IconBrush,
  IconBuildingArch,
  IconCamera,
  IconDeviceGamepad2,
  IconMovie,
  IconMusic,
  IconPlane,
  IconToolsKitchen2,
  IconTypography,
} from "@tabler/icons-react";
import { useState } from "react";
import { MultiSelect } from "./MultiSelect.tsx";

const interests = [
  { value: "tipografia", icon: <IconTypography />, label: "Tipografia" },
  { value: "fotografia", icon: <IconCamera />, label: "Fotografia" },
  { value: "ilustracao", icon: <IconBrush />, label: "Ilustração" },
  { value: "arquitetura", icon: <IconBuildingArch />, label: "Arquitetura" },
  { value: "musica", icon: <IconMusic />, label: "Música" },
  { value: "cinema", icon: <IconMovie />, label: "Cinema" },
  { value: "viagem", icon: <IconPlane />, label: "Viagem" },
  { value: "culinaria", icon: <IconToolsKitchen2 />, label: "Culinária" },
  { value: "games", icon: <IconDeviceGamepad2 />, label: "Games", disabled: true },
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
          "Campo para escolher várias opções de uma lista. As escolhidas viram tags dentro do campo, na ordem em que foram escolhidas, cada uma com um X para remover. Fechado, o campo fica numa linha só: as tags que não cabem viram um contador +N à direita, em text-subtle. Ao abrir a lista, o campo mostra todas as tags, quebrando linha e crescendo. O leitor de tela ouve todas as escolhidas no nome do campo, mesmo as do contador. Cada tag recém-escolhida entra com animate-pop-in: um fade e um leve crescimento de 95% a 100%, em duration-base. Ao sair, a tag faz o caminho inverso (animate-pop-out), no mesmo tempo. Quem pede menos movimento vê só o fade. Quando o campo muda de altura (ao escolher, remover, abrir ou fechar), a altura também anima, em duration-base; quem pede menos movimento vê a mudança direto.\n\nAo abrir, a lista traz uma busca no topo, que filtra sem diferença de maiúsculas e acentos. As escolhidas ganham o fundo bg-selected e um check à direita, como no Select, e a lista não fecha a cada escolha. As opções têm 2px entre si, como no Select, para várias escolhidas seguidas não virarem um bloco só. Pelo teclado: Enter, Espaço ou seta para baixo abrem; digitar filtra; as setas andam pela lista, pulando as desabilitadas; Enter escolhe ou tira a opção; Esc ou Tab fecham, e o foco volta para o campo. Nas tags, Delete ou Backspace no X removem, e o foco vai para a próxima tag.\n\nO campo é a caixa do Input, com a mesma altura mínima (sm 32px e md 40px), borda, raio, erro e desabilitado. As tags usam o tom neutral e o tamanho md (24px) nos dois tamanhos do campo, dentro dele e na lista. Feito à mão, sem dependência nova: o balão é o Popover do Radix e o resto segue o padrão combobox do WAI-ARIA.\n\nLabel, ajuda, erro e labelInfo funcionam como no Input. Com erro, a mensagem substitui a ajuda.",
      },
    },
  },
  args: {
    className: "w-sm",
    label: "Interesses",
    labelInfo: "Usados para sugerir conteúdos para você.",
    placeholder: "Escolha seus interesses",
    searchPlaceholder: "Buscar opção",
    emptyMessage: "Nenhuma opção encontrada",
    description: "Escolha quantos quiser.",
    size: "sm",
    disabled: false,
    options: interests,
    defaultValue: ["tipografia"],
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
      description:
        "As opções: `{ value, label, icon?, disabled? }`. O ícone aparece na tag do campo e na da lista.",
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

/** Muitas escolhas: fechado, as que não cabem viram +N; aberto, aparecem todas. */
export const ManySelected: Story = {
  args: {
    defaultValue: ["tipografia", "fotografia", "ilustracao", "arquitetura", "musica", "viagem"],
  },
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
  args: { defaultValue: [], error: "Escolha pelo menos um interesse." },
};

export const Disabled: Story = { args: { disabled: true } };

/** Controlado: o valor fica fora do componente, e a lista abaixo mostra o que foi escolhido. */
export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState(["tipografia", "cinema"]);
    return (
      <div className="flex flex-col gap-3">
        <MultiSelect {...args} value={value} onValueChange={setValue} />
        <p className="text-body-sm text-subtle">Valor: {JSON.stringify(value)}</p>
      </div>
    );
  },
};
