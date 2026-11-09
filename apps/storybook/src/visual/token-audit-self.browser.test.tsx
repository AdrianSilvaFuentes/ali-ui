import { expect, test } from "vitest";
import { audit, readAllowed } from "./token-audit";

// Prova de que a auditoria acusa valores fora dos tokens (e aceita os de dentro).
test("audit flags values outside the token scales", () => {
  const root = document.createElement("div");
  root.innerHTML = `
    <p style="padding: 13px; color: #123456; font-size: 15px; border-radius: 7px">Fora</p>
    <p style="padding: var(--ali-spacing-4); color: var(--ali-color-text); font-size: var(--ali-text-body-md); border-radius: var(--ali-radius-md)">Dentro</p>
    <button style="height: 33px; background: var(--ali-color-background-neutral); box-shadow: 0 3px 9px red">Botão</button>`;
  document.body.append(root);
  const findings = audit(root, readAllowed()).map((f) => `${f.property}: ${f.value}`);
  root.remove();

  expect(findings).toEqual(
    expect.arrayContaining([
      "padding-top: 13px",
      "color: rgb(18, 52, 86)",
      "font-size: 15px",
      "border-radius: 7px",
      "height: 33px",
      "box-shadow: rgb(255, 0, 0) 0px 3px 9px 0px",
    ]),
  );
  expect(findings.filter((f) => f.startsWith("padding"))).toHaveLength(4);
});
