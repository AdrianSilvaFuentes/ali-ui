import type { Meta, StoryObj } from "@storybook/react-vite";
import { Toggletip } from "./Toggletip.tsx";

const meta = {
  title: "Components/Toggletip",
  component: Toggletip,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Ícone de info que abre um balão com uma ajuda curta. Diferente de um tooltip, abre no clique ou toque, e não ao passar o mouse: assim funciona também no celular. Fecha com Esc, clique fora ou um novo clique no ícone.\n\nUm tail de 12×6px aponta para o ícone, com o fundo e a borda do balão, como uma peça só. Ao abrir, o balão entra de fora para dentro: surge 4px afastado, do lado em que abre, e desliza até o lugar com um fade (duration-base, 200ms). Ao fechar, faz o caminho de volta, mais rápido (duration-fast, 100ms). Quem pede menos movimento no sistema vê só o fade.\n\nPara o leitor de tela, o ícone é um botão com nome (por padrão, "Mais informações") que avisa se está aberto. Ao abrir, o foco vai para o balão e o texto é lido; ao fechar com Esc, o foco volta para o ícone.\n\nO ícone tem 14px, o tamanho da fonte do label, para não pesar mais que o texto ao lado. O botão tem área de toque de 24px, mas ocupa só 16px na linha, para caber num label sem mudar a altura dela. O balão usa surface-overlay, o fundo de tudo que fica acima da página, com shadow-md: mais leve que a shadow-overlay de menus e diálogos, que pesaria num balão pequeno. Tem também o mesmo brilho no topo do Button (inset-shadow-highlight): no tema claro ele some no branco, no escuro vira um chanfro sutil. O texto é body-md (14px), um passo acima da ajuda do campo, para ler com calma.\n\nUse para informação extra, que ajuda mas não é necessária. O que a pessoa precisa saber para preencher o campo vai na ajuda (description), que fica sempre visível.',
      },
    },
  },
  args: {
    children: "Usamos o email só para avisos da conta. Nunca para propaganda.",
    label: "Mais informações",
    side: "top",
    align: "center",
  },
  argTypes: {
    children: { control: "text", description: "Texto do balão. Curto: uma ou duas frases." },
    label: {
      control: "text",
      description: "Nome do botão para o leitor de tela.",
      table: { defaultValue: { summary: "Mais informações" } },
    },
    side: {
      control: "inline-radio",
      options: ["top", "right", "bottom", "left"],
      description: "Lado em que o balão abre. Se não couber, vai para o lado oposto.",
      table: { defaultValue: { summary: "top" } },
    },
    align: {
      control: "inline-radio",
      options: ["start", "center", "end"],
      description: "Alinhamento do balão em relação ao ícone.",
      table: { defaultValue: { summary: "center" } },
    },
    className: { control: false, description: "Classes do botão do ícone." },
  },
} satisfies Meta<typeof Toggletip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const NextToLabel: Story = {
  name: "Ao lado de um label",
  parameters: {
    docs: {
      description: {
        story:
          "O uso principal: no fim do nome de um campo. O ícone não muda a altura da linha. A ligação com o label do Input e do Textarea vem numa próxima etapa.",
      },
    },
  },
  render: (args) => (
    <span className="inline-flex items-center gap-1.5 text-label-md text-default">
      Email
      <Toggletip {...args} label="Sobre o email" />
    </span>
  ),
};

export const Sides: Story = {
  name: "Lados",
  render: (args) => (
    <div className="grid grid-cols-2 gap-x-24 gap-y-16 p-16">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <span key={side} className="inline-flex items-center gap-1.5 text-label-md text-default">
          {side}
          <Toggletip {...args} side={side} label={`Mais informações (${side})`} />
        </span>
      ))}
    </div>
  ),
};
