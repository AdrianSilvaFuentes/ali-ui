import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconBuilding, IconWorld } from "@tabler/icons-react";
import { Combobox, type ComboboxOption } from "./Combobox.tsx";

const countries: ComboboxOption[] = [
  "Argentina",
  "Bolívia",
  "Brasil",
  "Canadá",
  "Chile",
  "Colômbia",
  "Costa Rica",
  "Equador",
  "Espanha",
  "Estados Unidos",
  "França",
  "Gibraltar",
  "Itália",
  "Japão",
  "México",
  "Paraguai",
  "Peru",
  "Portugal",
  "Reino Unido",
  "Uruguai",
  "Venezuela",
].map((label) => ({ value: label.toLowerCase().replace(/\s/g, "-"), label }));

const meta = {
  title: "Components/Form/Combobox",
  component: Combobox,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Campo de texto com uma lista embaixo: digitar filtra, e a pessoa escolhe uma opção. A busca não liga para maiúsculas nem acentos: colombia encontra Colômbia.\n\nQuando usar: até umas 15 opções, Select; listas longas, ou quando a pessoa já sabe o que procura (países, cidades, fusos, pessoas), Combobox; várias escolhas, MultiSelect.\n\nSó vale o que está na lista. Ao sair do campo sem escolher, o texto volta para a opção escolhida; com o campo apagado, a escolha é limpa. Sem resultados, a lista avisa Nenhuma opção encontrada. O formulário recebe o value da opção, não o nome.\n\nA caixa é a do Input, com a mesma altura, borda, foco, erro e desabilitado, e 10px nas laterais como o Select. O balão e as opções são os do Select: destaque em neutral-hovered, a escolhida em bg-selected com o check. Pelo teclado, digitar ou a seta para baixo abrem a lista, as setas andam por ela (pulando as desabilitadas), Enter escolhe e Esc fecha e desfaz a busca. O foco fica sempre no campo; o leitor de tela ouve a opção em destaque.",
      },
    },
  },
  args: {
    label: "País",
    labelInfo: "Usamos para calcular impostos.",
    placeholder: "Busque um país",
    description: "Onde fica a sede da empresa.",
    options: countries,
    size: "md",
    disabled: false,
    className: "w-xs",
  },
  argTypes: {
    label: { control: "text", description: "Nome do campo, ligado ao input." },
    labelInfo: {
      control: "text",
      description: "Ajuda extra num ícone de info no fim do label, que abre um Toggletip.",
    },
    placeholder: { control: "text", description: "Texto do campo vazio." },
    emptyMessage: {
      control: "text",
      description: "O aviso quando a busca não encontra nada.",
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
      description: "Altura: sm tem 32px, md tem 40px, como o Input.",
      table: { defaultValue: { summary: "md" } },
    },
    disabled: {
      control: "boolean",
      description: "Desabilita o campo.",
      table: { defaultValue: { summary: "false" } },
    },
    defaultValue: { control: "text", description: "O value da opção escolhida ao abrir." },
    options: {
      control: false,
      description: "As opções: value, label e, se quiser, description, icon e disabled.",
    },
    className: { control: false, description: "Classes do bloco inteiro, por exemplo a largura." },
  },
} satisfies Meta<typeof Combobox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Selected: Story = {
  name: "Com escolha",
  args: { defaultValue: "brasil" },
};

export const WithDetails: Story = {
  name: "Com ícone e segunda linha",
  args: {
    label: "Escritório",
    labelInfo: undefined,
    placeholder: "Busque um escritório",
    description: undefined,
    defaultValue: "sp",
    options: [
      {
        value: "sp",
        label: "São Paulo",
        description: "Av. Paulista, 1000",
        icon: <IconBuilding />,
      },
      { value: "rj", label: "Rio de Janeiro", description: "Centro", icon: <IconBuilding /> },
      { value: "lis", label: "Lisboa", description: "Parque das Nações", icon: <IconBuilding /> },
      {
        value: "remote",
        label: "Remoto",
        description: "Sem escritório fixo",
        icon: <IconWorld />,
      },
      {
        value: "nyc",
        label: "Nova York",
        description: "Abre em 2027",
        icon: <IconBuilding />,
        disabled: true,
      },
    ],
  },
};

export const Small: Story = {
  name: "Pequeno (sm)",
  args: { size: "sm", labelInfo: undefined, description: undefined },
};

export const WithError: Story = {
  name: "Com erro",
  args: { labelInfo: undefined, error: "Escolha o país da sede para continuar." },
};

export const Disabled: Story = {
  name: "Desabilitado",
  args: { disabled: true, defaultValue: "chile", labelInfo: undefined, description: undefined },
};
