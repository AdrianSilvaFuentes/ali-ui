import { describe, expect, it } from "vitest";
import { cn } from "./cn.ts";

describe("cn", () => {
  it("junta classes e ignora as vazias", () => {
    expect(cn("p-4", false, undefined, "bg-surface")).toBe("p-4 bg-surface");
  });

  it("mantém tamanho e cor de texto juntos", () => {
    expect(cn("text-body-md text-default", "text-inverse")).toBe("text-body-md text-inverse");
  });

  it("mantém sombra externa e brilho interno juntos", () => {
    expect(cn("shadow-sm", "inset-shadow-highlight")).toBe("shadow-sm inset-shadow-highlight");
    expect(cn("inset-shadow-highlight", "inset-shadow-none")).toBe("inset-shadow-none");
  });

  it("mantém degradê e cor de fundo juntos", () => {
    expect(cn("bg-gradient-brand", "bg-disabled")).toBe("bg-gradient-brand bg-disabled");
  });

  it("a última classe do mesmo tipo vence", () => {
    expect(cn("text-label-md", "text-label-lg")).toBe("text-label-lg");
    expect(cn("bg-brand", "bg-disabled")).toBe("bg-disabled");
    expect(cn("px-4", "px-3")).toBe("px-3");
    expect(cn("bg-gradient-brand", "bg-gradient-brand-hovered")).toBe("bg-gradient-brand-hovered");
  });
});
