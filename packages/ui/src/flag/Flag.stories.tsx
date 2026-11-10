import type { Meta, StoryObj } from "@storybook/react-vite";
import { AR, BR, CL, CO, DE, ES, FR, JP, MX, PT, US, UY } from "country-flag-icons/react/3x2";
import type { ReactElement, SVGProps } from "react";
import { Flag } from "./Flag.tsx";

const meta = {
  title: "Components/Data display/Flag",
  component: Flag,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A bandeira de um país numa moldura de 20×14px, perto da proporção 3:2 das bandeiras, com canto sm (4px). A bandeira preenche a moldura toda, cortando o que sobrar, e tem um contorno border-subtle por dentro, como o Avatar, para bandeiras com branco na borda (Japão) não sumirem no fundo. Mantém o tamanho mesmo dentro de quem dimensiona os ícones de dentro, como o campo do Input.\n\nO design system não traz as bandeiras: passe o SVG de uma biblioteca, como a country-flag-icons (licença MIT), que entrega cada país como componente React: <Flag><BR /></Flag>. Nos exemplos daqui, ela entra só no Storybook.\n\nSem label, a bandeira é decorativa e fica escondida do leitor de tela: use assim quando o nome do país já aparece ao lado, como nas opções do Select e do Combobox. Sozinha, passe label com o nome do país.",
      },
    },
  },
  args: { label: "Brasil", children: <BR /> },
  argTypes: {
    label: { control: "text", description: "Nome do país, para o leitor de tela." },
    children: { control: false, description: "A bandeira: um SVG na proporção 3:2." },
  },
} satisfies Meta<typeof Flag>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const countries: [string, ReactElement<SVGProps<SVGSVGElement>>][] = [
  ["Brasil", <BR key="br" />],
  ["Argentina", <AR key="ar" />],
  ["Chile", <CL key="cl" />],
  ["Colômbia", <CO key="co" />],
  ["México", <MX key="mx" />],
  ["Uruguai", <UY key="uy" />],
  ["Portugal", <PT key="pt" />],
  ["Espanha", <ES key="es" />],
  ["França", <FR key="fr" />],
  ["Alemanha", <DE key="de" />],
  ["Estados Unidos", <US key="us" />],
  ["Japão", <JP key="jp" />],
];

export const Gallery: Story = {
  name: "Vários países",
  render: () => (
    <div className="grid grid-cols-6 gap-3">
      {countries.map(([name, svg]) => (
        <Flag key={name} label={name}>
          {svg}
        </Flag>
      ))}
    </div>
  ),
};
