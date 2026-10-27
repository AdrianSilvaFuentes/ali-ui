import { Section } from "./TokensLayout";

/** As quatro alturas de superfície empilhadas, do rebaixado ao sobreposto. */
export function ElevationDemo() {
  return (
    <Section
      title="Alturas"
      description="No tema claro a altura vem da sombra; no escuro, da cor: quanto mais alto, mais claro. Troque o tema para comparar."
    >
      <div className="rounded-lg bg-surface-sunken p-6">
        <p className="mb-3 text-caption text-muted-foreground">surface-sunken</p>
        <div className="rounded-md border border-border bg-surface p-6">
          <p className="mb-4 text-caption text-muted-foreground">surface</p>
          <div className="flex flex-wrap items-start gap-6">
            <div className="w-64 rounded-md bg-surface-raised p-4 shadow-raised">
              <p className="text-label">Cartão</p>
              <p className="mt-1 text-body-sm text-muted-foreground">
                surface-raised · shadow-raised
              </p>
            </div>
            <div className="w-56 rounded-md border border-border bg-surface-overlay p-2 shadow-overlay">
              <p className="px-2 pt-1 pb-2 text-caption text-muted-foreground">
                surface-overlay · shadow-overlay
              </p>
              {["Editar", "Duplicar"].map((item) => (
                <p
                  key={item}
                  className="rounded-sm px-2 py-1.5 text-body-sm hover:bg-surface-sunken"
                >
                  {item}
                </p>
              ))}
              <p className="rounded-sm px-2 py-1.5 text-body-sm text-danger hover:bg-surface-sunken">
                Excluir
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
