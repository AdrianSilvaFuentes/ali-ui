import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconActivity, IconLayoutGrid, IconSettings } from "@tabler/icons-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./Tabs.tsx";

const meta = {
  title: "Components/Navigation/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Troca o conteúdo na mesma página, sem sair dela, como Visão geral, Atividade e Ajustes de um projeto. Para trocar de página, use links. Para escolher um valor de formulário, use o RadioGroup.\n\nMonte com `TabsList`, um `TabsTrigger` por aba e um `TabsContent` com o mesmo `value`. Pelo teclado, o Tab entra na aba ativa, as setas andam entre as abas (e já trocam o conteúdo), Home e End vão para a primeira e a última, e o próximo Tab vai para o conteúdo.\n\nDuas variantes. `line`: abas em texto, com uma linha fina embaixo de todas e uma linha de 2px na cor da marca sob a ativa, que desliza até a nova aba ao trocar. Bom para separar seções de uma página. `segmented`: as abas ficam numa caixa afundada (fundo surface-sunken), e um fundo elevado com sombra e borda marca a ativa: ao trocar, ele desliza até a nova aba, para a direita ou para a esquerda, em 200ms (duration-base). Quem pede menos movimento vê a troca direta. Bom para alternar visões de um mesmo bloco, como Lista e Grade. Nas duas, a aba ativa não depende só da cor: tem a linha ou o fundo, além do texto mais forte.",
      },
    },
  },
  args: { variant: "line", defaultValue: "overview" },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["line", "segmented"],
      description: "O visual das abas.",
      table: { defaultValue: { summary: "line" } },
    },
    defaultValue: {
      control: "inline-radio",
      options: ["overview", "activity", "settings"],
      description: "A aba que começa ativa (sem controlar o estado).",
    },
    orientation: { control: false, description: "Só a horizontal tem visual por enquanto." },
    className: { control: false, description: "Classes do bloco inteiro." },
  },
  render: (args) => (
    <Tabs {...args} className="w-sm">
      <TabsList aria-label="Projeto">
        <TabsTrigger value="overview">Visão geral</TabsTrigger>
        <TabsTrigger value="activity">Atividade</TabsTrigger>
        <TabsTrigger value="settings">Ajustes</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="text-body-md text-subtle">
        O resumo do projeto: quem participa, o prazo e o que falta.
      </TabsContent>
      <TabsContent value="activity" className="text-body-md text-subtle">
        As últimas mudanças, da mais nova para a mais antiga.
      </TabsContent>
      <TabsContent value="settings" className="text-body-md text-subtle">
        Nome, visibilidade e quem pode editar.
      </TabsContent>
    </Tabs>
  ),
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Segmented: Story = {
  name: "Segmentado",
  args: { variant: "segmented" },
};

export const Disabled: Story = {
  name: "Com aba desabilitada",
  parameters: {
    docs: {
      description: {
        story: "Uma aba desabilitada fica cinza e as setas pulam por cima dela.",
      },
    },
  },
  render: (args) => (
    <div className="flex flex-col gap-8">
      {(["line", "segmented"] as const).map((variant) => (
        <Tabs key={variant} {...args} variant={variant} defaultValue="list">
          <TabsList aria-label={`Visualização (${variant})`}>
            <TabsTrigger value="list">Lista</TabsTrigger>
            <TabsTrigger value="grid">Grade</TabsTrigger>
            <TabsTrigger value="map" disabled>
              Mapa
            </TabsTrigger>
          </TabsList>
        </Tabs>
      ))}
    </div>
  ),
};

export const WithIcons: Story = {
  name: "Com ícones",
  parameters: {
    docs: {
      description: {
        story:
          "Com icon, o ícone vai à esquerda do texto, com 16px, e fica escondido do leitor de tela, que lê o nome da aba. Funciona nas duas variantes.",
      },
    },
  },
  render: (args) => (
    <div className="flex flex-col gap-8">
      {(["line", "segmented"] as const).map((variant) => (
        <Tabs key={variant} {...args} variant={variant} defaultValue="overview">
          <TabsList aria-label={`Projeto (${variant})`}>
            <TabsTrigger value="overview" icon={<IconLayoutGrid />}>
              Visão geral
            </TabsTrigger>
            <TabsTrigger value="activity" icon={<IconActivity />}>
              Atividade
            </TabsTrigger>
            <TabsTrigger value="settings" icon={<IconSettings />}>
              Ajustes
            </TabsTrigger>
          </TabsList>
        </Tabs>
      ))}
    </div>
  ),
};
