# Ali UI

A personal design system and component library. Original, editorial, lean:
few components, each one with personality.

**[Browse the Storybook →](https://ali-ui-delta.vercel.app)**

> Status: foundations. The token system is in place (color, surface elevation,
> typography, spacing, radius, shadow, motion, light and dark themes).
> Components come next.

## Principles

- **Semantic tokens only.** Components use role-based names (`bg-surface-raised`,
  `text-muted-foreground`), never raw values. A lint rule blocks primitive imports
  and arbitrary Tailwind values like `bg-[#ff0000]` or `p-[13px]`.
- **Accessible by default.** Every text and border pairing is checked against
  WCAG AA (4.5:1 for text, 3:1 for controls and focus) in both themes, on every
  surface. A failing contrast fails the build.
- **Elevation, not decoration.** Four surface heights (sunken, default, raised,
  overlay). In light mode height comes from shadow; in dark mode from color.
- **One name everywhere.** A token keeps the same name in TypeScript, CSS and
  Tailwind: `spacing` → `--ali-spacing-4` → `p-4`.

## Foundations

| Group              | What's in it                                                                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Color primitives   | `neutral-light`, `neutral-dark`, brand `primary` (mint), and status scales `red`, `green`, `orange`, `yellow`, `blue`, 11 steps each (50 to 950) |
| Surface            | `surface-sunken`, `surface`, `surface-raised`, `surface-overlay`                                                                                 |
| Text, icon, border | `default`, `subtle`, `disabled`, `link`; `border-default`, `border-subtle`, `border-disabled`, `border-focus`                                    |
| Spacing            | Tailwind CSS 4 numeric scale (`0` to `32`, 4px per step)                                                                                         |
| Radius             | `none` to `3xl`, plus `full`                                                                                                                     |
| Shadow             | `2xs` to `2xl`, plus `shadow-raised` and `shadow-overlay`                                                                                        |
| Typography         | DM Sans; text styles `display`, `title`, `body` and `label`                                                                                      |
| Motion             | `instant`, `fast`, `base`, `slow`                                                                                                                |

## How it's built

Designed by Ali and built with AI ([Claude Code](https://claude.com/claude-code)).
Every decision goes through a pull request, so the reasoning lives in the history.

- **Monorepo:** pnpm workspaces and Turborepo
- **Code:** TypeScript (strict), Tailwind CSS 4, React
- **Quality:** Biome (lint and format), Vitest, GitHub Actions on every pull request
- **Docs and deploy:** Storybook 9 on Vercel

```
packages/tokens   @ali/tokens — design tokens as CSS variables, Tailwind theme and TypeScript
packages/ui       @ali/ui — components (coming soon)
apps/storybook    documentation
```

## Run it locally

Requires Node 22.18 or newer and pnpm.

```bash
pnpm install
pnpm storybook   # documentation at http://localhost:6006
pnpm check       # lint, types and tests
pnpm build
```
