import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconBuildingStore, IconTruck, IconWorld } from "@tabler/icons-react";
import type { ReactNode } from "react";
import { Avatar } from "../avatar/Avatar.tsx";
import { Button } from "../button/Button.tsx";
import { Input } from "../input/Input.tsx";
import { Select, SelectGroup, SelectItem, SelectSeparator } from "./Select.tsx";

const meta = {
  title: "Components/Form/Select",
  component: Select,
  subcomponents: { SelectItem, SelectGroup, SelectSeparator },
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Campo de escolha numa lista, para quando as opções são muitas para um RadioGroup (mais de cinco, mais ou menos). Pelo teclado, Enter, Espaço ou as setas abrem a lista; as setas andam por ela; digitar uma letra pula para a opção que começa com ela; Enter escolhe e Esc fecha sem mudar nada.\n\nO gatilho é a caixa do Input: mesma altura (sm 32px e md 40px), borda, raio, foco, erro e desabilitado, com uma seta no fim que vira para cima com a lista aberta. Enquanto nada foi escolhido, mostra o placeholder em text-placeholder.\n\nA lista abre logo abaixo, com pelo menos a largura do gatilho, num balão com fundo surface, contorno subtle e brilho no topo, com a sombra de menus (shadow-overlay), e entra com a animação animate-enter-exit. A opção em destaque, pelo mouse ou pelas setas, ganha o fundo neutral-hovered, como o hover do Button secondary. A escolhida ganha o fundo bg-selected, um tom de hover na cor da marca, e um check à direita em icon-primary. Listas longas rolam, com setas em cima e embaixo.\n\nCada opção pode ter um ícone ou avatar à esquerda (leading, que também aparece no gatilho depois de escolhida), uma segunda linha menor, em body-sm e cinza (description) e algo pequeno à direita, como uma tag (trailing). SelectGroup divide a lista em seções com título, e SelectSeparator põe uma linha entre elas. Nada dentro de uma opção pode ser clicável: a opção inteira é um item só, e o clique nela já escolhe. Para listas com ações em cada linha, como arrastar ou um menu, use outro componente.\n\nLabel, ajuda, erro e labelInfo funcionam como no Input. Com erro, a mensagem substitui a ajuda.",
      },
    },
  },
  args: {
    className: "w-sm",
    label: "País",
    labelInfo: "Usamos para calcular o frete e os impostos.",
    placeholder: "Escolha um país",
    description: "Onde você mora hoje.",
    size: "sm",
    disabled: false,
    children: null,
  },
  argTypes: {
    label: { control: "text", description: "Nome do campo." },
    labelInfo: {
      control: "text",
      description: "Ajuda extra num ícone de info no fim do label, que abre um Toggletip.",
    },
    placeholder: { control: "text", description: "Texto enquanto nada foi escolhido." },
    description: { control: "text", description: "Texto de ajuda abaixo do campo." },
    error: {
      control: "text",
      description: "Mensagem de erro. Substitui a ajuda e aparece com ícone.",
    },
    size: {
      control: "inline-radio",
      options: ["sm", "md"],
      description: "Altura e raio, os mesmos do Input: sm 32px e md 40px (padrão).",
      table: { defaultValue: { summary: "md" } },
    },
    disabled: {
      control: "boolean",
      description: "Desabilita o campo.",
      table: { defaultValue: { summary: "false" } },
    },
    defaultValue: { control: "text", description: "Opção escolhida no começo (sem controlar)." },
    children: { control: false, description: "As opções: um SelectItem para cada." },
    className: { control: false, description: "Classes do bloco inteiro, por exemplo a largura." },
  },
  render: (args) => (
    <Select {...args}>
      <SelectItem value="br">Brasil</SelectItem>
      <SelectItem value="pt">Portugal</SelectItem>
      <SelectItem value="ao">Angola</SelectItem>
      <SelectItem value="mz">Moçambique</SelectItem>
      <SelectItem value="cv">Cabo Verde</SelectItem>
      <SelectItem value="gw" disabled>
        Guiné-Bissau
      </SelectItem>
    </Select>
  ),
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Selected: Story = {
  name: "Com escolha",
  args: { defaultValue: "pt" },
};

export const WithError: Story = {
  name: "Com erro",
  args: { error: "Escolha um país para calcular o frete." },
};

export const Disabled: Story = {
  name: "Desabilitado",
  args: { disabled: true, defaultValue: "br" },
};

const timezones = Array.from({ length: 25 }, (_, index) => index - 12).map((offset) => ({
  value: String(offset),
  label: `UTC${offset >= 0 ? "+" : "−"}${String(Math.abs(offset)).padStart(2, "0")}:00`,
}));

export const LongList: Story = {
  name: "Lista longa",
  parameters: {
    docs: {
      description: {
        story:
          "Com muitas opções, a lista ocupa a altura que cabe na tela e rola; as setas em cima e embaixo aparecem quando há mais opções escondidas. Digitar o começo de uma opção pula direto para ela.",
      },
    },
  },
  args: {
    label: "Fuso horário",
    labelInfo: undefined,
    placeholder: "Escolha um fuso",
    description: undefined,
    defaultValue: "-3",
  },
  render: (args) => (
    <Select {...args}>
      {timezones.map((zone) => (
        <SelectItem key={zone.value} value={zone.value}>
          {zone.label}
        </SelectItem>
      ))}
    </Select>
  ),
};

export const InForm: Story = {
  name: "Com Input e Button",
  parameters: {
    docs: {
      description: {
        story: "Select, Input e Button do mesmo tamanho ficam na mesma altura, com o mesmo canto.",
      },
    },
  },
  render: (args) => (
    <div className="flex w-md items-end gap-2">
      <Select
        {...args}
        className="w-3xs"
        label="Ordenar"
        labelInfo={undefined}
        description={undefined}
        placeholder="Mais recentes"
      >
        <SelectItem value="recentes">Mais recentes</SelectItem>
        <SelectItem value="antigos">Mais antigos</SelectItem>
        <SelectItem value="az">De A a Z</SelectItem>
      </Select>
      <Input label="Buscar" size={args.size ?? "md"} className="flex-1" placeholder="Nome" />
      <Button size={args.size ?? "md"}>Filtrar</Button>
    </div>
  ),
};

/** Tag de exemplo, só com tokens, até existir o componente Badge. */
function SampleTag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-sm border border-subtle px-1.5 text-label-sm text-subtle">
      {children}
    </span>
  );
}

export const RichItems: Story = {
  name: "Com avatar, descrição e tag",
  parameters: {
    docs: {
      description: {
        story:
          "Opções com avatar à esquerda, uma segunda linha e uma tag à direita. Depois de escolhida, o gatilho mostra o avatar e o nome; a segunda linha e a tag ficam só na lista. O avatar é o componente Avatar (sm, 24px); a tag é um exemplo simples, até existir o componente Badge.",
      },
    },
  },
  args: {
    label: "Responsável",
    labelInfo: undefined,
    placeholder: "Escolha uma pessoa",
    description: "Quem recebe os avisos deste projeto.",
    defaultValue: "lia",
  },
  render: (args) => (
    <Select {...args}>
      <SelectItem
        value="lia"
        leading={<Avatar name="Lia Martins" size="sm" />}
        description="lia@exemplo.com"
        trailing={<SampleTag>Admin</SampleTag>}
      >
        Lia Martins
      </SelectItem>
      <SelectItem
        value="caio"
        leading={<Avatar name="Caio Ribeiro" size="sm" />}
        description="caio@exemplo.com"
      >
        Caio Ribeiro
      </SelectItem>
      <SelectItem
        value="nara"
        leading={<Avatar name="Nara Torres" size="sm" />}
        description="nara@exemplo.com"
        trailing={<SampleTag>Convite enviado</SampleTag>}
        disabled
      >
        Nara Torres
      </SelectItem>
    </Select>
  ),
};

export const Grouped: Story = {
  name: "Com ícones e grupos",
  parameters: {
    docs: {
      description: {
        story:
          "SelectGroup divide a lista em seções com título, e SelectSeparator põe uma linha entre elas. Os ícones à esquerda também aparecem no gatilho.",
      },
    },
  },
  args: {
    label: "Entrega",
    labelInfo: undefined,
    placeholder: "Como você quer receber?",
    description: undefined,
    defaultValue: "expressa",
  },
  render: (args) => (
    <Select {...args}>
      <SelectGroup label="Em casa">
        <SelectItem value="padrao" leading={<IconTruck />} description="De 5 a 8 dias úteis">
          Entrega padrão
        </SelectItem>
        <SelectItem value="expressa" leading={<IconTruck />} description="Em até 2 dias úteis">
          Entrega expressa
        </SelectItem>
      </SelectGroup>
      <SelectSeparator />
      <SelectGroup label="Retirar">
        <SelectItem value="loja" leading={<IconBuildingStore />} description="Pronto em 1 dia">
          Na loja
        </SelectItem>
        <SelectItem value="fora" leading={<IconWorld />} description="Para outros países" disabled>
          Internacional
        </SelectItem>
      </SelectGroup>
    </Select>
  ),
};
