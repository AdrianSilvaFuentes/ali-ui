import {
  IconBrandFigma,
  IconBrandGithub,
  IconBrandRadixUi,
  IconBrandReact,
  IconBrandStorybook,
  IconBrandTailwind,
  IconBrandTypescript,
} from "@tabler/icons-react";
import type { ReactNode } from "react";
import { useTheme } from "../theme";

/** As ferramentas do design system, na ordem do rodapé do painel. */
const tools = [
  ["Figma", IconBrandFigma],
  ["React", IconBrandReact],
  ["Storybook", IconBrandStorybook],
  ["TypeScript", IconBrandTypescript],
  ["Tailwind CSS", IconBrandTailwind],
  ["Radix UI", IconBrandRadixUi],
] as const;

interface ShowcasePanelProps {
  /** Grupo dos componentes, acima do título: "Form". */
  category: string;
  /** Título do painel: "Inputs and selects". */
  title: string;
  /** Os componentes, posicionados livremente na área do meio. */
  children?: ReactNode;
}

/**
 * Moldura dos painéis de showcase: 1024×768 (w-5xl, 4:3), fundo surface-sunken e raio 2xl.
 * Logo e GitHub no topo, categoria, título e ferramentas no rodapé. Feito para virar imagem.
 */
export function ShowcasePanel({ category, title, children }: ShowcasePanelProps) {
  const theme = useTheme();

  return (
    <section
      data-theme={theme}
      aria-label={`${category}: ${title}`}
      className="relative flex aspect-4/3 w-5xl flex-col overflow-hidden rounded-2xl bg-surface-sunken px-10 pt-8 pb-10 text-default"
    >
      <header className="flex items-start justify-between">
        <img
          src={theme === "dark" ? "./logo-ali-dark.svg" : "./logo-ali.svg"}
          alt="Ali Design System"
          width={200}
        />
        <a
          href="https://github.com/AdrianSilvaFuentes"
          className="flex items-center gap-2 rounded-sm text-label-lg text-default outline-focus focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <IconBrandGithub aria-hidden className="size-7 text-icon-default" />
          adriansilvafuentes
        </a>
      </header>

      <div className="relative flex-1">{children}</div>

      <footer className="flex items-end justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-title-sm text-subtle">{category}</p>
          <h2 className="text-title-lg text-default">{title}</h2>
        </div>
        <ul aria-label="Feito com" className="flex gap-3">
          {tools.map(([name, Icon]) => (
            <li key={name}>
              <Icon aria-hidden className="size-7 text-icon-default" />
              <span className="sr-only">{name}</span>
            </li>
          ))}
        </ul>
      </footer>
    </section>
  );
}
