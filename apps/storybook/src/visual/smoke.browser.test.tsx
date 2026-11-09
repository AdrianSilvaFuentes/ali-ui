import { composeStories, setProjectAnnotations } from "@storybook/react-vite";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import { afterEach, expect, test } from "vitest";
import * as ButtonStories from "../../../../packages/ui/src/button/Button.stories";
import preview from "../../.storybook/preview";

setProjectAnnotations(preview);

const { Playground } = composeStories(ButtonStories);

let container: HTMLDivElement | undefined;
afterEach(() => container?.remove());

// Prova de que o CSS real (Tailwind + tokens) chega ao navegador.
test("Button story renders with real CSS", () => {
  container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  flushSync(() => root.render(<Playground />));

  const button = container.querySelector("button");
  expect(button).not.toBeNull();
  const style = getComputedStyle(button as HTMLButtonElement);
  // Valores do tamanho md e da variante principal: só batem se o CSS real carregou.
  expect(style.fontSize).toBe("14px");
  expect(style.height).toBe("32px");
  expect(style.backgroundImage).toContain("gradient");
  root.unmount();
});
