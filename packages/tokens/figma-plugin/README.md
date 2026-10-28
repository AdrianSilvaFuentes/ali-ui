# Plugin do Figma · Ali UI

Cria e atualiza as variáveis do Figma a partir dos tokens do código. O código é a fonte
da verdade: rodar o plugin de novo atualiza os valores, cria as variáveis novas e remove
as que saíram, sem duplicar coleções.

`code.js` e `manifest.json` são gerados por `pnpm build`. Não edite à mão.

## Primeira vez

1. Abra o arquivo no Figma Desktop.
2. Menu **Plugins → Development → Import plugin from manifest…**
3. Escolha `manifest.json` desta pasta.

## Depois de mudar os tokens

1. Rode `pnpm build` (atualiza esta pasta).
2. No Figma: **Plugins → Development → Ali UI · Sincronizar tokens**.

A mensagem no fim mostra quantas variáveis foram criadas, atualizadas e removidas.
No plano gratuito o Figma permite só um modo por coleção, então só o Light é criado.
