import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconMail, IconSearch, IconX } from "@tabler/icons-react";
import { Button } from "../button/Button.tsx";
import { Input } from "./Input.tsx";

/** Ícones disponíveis nos controles do Storybook. */
const icons = {
  Nenhum: undefined,
  Mail: <IconMail />,
  Search: <IconSearch />,
  X: <IconX />,
};

const meta = {
  title: "Components/Form/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Campo de texto com label, ajuda e erro. O componente já liga tudo para o leitor de tela: o label nomeia o campo, a ajuda e o erro são lidos junto, e o erro marca o campo como inválido. Sem label visível, passe um aria-label.\n\nO campo tem a sombra mínima (shadow-xs), a mesma do Button, para vários campos juntos num formulário não pesarem, e sem o brilho no topo, que fica reservado ao que se clica. Em repouso, a borda é border-subtle, para o campo ficar leve; no hover e no foco ela escurece para border-default. Exceção consciente: a borda subtle fica abaixo do contraste de 3:1 que a WCAG pede para o contorno de campos, então use sempre um label visível (ou o contexto claro de uma busca). Os tamanhos e raios são os mesmos do Button, para os dois ficarem lado a lado na mesma altura.\n\nO placeholder usa text-placeholder, bem mais claro que o texto digitado, para o campo vazio não parecer preenchido. Exceção consciente: no tema claro ele fica abaixo do contraste de 4.5:1 da WCAG, então nunca coloque nele uma informação necessária. Use-o só para exemplos; instruções vão na ajuda (description), que não some ao digitar.\n\nO erro aparece com ícone e texto, nunca só com a cor vermelha. Com erro, a mensagem substitui a ajuda até o erro sumir: escreva o erro dizendo o que falta, porque a ajuda não aparece junto. Desabilitado mantém o fundo neutro, perde a sombra e deixa texto e borda em disabled. Somente leitura ganha o fundo bg-readonly e mantém o texto em default.\n\nNo mouse, a caixa toda mostra o cursor de texto, e um clique no respiro ou num ícone também foca o campo.",
      },
    },
  },
  args: {
    className: "w-sm",
    label: "Email",
    labelInfo: "Usamos o email só para avisos da conta. Nunca para propaganda.",
    placeholder: "voce@exemplo.com",
    size: "sm",
    disabled: false,
  },
  argTypes: {
    label: { control: "text", description: "Nome do campo." },
    labelInfo: {
      control: "text",
      description: "Ajuda extra num ícone de info no fim do label, que abre um Toggletip.",
    },
    className: { control: false, description: "Classes do bloco inteiro, por exemplo a largura." },
    description: { control: "text", description: "Texto de ajuda abaixo do campo." },
    error: {
      control: "text",
      description: "Mensagem de erro. Marca o campo como inválido e aparece com ícone.",
    },
    placeholder: { control: "text", description: "Exemplo do que digitar. Não substitui o label." },
    size: {
      control: "inline-radio",
      options: ["sm", "md"],
      description: "Altura e raio, os mesmos do Button: sm 32px e md 40px (padrão).",
      table: { defaultValue: { summary: "md" } },
    },
    readOnly: {
      control: "boolean",
      description: "Somente leitura: mostra o valor, que pode ser copiado, mas não editado.",
      table: { defaultValue: { summary: "false" } },
    },
    disabled: {
      control: "boolean",
      description: "Desabilita o campo.",
      table: { defaultValue: { summary: "false" } },
    },
    iconLeft: {
      control: "select",
      options: Object.keys(icons),
      mapping: icons,
      description: "Ícone antes do texto. Decorativo: o leitor de tela lê o label.",
    },
    iconRight: {
      control: "select",
      options: Object.keys(icons),
      mapping: icons,
      description: "Ícone depois do texto.",
    },
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { description: "Usamos só para avisos da conta." },
};

export const WithLabelInfo: Story = {
  name: "Com info no label",
  parameters: {
    docs: {
      description: {
        story:
          "Com labelInfo, um ícone de info no fim do label abre um Toggletip com ajuda extra. Use para o que é bom saber, mas não é necessário para preencher: o necessário vai na ajuda (description), sempre visível. Para o leitor de tela, o ícone se chama Mais informações sobre o nome do campo.",
      },
    },
  },
  args: { description: "Você pode trocar depois." },
};

export const WithIcon: Story = {
  name: "Com ícone",
  args: { iconLeft: "Mail" },
};

export const WithError: Story = {
  name: "Com erro",
  args: {
    defaultValue: "voce@exemplo",
    description: "Usamos só para avisos da conta.",
    error: "Falta o domínio, como @gmail.com.",
    iconLeft: "Mail",
  },
};

export const Disabled: Story = {
  name: "Desabilitado",
  args: { disabled: true, defaultValue: "voce@exemplo.com" },
};

export const ReadOnly: Story = {
  name: "Somente leitura",
  parameters: {
    docs: {
      description: {
        story:
          "O valor aparece e pode ser selecionado e copiado, mas não editado. O fundo bg-readonly e a borda que não escurece mostram que o campo não é editável; o leitor de tela anuncia somente leitura. Diferente do desabilitado, o texto mantém o contraste pleno e o campo recebe foco. No mouse, o cursor é a seta normal: nem o de digitar, nem o de proibido do desabilitado.",
      },
    },
  },
  args: {
    readOnly: true,
    defaultValue: "Plano Pro",
    label: "Plano atual",
    labelInfo: "Para mudar de plano, vá em Assinatura.",
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Input {...args} size="sm" label="Pequeno (sm)" labelInfo="Altura de 32px." />
      <Input {...args} size="md" label="Médio (md)" labelInfo="Altura de 40px, o padrão." />
    </div>
  ),
};

export const WithoutLabel: Story = {
  name: "Sem label (busca)",
  parameters: {
    docs: {
      description: {
        story:
          "Quando o contexto já diz o que é o campo, como uma busca, o label pode ficar escondido. O aria-label continua dando o nome para o leitor de tela.",
      },
    },
  },
  args: { label: undefined, "aria-label": "Buscar", placeholder: "Buscar", iconLeft: "Search" },
};

export const WithButton: Story = {
  name: "Com botão ao lado",
  parameters: {
    docs: {
      description: {
        story:
          "Campo e botão do mesmo tamanho ficam alinhados na mesma altura e com o mesmo canto.",
      },
    },
  },
  render: (args) => (
    <div className="flex w-md items-end gap-2">
      <Input {...args} className="flex-1" />
      <Button size={args.size ?? "md"}>Assinar</Button>
    </div>
  ),
};
