import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Checkbox } from "./Checkbox.tsx";

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Caixa de seleção, para aceitar algo ou escolher várias opções de uma lista. Clicar no label também marca. Pelo teclado, o Tab chega na caixa e o Espaço marca e desmarca.\n\nA caixa tem 16px, um tamanho só: ao lado de um label de 14px, ela equilibra sem pesar. Desmarcada, tem borda border-default, e não a subtle do Input: o contorno de um checkbox precisa de 3:1 de contraste para ser visto. Marcado, ganha o mesmo degradê e o brilho no topo do Button primary, e o check se desenha em 200ms (duration-base). No hover, marcado escurece como o Button primary, num fade. Ao desmarcar, o verde e o check somem num fade de 100ms (duration-fast). Quem pede menos movimento vê o check pronto, sem o desenho.\n\nO estado indeterminado (checked="indeterminate") mostra um traço e é anunciado como misto: use num "Selecionar todos" quando só parte da lista está marcada.\n\nLabel, ajuda, erro e labelInfo funcionam como no Input. O label usa label-md, como nos campos. A ajuda e o erro usam body-md, como nos campos, e ficam a 2px do label: abaixo de uma opção, a ajuda é lida junto com ela. O erro aparece com ícone e texto, nunca só com a cor vermelha. Com erro, a mensagem substitui a ajuda até o erro sumir: escreva o erro dizendo o que falta, porque a ajuda não aparece junto. Desabilitado fica cinza, marcado ou não.',
      },
    },
  },
  args: {
    label: "Quero receber a newsletter",
    labelInfo: "Um email por semana. Dá para cancelar quando quiser.",
    disabled: false,
  },
  argTypes: {
    label: { control: "text", description: "Texto ao lado da caixa. Clicar nele também marca." },
    labelInfo: {
      control: "text",
      description: "Ajuda extra num ícone de info no fim do label, que abre um Toggletip.",
    },
    description: { control: "text", description: "Texto de ajuda abaixo do label." },
    error: {
      control: "text",
      description: "Mensagem de erro. Marca como inválido e aparece com ícone.",
    },
    disabled: {
      control: "boolean",
      description: "Desabilita o checkbox.",
      table: { defaultValue: { summary: "false" } },
    },
    defaultChecked: { control: "boolean", description: "Começa marcado (sem controlar o estado)." },
    className: { control: false, description: "Classes do bloco inteiro." },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { description: "Novidades da Ali UI, sem propaganda." },
};

export const Checked: Story = {
  name: "Marcado",
  args: { defaultChecked: true },
};

export const WithError: Story = {
  name: "Com erro",
  args: {
    label: "Li e aceito os termos de uso",
    labelInfo: undefined,
    error: "Aceite os termos para continuar.",
  },
};

export const Disabled: Story = {
  name: "Desabilitado",
  render: (args) => (
    <div className="flex flex-col gap-3">
      <Checkbox {...args} disabled label="Desabilitado" labelInfo={undefined} />
      <Checkbox
        {...args}
        disabled
        defaultChecked
        label="Desabilitado e marcado"
        labelInfo={undefined}
      />
    </div>
  ),
};

const options = ["Novidades", "Dicas de uso", "Convites para testes"];

/** Lista com "Selecionar todos", que fica indeterminado quando só parte está marcada. */
function SelectAllDemo() {
  const [selected, setSelected] = useState<string[]>(["Novidades"]);
  const all = selected.length === options.length;
  const none = selected.length === 0;

  return (
    <div className="flex w-xs flex-col gap-3">
      <Checkbox
        label="Todos os emails"
        checked={all ? true : none ? false : "indeterminate"}
        onCheckedChange={() => setSelected(all ? [] : options)}
      />
      <div className="flex flex-col gap-3 pl-6">
        {options.map((option) => (
          <Checkbox
            key={option}
            label={option}
            checked={selected.includes(option)}
            onCheckedChange={(checked) =>
              setSelected((current) =>
                checked ? [...current, option] : current.filter((item) => item !== option),
              )
            }
          />
        ))}
      </div>
    </div>
  );
}

export const Indeterminate: Story = {
  name: "Indeterminado (selecionar todos)",
  parameters: {
    docs: {
      description: {
        story:
          "Quando só parte da lista está marcada, o Todos os emails fica indeterminado: mostra um traço e o leitor de tela anuncia misto. Clicar nele marca todos; clicar de novo desmarca todos.",
      },
    },
  },
  render: () => <SelectAllDemo />,
};
