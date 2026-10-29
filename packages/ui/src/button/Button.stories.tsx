import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconArrowRight, IconPlus, IconSearch } from "@tabler/icons-react";
import { Button } from "./Button.tsx";

/** Ícones disponíveis nos controles do Storybook. */
const icons = {
  Nenhum: undefined,
  Plus: <IconPlus />,
  ArrowRight: <IconArrowRight />,
  Search: <IconSearch />,
};

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Botão de ação. Use o primary para a ação principal da tela, de preferência um por tela, o secondary para as ações de apoio, como cancelar ou voltar, e o ghost para ações discretas que se repetem, como em barras de ferramentas, cartões e listas. Ícones vão em iconLeft (antes do texto) e iconRight (depois) e ganham o tamanho certo para cada size; o leitor de tela ignora esses ícones. Botão só com ícone precisa de aria-label.\n\nO visual traz um toque tátil, inspirado no skeumorfismo: um degradê na cor da marca, um brilho fino no topo (inset-shadow-highlight) como luz vinda de cima e uma sombra pequena embaixo. Ao pressionar, o brilho some e o botão parece afundar. A ideia é dar volume e resposta ao clique sem perder a leveza de uma interface plana.\n\nO secondary tem o mesmo volume, mas é neutro: fundo bg-neutral, borda border-subtle e texto default. Sem degradê, ele não disputa atenção com o primary.\n\nO ghost não tem fundo, borda nem volume: é só o texto, e o fundo neutro aparece no hover e ao pressionar. Por não ter contorno, funciona melhor com um ícone ou em lugares onde já fica claro que é clicável.",
      },
    },
  },
  args: {
    children: "Salvar",
    variant: "primary",
    size: "sm",
    disabled: false,
  },
  argTypes: {
    children: { control: "text", description: "Texto do botão." },
    variant: {
      control: "inline-radio",
      options: ["primary", "secondary", "ghost"],
      description:
        "Estilo do botão: primary para a ação principal, secondary para as de apoio, ghost para as discretas.",
      table: { defaultValue: { summary: "primary" } },
    },
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg"],
      description: "Altura: sm 32px, md 40px (padrão), lg 48px.",
      table: { defaultValue: { summary: "md" } },
    },
    disabled: {
      control: "boolean",
      description: "Desabilita o botão.",
      table: { defaultValue: { summary: "false" } },
    },
    iconLeft: {
      control: "select",
      options: Object.keys(icons),
      mapping: icons,
      description: "Ícone antes do texto. Decorativo: o leitor de tela lê só o texto.",
    },
    iconRight: {
      control: "select",
      options: Object.keys(icons),
      mapping: icons,
      description: "Ícone depois do texto, por exemplo uma seta para avançar.",
    },
    asChild: {
      control: false,
      description: "Usa o filho (por exemplo um link) como elemento, com a aparência de botão.",
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { iconLeft: "Plus" },
};

export const Secondary: Story = {
  args: { variant: "secondary", children: "Cancelar" },
};

export const Ghost: Story = {
  args: { variant: "ghost", children: "Mais opções", iconRight: "ArrowRight" },
};

export const Variants: Story = {
  name: "Variantes juntas",
  parameters: {
    docs: {
      description: {
        story:
          "A hierarquia das três: o ghost para a ação discreta, o secondary para a de apoio e o primary para a principal.",
      },
    },
  },
  render: (args) => (
    <div className="flex items-center gap-3">
      <Button {...args} variant="ghost">
        Pular
      </Button>
      <Button {...args} variant="secondary">
        Cancelar
      </Button>
      <Button {...args} variant="primary">
        Salvar
      </Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Button {...args} size="sm" />
      <Button {...args} size="md" />
      <Button {...args} size="lg" />
    </div>
  ),
};

export const WithIcon: Story = {
  name: "Com ícone",
  render: (args) => (
    <div className="flex items-center gap-4">
      <Button {...args} iconLeft={<IconPlus />}>
        Criar
      </Button>
      <Button {...args} iconRight={<IconArrowRight />}>
        Continuar
      </Button>
    </div>
  ),
};

export const IconOnly: Story = {
  name: "Só ícone",
  args: { "aria-label": "Pesquisar" },
  // Sem texto: o nome do botão vem do aria-label.
  render: ({ children: _children, ...args }) => (
    <div className="flex items-center gap-4">
      <Button {...args} size="sm" className="w-8 px-0" iconLeft={<IconSearch />} />
      <Button {...args} size="md" className="w-10 px-0" iconLeft={<IconSearch />} />
      <Button {...args} size="lg" className="w-12 px-0" iconLeft={<IconSearch />} />
    </div>
  ),
};

export const Focused: Story = {
  name: "Focado",
  parameters: {
    docs: {
      description: {
        story:
          "Contorno de foco na cor border-focus, que aparece ao navegar com o teclado (Tab). Aqui ele está fixo só para mostrar a aparência: no uso real, só o elemento focado tem o contorno.",
      },
    },
  },
  args: { className: "outline-2 outline-offset-2 outline-focus", iconLeft: "Plus" },
};

export const Disabled: Story = {
  name: "Desabilitado",
  args: { disabled: true },
  render: (args) => (
    <div className="flex items-center gap-3">
      <Button {...args} variant="ghost">
        Pular
      </Button>
      <Button {...args} variant="secondary">
        Cancelar
      </Button>
      <Button {...args} variant="primary">
        Salvar
      </Button>
    </div>
  ),
};

export const AsLink: Story = {
  name: "Como link",
  render: (args) => (
    <Button {...args} asChild>
      <a href="https://github.com/AdrianSilvaFuentes/ali-ui">Ver no GitHub</a>
    </Button>
  ),
};
