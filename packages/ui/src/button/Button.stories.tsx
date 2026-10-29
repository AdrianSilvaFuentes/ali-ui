import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconArrowRight, IconPlus, IconSearch } from "@tabler/icons-react";
import { Button } from "./Button.tsx";

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Botão de ação. Use o primary para a ação principal da tela, de preferência um por tela, e o secondary para as ações de apoio, como cancelar ou voltar. Ícones vão como filhos e ganham o tamanho certo para cada size. Botão só com ícone precisa de aria-label.\n\nO visual traz um toque tátil, inspirado no skeumorfismo: um degradê na cor da marca, um brilho fino no topo (inset-shadow-highlight) como luz vinda de cima e uma sombra pequena embaixo. Ao pressionar, o brilho some e o botão parece afundar. A ideia é dar volume e resposta ao clique sem perder a leveza de uma interface plana.\n\nO secondary tem o mesmo volume, mas é neutro: fundo bg-neutral, borda border-subtle e texto default. Sem degradê, ele não disputa atenção com o primary.",
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
      options: ["primary", "secondary"],
      description: "Estilo do botão: primary para a ação principal, secondary para as de apoio.",
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
    asChild: {
      control: false,
      description: "Usa o filho (por exemplo um link) como elemento, com a aparência de botão.",
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: ({ children, ...args }) => (
    <Button {...args}>
      <IconPlus aria-hidden />
      {children}
    </Button>
  ),
};

export const Secondary: Story = {
  args: { variant: "secondary", children: "Cancelar" },
};

export const Variants: Story = {
  name: "Primary e secondary juntos",
  parameters: {
    docs: {
      description: {
        story:
          "O par mais comum: a ação principal em primary e a de apoio em secondary, lado a lado.",
      },
    },
  },
  render: (args) => (
    <div className="flex items-center gap-3">
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
      <Button {...args}>
        <IconPlus aria-hidden />
        Criar
      </Button>
      <Button {...args}>
        Continuar
        <IconArrowRight aria-hidden />
      </Button>
    </div>
  ),
};

export const IconOnly: Story = {
  name: "Só ícone",
  args: { "aria-label": "Pesquisar" },
  render: (args) => (
    <div className="flex items-center gap-4">
      <Button {...args} size="sm" className="w-8 px-0">
        <IconSearch aria-hidden />
      </Button>
      <Button {...args} size="md" className="w-10 px-0">
        <IconSearch aria-hidden />
      </Button>
      <Button {...args} size="lg" className="w-12 px-0">
        <IconSearch aria-hidden />
      </Button>
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
  args: { className: "outline-2 outline-offset-2 outline-focus" },
  render: ({ children, ...args }) => (
    <Button {...args}>
      <IconPlus aria-hidden />
      {children}
    </Button>
  ),
};

export const Disabled: Story = {
  name: "Desabilitado",
  args: { disabled: true },
  render: (args) => (
    <div className="flex items-center gap-3">
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
