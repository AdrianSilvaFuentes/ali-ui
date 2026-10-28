import {
  IconAlertCircle,
  IconAlertTriangle,
  IconArrowLeft,
  IconArrowRight,
  IconBell,
  IconCalendar,
  IconCheck,
  IconChevronDown,
  IconChevronRight,
  IconCircleCheck,
  IconCopy,
  IconDots,
  IconDownload,
  IconExternalLink,
  IconEye,
  IconEyeOff,
  IconFilter,
  IconHeart,
  IconHome,
  IconInfoCircle,
  IconMenu2,
  IconPencil,
  IconPlus,
  IconSearch,
  IconSettings,
  IconStar,
  IconTrash,
  IconUpload,
  IconUser,
  IconX,
  type Icon as TablerIcon,
} from "@tabler/icons-react";
import { Code, Section, Table, TokensLayout } from "./TokensLayout";

/** Tamanhos recomendados: classes de tamanho do Tailwind, que vêm da escala de spacing. */
const sizes = [
  { className: "size-4", px: "16px", use: "Dentro de textos pequenos e botões compactos" },
  { className: "size-5", px: "20px", use: "Padrão: botões, campos e menus" },
  { className: "size-6", px: "24px", use: "Destaques e navegação" },
] as const;

/** Tokens de cor de ícone, com a classe e um exemplo. */
const colors = [
  { token: "icon-default", className: "text-icon-default", icon: IconSettings },
  { token: "icon-subtle", className: "text-icon-subtle", icon: IconSearch },
  { token: "icon-disabled", className: "text-icon-disabled", icon: IconPencil },
  { token: "icon-success", className: "text-icon-success", icon: IconCircleCheck },
  { token: "icon-caution", className: "text-icon-caution", icon: IconAlertCircle },
  { token: "icon-warning", className: "text-icon-warning", icon: IconAlertTriangle },
  { token: "icon-danger", className: "text-icon-danger", icon: IconAlertCircle },
  { token: "icon-info", className: "text-icon-info", icon: IconInfoCircle },
] as const;

/** Ícones mais comuns em interfaces. O conjunto completo está em tabler.io/icons. */
const common: [string, TablerIcon][] = [
  ["IconSearch", IconSearch],
  ["IconPlus", IconPlus],
  ["IconX", IconX],
  ["IconCheck", IconCheck],
  ["IconChevronDown", IconChevronDown],
  ["IconChevronRight", IconChevronRight],
  ["IconArrowLeft", IconArrowLeft],
  ["IconArrowRight", IconArrowRight],
  ["IconMenu2", IconMenu2],
  ["IconDots", IconDots],
  ["IconSettings", IconSettings],
  ["IconUser", IconUser],
  ["IconHome", IconHome],
  ["IconBell", IconBell],
  ["IconCalendar", IconCalendar],
  ["IconFilter", IconFilter],
  ["IconPencil", IconPencil],
  ["IconTrash", IconTrash],
  ["IconCopy", IconCopy],
  ["IconDownload", IconDownload],
  ["IconUpload", IconUpload],
  ["IconExternalLink", IconExternalLink],
  ["IconEye", IconEye],
  ["IconEyeOff", IconEyeOff],
  ["IconHeart", IconHeart],
  ["IconStar", IconStar],
  ["IconInfoCircle", IconInfoCircle],
  ["IconAlertTriangle", IconAlertTriangle],
  ["IconCircleCheck", IconCircleCheck],
  ["IconAlertCircle", IconAlertCircle],
];

export function IconsPage() {
  return (
    <TokensLayout
      title="Icons"
      description="Ícones de contorno do Tabler Icons (MIT), com traço leve de 1.5px. O tamanho vem das classes size-* e a cor dos tokens de icon."
    >
      {() => (
        <>
          <Section
            title="Como usar"
            description="Importe o ícone pelo nome e defina tamanho e cor por classe. Ícone sem texto ao lado precisa de um rótulo no botão (aria-label); ícone decorativo ao lado de texto leva aria-hidden."
          >
            <pre className="overflow-x-auto rounded-md border border-subtle bg-surface p-4">
              <Code>
                {`import { IconSearch } from "@tabler/icons-react";

<IconSearch className="size-5 text-icon-default" aria-hidden />`}
              </Code>
            </pre>
          </Section>

          <Section
            title="Tamanhos"
            description="Use os três tamanhos abaixo. O traço é sempre 1.5px: o CSS da Ali UI fixa essa espessura, e os ícones preenchidos (…Filled) são bloqueados pelo lint."
          >
            <Table columns={["Classe", "Tamanho", "Quando usar", "Exemplo"]}>
              {sizes.map(({ className, px, use }) => (
                <tr key={className} className="border-t border-subtle align-middle">
                  <td className="px-4 py-3 font-mono text-body-md whitespace-nowrap">
                    {className}
                  </td>
                  <td className="px-4 py-3 font-mono text-body-md whitespace-nowrap">{px}</td>
                  <td className="px-4 py-3 text-body-md">{use}</td>
                  <td className="px-4 py-3">
                    <IconSettings className={`${className} text-icon-default`} aria-hidden />
                  </td>
                </tr>
              ))}
            </Table>
          </Section>

          <Section
            title="Cores"
            description="A cor do ícone vem sempre de um token de icon. Nos status, acompanhe o ícone de um texto: a cor sozinha não basta para dar o significado."
          >
            <Table columns={["Token", "Classe", "Exemplo"]}>
              {colors.map(({ token, className, icon: Icon }) => (
                <tr key={token} className="border-t border-subtle align-middle">
                  <td className="px-4 py-3 text-label-md whitespace-nowrap">{token}</td>
                  <td className="px-4 py-3 font-mono text-body-md whitespace-nowrap">
                    {className}
                  </td>
                  <td className="px-4 py-3">
                    <Icon className={`size-6 ${className}`} aria-hidden />
                  </td>
                </tr>
              ))}
            </Table>
          </Section>

          <Section
            title="Mais usados"
            description="Uma seleção para começar. Para procurar outros, use a busca em tabler.io/icons e importe pelo nome do componente."
          >
            <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-subtle bg-surface-sunken sm:grid-cols-3 lg:grid-cols-5">
              {common.map(([name, Icon]) => (
                <li key={name} className="flex flex-col items-center gap-3 bg-surface px-4 py-6">
                  <Icon className="size-6 text-icon-default" aria-hidden />
                  <span className="font-mono text-body-sm text-subtle">{name}</span>
                </li>
              ))}
            </ul>
          </Section>
        </>
      )}
    </TokensLayout>
  );
}
