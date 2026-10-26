# ali-ui

Design system and component library by Ali, an Engineer Designer.
Direction: original, editorial, lean. Few components, each one with personality.

## How to talk to me

- Reply in Brazilian Portuguese, in plain language. I am a designer who builds with AI and does not write code by hand.
- After each task, explain in 2-3 sentences what changed and why.
- Ask before big decisions (new dependency, folder restructure, deleting files).

## Stack

pnpm workspaces, Turborepo, TypeScript (strict), Biome, Tailwind CSS 4, Radix UI, class-variance-authority, Storybook 9.
Packages: `@ali/tokens`, `@ali/ui`. App: `apps/storybook`.

## Rules for components

- Build on Radix UI primitives for accessibility. Variants with CVA. Class merging with the `cn` helper.
- Never hardcode colors, font sizes, spacing, radii or shadows. Use only semantic tokens from `@ali/tokens`.
- Every component ships with three things: the `.tsx` file, a `.stories.tsx` (with controls and docs) and a test.
- Keyboard and screen reader support is mandatory: visible focus, correct roles, no color-only meaning.
- One component per task and one commit per component.
- No gradients, heavy shadows, large rounded corners or emoji icons unless I ask. Avoid the generic AI-generated look.

## Workflow

- Before saying a task is done, run `pnpm check` (lint, types, tests) and fix what fails.
- Commit messages follow Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`).
- Never push without asking me first.
- Never commit `.env`, secrets, or macOS junk files (`.DS_Store`, `._*`).

## Boundaries

- This is a personal project. Never use, copy, reference or import any code, names, designs or assets from any employer or private project.
- The repository may live on an external disk. Keep the pnpm store inside the project folder.
