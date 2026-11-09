import type { ThemeName } from "@ali/tokens";
import { composeStories, type composeStory, setProjectAnnotations } from "@storybook/react-vite";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import { afterAll, describe, expect, test } from "vitest";
import { commands } from "vitest/browser";
import preview from "../../.storybook/preview";
import { audit, type Finding, readAllowed } from "./token-audit";

setProjectAnnotations(preview);

type StoriesModule = Parameters<typeof composeStories>[0];
type ComposedStory = ReturnType<typeof composeStory>;

// Sem transições: o estilo é lido já no estado final, não no meio de uma animação.
const still = document.createElement("style");
still.textContent = "*,*::before,*::after{transition:none!important;animation:none!important}";
document.head.append(still);

const modules = import.meta.glob<StoriesModule>("../../../../packages/ui/src/**/*.stories.tsx", {
  eager: true,
});

const themes: ThemeName[] = ["light", "dark"];
const report: Record<string, Finding[]> = {};

const frame = () => new Promise((resolve) => requestAnimationFrame(resolve));

for (const [path, module] of Object.entries(modules)) {
  describe(path.split("/").at(-1) as string, () => {
    for (const theme of themes) {
      const stories = composeStories(module, {
        initialGlobals: { ...preview.initialGlobals, theme },
      });
      for (const [name, Story] of Object.entries(stories) as [string, ComposedStory][]) {
        test(`${name} (${theme})`, async () => {
          const container = document.createElement("div");
          document.body.append(container);
          const root = createRoot(container);
          flushSync(() => root.render(<Story />));
          await frame();
          await frame();
          expect(document.documentElement.getAttribute("data-theme")).toBe(theme);

          const findings = audit(document.body, readAllowed());
          root.unmount();
          container.remove();

          if (findings.length) report[`${Story.id} (${theme})`] = findings;
          expect(findings).toEqual([]);
        });
      }
    }
  });
}

afterAll(async () => {
  await commands.writeFile(".vitest/token-audit.json", JSON.stringify(report, null, 2));
});
