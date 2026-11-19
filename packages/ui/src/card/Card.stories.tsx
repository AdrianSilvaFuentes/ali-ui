import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconChevronRight, IconShoppingCart, IconToolsKitchen2 } from "@tabler/icons-react";
import { Badge } from "../badge/Badge.tsx";
import { Button } from "../button/Button.tsx";
import { Input } from "../input/Input.tsx";
import { Card } from "./Card.tsx";

const variants = ["raised", "sunken"] as const;
const paddings = ["none", "sm", "md", "lg"] as const;

const meta = {
  title: "Components/Layout/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Bloco que agrupa conteúdo relacionado sobre uma superfície: um resumo, uma lista, um formulário. Canto de 12px (radius-xl), contorno sutil (border-subtle) e texto default. Não é controle: não tem hover, foco nem clique; o que é interativo vai dentro dele.\n\nDois estilos. raised (padrão) usa a superfície raised, sombra mínima (shadow-xs) e o brilho fino no topo (inset-shadow-highlight), e separa o bloco do fundo da página. sunken usa a superfície sunken, sem sombra, para uma área dentro de outra, como um grupo de campos num formulário.\n\nQuatro respiros: none, sm 12px, md 16px (padrão) e lg 20px. Com none o conteúdo encosta na borda e o card corta o que passa do canto, para listas com divisórias.\n\nPor padrão é uma div. Com asChild, o filho vira o card: use section com um título, ul para uma lista ou form para um formulário, para o leitor de tela entender a estrutura.",
      },
    },
  },
  args: { variant: "raised", padding: "md" },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: variants,
      description: "raised separa do fundo da página; sunken fica dentro de outro bloco.",
      table: { defaultValue: { summary: "raised" } },
    },
    padding: {
      control: "inline-radio",
      options: paddings,
      description: "none, sm 12px, md 16px (padrão) ou lg 20px.",
      table: { defaultValue: { summary: "md" } },
    },
    asChild: {
      control: false,
      description: "Usa o filho como elemento (section, ul, form, article), com o estilo do card.",
    },
    className: { control: false },
    children: { control: false },
  },
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Card {...args} className="max-w-sm">
      <p className="text-label-sm text-subtle">Total do mês</p>
      <p className="mt-1 text-title-lg tabular-nums">R$ 1.284,90</p>
    </Card>
  ),
};

export const Variants: Story = {
  name: "Estilos",
  parameters: {
    docs: {
      description: {
        story:
          "raised por fora; sunken para uma área dentro dele, sem competir com o card de fora.",
      },
    },
  },
  render: (args) => (
    <Card {...args} variant="raised" padding="lg" className="max-w-sm space-y-4">
      <p className="text-title-sm">Novo empréstimo</p>
      <Card variant="sunken" className="space-y-3">
        <Input label="Quem deve?" placeholder="Ex.: João" />
        <p className="text-body-sm text-subtle">Empréstimos não entram no total do mês.</p>
      </Card>
    </Card>
  ),
};

export const Paddings: Story = {
  name: "Respiros",
  parameters: {
    docs: { description: { story: "none, sm 12px, md 16px e lg 20px." } },
  },
  render: (args) => (
    <div className="grid max-w-xl grid-cols-2 gap-3">
      {paddings.map((padding) => (
        <Card key={padding} {...args} padding={padding}>
          <p className="text-label-md">padding {padding}</p>
        </Card>
      ))}
    </div>
  ),
};

export const List: Story = {
  name: "Lista",
  parameters: {
    docs: {
      description: {
        story:
          "Com padding none e asChild numa ul: as linhas encostam na borda, o hover não vaza do canto e o leitor de tela anuncia uma lista.",
      },
    },
  },
  render: (args) => (
    <Card
      {...args}
      asChild
      padding="none"
      className="max-w-sm divide-y divide-[var(--ali-color-border-subtle)]"
    >
      <ul>
        {[
          { name: "Mercado", value: "R$ 230,00", Icon: IconShoppingCart },
          { name: "Restaurante", value: "R$ 86,50", Icon: IconToolsKitchen2 },
        ].map(({ name, value, Icon }) => (
          <li key={name}>
            <button
              type="button"
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition-interactive duration-fast outline-focus hover:bg-neutral-hovered focus-visible:outline-2 focus-visible:-outline-offset-2"
            >
              <Icon aria-hidden className="size-5 text-icon-subtle" />
              <span className="flex-1 text-label-md">{name}</span>
              <span className="text-label-md tabular-nums">{value}</span>
              <IconChevronRight aria-hidden className="size-4 text-icon-subtle" />
            </button>
          </li>
        ))}
      </ul>
    </Card>
  ),
};

export const Section: Story = {
  name: "Como seção",
  parameters: {
    docs: {
      description: {
        story:
          "asChild numa section ligada ao título: o bloco vira uma região com nome para o leitor de tela.",
      },
    },
  },
  render: (args) => (
    <Card {...args} asChild padding="lg" className="max-w-sm space-y-3">
      <section aria-labelledby="card-face-id">
        <div className="flex items-center justify-between">
          <h3 id="card-face-id" className="text-label-lg">
            Face ID
          </h3>
          <Badge tone="success" size="sm">
            Ativo
          </Badge>
        </div>
        <p className="text-body-md text-subtle">Entre sem senha neste aparelho.</p>
        <Button variant="secondary" size="sm">
          Remover
        </Button>
      </section>
    </Card>
  ),
};
