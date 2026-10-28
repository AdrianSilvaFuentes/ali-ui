import {
  IconBrandGithub,
  IconBrandPnpm,
  IconBrandReact,
  IconBrandStorybook,
  IconBrandTailwind,
  IconBrandTypescript,
  IconBrandVercel,
  IconBrandVite,
  IconChecks,
  IconStack2,
  IconTestPipe,
  type Icon as TablerIcon,
} from "@tabler/icons-react";
import { type ReactNode, useState } from "react";

type Language = "pt" | "en";

const references = ["Carbon", "Atlassian Design System", "Material Design"] as const;

/**
 * Ferramentas por grupo, com o ícone do Tabler de cada uma. Turborepo, Vitest e Biome não
 * têm ícone de marca: usam um ícone da função (camadas, testes e lint).
 * Os nomes dos grupos e as funções ficam nos textos de cada idioma, na mesma ordem.
 */
const stack: readonly (readonly (readonly [string, TablerIcon])[])[] = [
  [
    ["React", IconBrandReact],
    ["TypeScript", IconBrandTypescript],
    ["Tailwind CSS 4", IconBrandTailwind],
  ],
  [
    ["pnpm", IconBrandPnpm],
    ["Turborepo", IconStack2],
    ["Vite", IconBrandVite],
  ],
  [
    ["Vitest", IconTestPipe],
    ["Biome", IconChecks],
    ["GitHub Actions", IconBrandGithub],
  ],
  [
    ["Storybook 9", IconBrandStorybook],
    ["Vercel", IconBrandVercel],
  ],
];

const startHere = [
  ["Colors", "foundations-colors--surface"],
  ["Typography", "foundations-typography--text-styles"],
  ["Spacing & Layout", "foundations-spacing-layout--spacing"],
  ["Motion", "foundations-motion--durations"],
] as const;

/** Textos da página em cada idioma. A estrutura é a mesma; só as palavras mudam. */
const copy = {
  pt: {
    switchLabel: "Idioma",
    eyebrow: "Ali UI · Design system",
    title: "Oi, eu sou Ali.",
    lead: "Adrian Silva Fuentes nos documentos, mas todo mundo me chama de Ali. Sou UX Designer há mais de cinco anos e, nos últimos tempos, venho investigando, aprendendo e transformando a minha forma de trabalhar com inteligência artificial.",
    craftLabel: "Do desenho ao componente",
    craft: [
      "Sou apaixonado por design e por front-end, e principalmente pelo ponto em que os dois se encontram: tirar o desenho do papel e transformá-lo em componentes que funcionam de verdade, dentro de sistemas reais.",
      "O Ali UI é onde pratico isso de ponta a ponta: tokens, documentação, testes de acessibilidade e código, cada decisão registrada num pull request.",
    ],
    purposeLabel: "O intuito",
    purpose: [
      "Um design system com linha editorial clara: ir atrás de comportamentos e componentes que escalam para diferentes tipos de operação e de indústria.",
      "Poucos componentes, cada um com personalidade. Específicos, e não genéricos: em vez de repetir o que todo kit já oferece, o foco está nas peças que resolvem problemas concretos.",
    ],
    referencesLabel: "Referências",
    referencesBefore: "Me inspiro em design systems maduros, como ",
    referencesAnd: " e ",
    referencesAfter:
      ", entre outros. Uso parte dessas referências junto com o Tailwind CSS para construir componentes especiais, mais específicos para cada contexto.",
    stackLabel: "Stack",
    stackGroups: [
      {
        label: "Componentes e estilos",
        roles: ["componentes", "em modo estrito", "estilos a partir dos tokens"],
      },
      {
        label: "Repositório e construção",
        roles: ["pacotes do monorepo", "tarefas do monorepo", "build e servidor local"],
      },
      {
        label: "Qualidade",
        roles: [
          "testes, incluindo contraste WCAG",
          "lint e formatação",
          "verificação a cada pull request",
        ],
      },
      { label: "Documentação e publicação", roles: ["documentação", "publicação do Storybook"] },
    ],
    startLabel: "Por onde começar",
    startDescriptions: [
      "Primitivos, superfícies por altura, texto e bordas.",
      "Estilos de texto, famílias e pesos.",
      "Espaçamento, padding, raios e sombras.",
      "Durações de animação.",
    ],
    status:
      "Por enquanto o projeto está nas fundações: os tokens estão prontos, e os componentes vêm a seguir.",
    footer: "Aprendizado contínuo e autodidata: este sistema evolui a cada pull request.",
    footerLink: "Ver o código no GitHub",
  },
  en: {
    switchLabel: "Language",
    eyebrow: "Ali UI · Design system",
    title: "Hi, I'm Ali.",
    lead: "Adrian Silva Fuentes on paper, but everybody calls me Ali. I'm a UX Designer with more than five years of experience, and lately I've been exploring, learning and reshaping the way I work with artificial intelligence.",
    craftLabel: "From design to component",
    craft: [
      "I'm passionate about design and front-end, and above all about where they meet: taking a design off the page and turning it into components that actually work, inside real systems.",
      "Ali UI is where I practice that end to end: tokens, documentation, accessibility tests and code, with every decision recorded in a pull request.",
    ],
    purposeLabel: "The purpose",
    purpose: [
      "A design system with a clear editorial line: going after behaviors and components that scale across different kinds of operations and industries.",
      "Few components, each one with personality. Specific rather than generic: instead of repeating what every kit already offers, the focus is on pieces that solve concrete problems.",
    ],
    referencesLabel: "References",
    referencesBefore: "I draw on mature design systems such as ",
    referencesAnd: " and ",
    referencesAfter:
      ", among others. I combine part of those references with Tailwind CSS to build special components, tailored to each context.",
    stackLabel: "Stack",
    stackGroups: [
      {
        label: "Components and styles",
        roles: ["components", "in strict mode", "styles from the tokens"],
      },
      {
        label: "Repository and build",
        roles: ["monorepo packages", "monorepo tasks", "build and local server"],
      },
      {
        label: "Quality",
        roles: [
          "tests, including WCAG contrast",
          "lint and formatting",
          "checks on every pull request",
        ],
      },
      { label: "Docs and deployment", roles: ["documentation", "Storybook deployment"] },
    ],
    startLabel: "Where to start",
    startDescriptions: [
      "Primitives, surfaces by height, text and borders.",
      "Text styles, font families and weights.",
      "Spacing, padding, radius and shadows.",
      "Animation durations.",
    ],
    status:
      "For now the project is at the foundations stage: the tokens are ready, and components come next.",
    footer: "Continuous, self-taught learning: this system grows with every pull request.",
    footerLink: "See the code on GitHub",
  },
} satisfies Record<Language, unknown>;

/** Português para quem navega em português; inglês para todo o resto. */
function initialLanguage(): Language {
  return navigator.language.toLowerCase().startsWith("pt") ? "pt" : "en";
}

function Block({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="grid gap-4 border-t border-subtle pt-8 md:grid-cols-[12rem_1fr]">
      <h2 className="text-label-md text-subtle">{label}</h2>
      <div className="flex max-w-2xl flex-col gap-4">{children}</div>
    </section>
  );
}

function LanguageSwitch({
  language,
  onChange,
}: {
  language: Language;
  onChange: (language: Language) => void;
}) {
  return (
    <fieldset className="flex rounded-md border border-subtle bg-surface p-0.5">
      <legend className="sr-only">{copy[language].switchLabel}</legend>
      {(["pt", "en"] as const).map((option) => (
        <button
          key={option}
          type="button"
          lang={option}
          aria-pressed={language === option}
          onClick={() => onChange(option)}
          className={`rounded-sm px-3 py-1 text-label-md uppercase focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${
            language === option
              ? "bg-surface-raised text-default shadow-raised"
              : "text-subtle hover:text-default"
          }`}
        >
          {option}
        </button>
      ))}
    </fieldset>
  );
}

export function IntroductionPage() {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const t = copy[language];

  return (
    <div
      lang={language}
      className="flex min-h-screen flex-col gap-12 bg-surface-sunken px-8 py-12 text-body-lg text-default md:px-16"
    >
      <header className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <p className="text-label-md text-subtle">{t.eyebrow}</p>
          <LanguageSwitch language={language} onChange={setLanguage} />
        </div>
        <h1 className="text-display">{t.title}</h1>
        <p className="max-w-3xl text-body-lg">{t.lead}</p>
      </header>

      <Block label={t.craftLabel}>
        {t.craft.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </Block>

      <Block label={t.purposeLabel}>
        {t.purpose.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </Block>

      <Block label={t.referencesLabel}>
        <p>
          {t.referencesBefore}
          {references.map((name, index) => (
            <span key={name}>
              <span className="font-medium">{name}</span>
              {index < references.length - 2 ? ", " : ""}
              {index === references.length - 2 ? t.referencesAnd : ""}
            </span>
          ))}
          {t.referencesAfter}
        </p>
      </Block>

      <Block label={t.stackLabel}>
        <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          {stack.map((items, groupIndex) => {
            const group = t.stackGroups[groupIndex];
            return (
              <div key={group?.label} className="flex flex-col gap-3">
                <h3 className="text-label-sm text-subtle">{group?.label}</h3>
                <ul className="flex flex-col gap-2">
                  {items.map(([name, Icon], index) => (
                    <li key={name} className="flex items-start gap-3">
                      <Icon className="mt-0.5 size-5 shrink-0 text-icon-default" aria-hidden />
                      <span className="flex flex-col">
                        <span className="text-label-md">{name}</span>
                        <span className="text-body-md text-subtle">{group?.roles[index]}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Block>

      <Block label={t.startLabel}>
        <ul className="grid gap-4 sm:grid-cols-2">
          {startHere.map(([title, id], index) => (
            <li key={id}>
              <a
                href={`./?path=/story/${id}`}
                target="_top"
                className="flex h-full flex-col gap-1 rounded-md border border-subtle bg-surface-raised p-4 shadow-raised hover:border-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
              >
                <span className="text-label-md text-link">{title}</span>
                <span className="text-body-md text-subtle">{t.startDescriptions[index]}</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="text-body-md text-subtle">{t.status}</p>
      </Block>

      <footer className="border-t border-subtle pt-8 text-body-md text-subtle">
        {t.footer}{" "}
        <a
          href="https://github.com/AdrianSilvaFuentes/ali-ui"
          className="text-link underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          {t.footerLink}
        </a>
        .
      </footer>
    </div>
  );
}
