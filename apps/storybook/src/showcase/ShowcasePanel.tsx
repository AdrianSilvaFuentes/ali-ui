import { neutralLight } from "@ali/tokens/primitives";
import { cn, Tooltip } from "@ali/ui";
import {
  IconBrandFigma,
  IconBrandGithub,
  IconBrandRadixUi,
  IconBrandReact,
  IconBrandStorybook,
  IconBrandTailwind,
  IconBrandTypescript,
} from "@tabler/icons-react";
import { createContext, type ReactNode, useContext, useLayoutEffect, useRef } from "react";
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
  /**
   * Faz cada `Reveal` aparecer em sequência ao abrir. Desligado, tudo aparece pronto: o jeito
   * de tirar a imagem do painel.
   */
  animate?: boolean;
}

/** O painel avisa os `Reveal` de dentro se a entrada é animada. */
const AnimateContext = createContext(false);

/** Intervalo entre a entrada de um `Reveal` e a do próximo. */
const STAGGER_MS = 60;

interface RevealProps {
  children: ReactNode;
  /** Classes do bloco, como o alinhamento dele na grade (self-end) ou a largura. */
  className?: string;
}

/**
 * Um bloco do showcase que entra com a animação do painel: aparece com fade e sobe 8px
 * (spacing-2), em 300ms (duration-slow), com a animação de entrada dos balões (ali-enter). O
 * painel dá a cada um o seu atraso, na ordem em que aparecem na página. Quem pede menos
 * movimento vê tudo direto.
 */
export function Reveal({ children, className }: RevealProps) {
  const animate = useContext(AnimateContext);
  return (
    <div
      data-reveal={animate || undefined}
      className={cn(
        animate &&
          "animate-[ali-enter_var(--ali-duration-slow)_ease-out_both] [--ali-enter-y:var(--ali-spacing-2)] motion-reduce:animate-none",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * Moldura dos painéis de showcase: 1024×768 (w-5xl, 4:3), fundo surface-sunken, canto de 16px
 * (rounded-2xl) e sombra xl, que solta o card do fundo cinza.
 * Logo e GitHub no topo, categoria, título e ferramentas no rodapé. Feito para virar imagem.
 */
export function ShowcasePanel({ category, title, children, animate = true }: ShowcasePanelProps) {
  const theme = useTheme();
  const contentRef = useRef<HTMLDivElement>(null);

  // Cada Reveal entra 60ms depois do anterior, na ordem da página. Antes de pintar: nenhum
  // aparece antes da hora.
  useLayoutEffect(() => {
    if (!animate) return;
    const items = contentRef.current?.querySelectorAll<HTMLElement>("[data-reveal]") ?? [];
    items.forEach((item, index) => {
      item.style.animationDelay = `${index * STAGGER_MS}ms`;
    });
  }, [animate]);

  return (
    <section
      data-theme={theme}
      aria-label={`${category}: ${title}`}
      className="relative flex aspect-4/3 w-5xl flex-col overflow-hidden rounded-2xl bg-surface-sunken shadow-xl px-10 pt-8 pb-10 text-default"
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

      {/* Ao ligar a animação de novo, a chave recria o conteúdo e a entrada toca outra vez. */}
      <div ref={contentRef} key={String(animate)} className="relative flex-1">
        <AnimateContext.Provider value={animate}>{children}</AnimateContext.Provider>
      </div>

      <footer className="flex items-end justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-title-sm text-subtle">{category}</p>
          <h2 className="text-title-lg text-default">{title}</h2>
        </div>
        <ul aria-label="Feito com" className="flex gap-3">
          {tools.map(([name, Icon]) => (
            <li key={name} className="flex">
              {/* O nome aparece num Tooltip no hover e no foco. O ícone é uma imagem com nome,
                  focável, para o teclado também chegar no Tooltip. */}
              <Tooltip content={name}>
                <span
                  role="img"
                  aria-label={name}
                  // biome-ignore lint/a11y/noNoninteractiveTabindex: o foco é o que abre o Tooltip pelo teclado.
                  tabIndex={0}
                  className="flex rounded-sm outline-focus focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  <Icon aria-hidden className="size-7 text-icon-default" />
                </span>
              </Tooltip>
            </li>
          ))}
        </ul>
      </footer>
    </section>
  );
}

/**
 * Fundo cinza atrás do card (neutral 200 da escala primitiva, igual nos dois temas), em vez do
 * branco do Storybook: o card se destaca e fica fácil de recortar ao gravar ou exportar.
 * Use como decorator da story, com `layout: "fullscreen"`.
 */
export function showcaseBackdrop(Story: () => ReactNode) {
  return (
    <div
      className="flex min-h-screen items-center justify-center p-10"
      style={{ backgroundColor: neutralLight[200] }}
    >
      <Story />
    </div>
  );
}
