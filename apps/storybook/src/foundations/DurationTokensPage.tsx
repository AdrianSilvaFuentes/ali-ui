import { duration, vars } from "@ali/tokens";
import { useState } from "react";
import { Section, Table, TokensLayout } from "./TokensLayout";

const usage: Record<keyof typeof duration, string> = {
  instant: "Mudanças sem animação.",
  fast: "Hover, foco e pequenos estados.",
  base: "Abrir e fechar elementos pequenos.",
  slow: "Movimentos maiores, como painéis.",
};

/** Botão que move um ponto com a duração do token, para comparar a velocidade. */
function DurationDemo({ name }: { name: keyof typeof duration }) {
  const [moved, setMoved] = useState(false);
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => setMoved((value) => !value)}
        aria-pressed={moved}
        className="rounded-sm border border-border-strong bg-surface px-3 py-0.5 text-label hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
      >
        Testar
      </button>
      <div className="relative h-3 w-24 rounded-full bg-muted ring-1 ring-border">
        <div
          className="absolute top-0 left-0 size-3 rounded-full bg-primary transition-transform motion-reduce:transition-none"
          style={{
            transitionDuration: vars.duration[name],
            transform: moved
              ? "translateX(calc(var(--ali-space-24) - var(--ali-space-3)))"
              : "none",
          }}
        />
      </div>
    </div>
  );
}

export function DurationTokensPage() {
  return (
    <TokensLayout title="Durations" description="Animações curtas, por velocidade.">
      {() => (
        <Section
          title="Escala"
          description="Use com o utilitário duration: duration-fast. Quem pede menos movimento no sistema não vê a animação."
        >
          <Table columns={["Token", "Valor", "Uso", "Exemplo"]}>
            {(Object.keys(duration) as (keyof typeof duration)[]).map((name) => (
              <tr key={name} className="border-t border-border align-middle">
                <td className="px-4 py-3 text-label whitespace-nowrap">duration-{name}</td>
                <td className="px-4 py-3 font-mono text-body-sm">{duration[name]}</td>
                <td className="px-4 py-3 text-body-sm text-muted-foreground">{usage[name]}</td>
                <td className="px-4 py-3">
                  <DurationDemo name={name} />
                </td>
              </tr>
            ))}
          </Table>
        </Section>
      )}
    </TokensLayout>
  );
}
