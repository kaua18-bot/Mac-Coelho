# Contribuindo — Mac Coelho

Obrigado por contribuir! Este documento explica como editar o projeto em "partes" para facilitar revisão e deploy.

## Objetivo
O diretório `parts/` contém versões editáveis e isoladas dos componentes principais (layout, assets e função Netlify). Edite nessas partes para prototipar mudanças antes de aplicá-las ao site principal (`index.html`, `assets/`).

## Fluxo recomendado
1. Escolha o local para editar:
   - Pequenas mudanças no HTML: edite `parts/01-layout/index.html` ou a branch `feature/layout`.
   - Estilos/JS: edite `parts/02-assets/*` ou a branch `feature/assets`.
   - Função serverless (e-mail): edite `parts/03-netlify/*` ou a branch `feature/netlify`.
2. Teste localmente:
   - Abra os arquivos em `parts/01-layout` diretamente no navegador (referenciam `parts/02-assets` por padrão).
   - Para testar a função Netlify localmente use o Netlify CLI (`netlify dev`) e forneça as variáveis de ambiente necessárias localmente.
3. Commit & branch
   - Faça commits claros e pequenos. Use as branches criadas (`feature/layout`, `feature/assets`, `feature/netlify`, `docs/readme`) ou crie uma branch a partir de `main`.
4. Abra um Pull Request
   - Abra um PR para `main` com descrição clara do que mudou e screenshots (se aplicável).
   - peça reviews se quiser que eu revise antes do merge.
5. Mesclagem
   - Depois do merge, copie os arquivos aprovados (por exemplo, `parts/02-assets/script.js`) para os caminhos de produção (`assets/script.js`) e faça um commit final em `main`. Alternativamente, crie um PR que aplique essas mudanças no `main` diretamente.

## Variáveis de ambiente para deploy (Netlify)
A function `sendOrder.js` (em `parts/03-netlify`) necessita destas variáveis no painel do Netlify (Settings › Build & deploy › Environment):
- `SMTP_HOST` — servidor SMTP (ex.: smtp.gmail.com)
- `SMTP_PORT` — porta (ex.: 587)
- `SMTP_SECURE` — `true` ou `false` (use `false` com 587)
- `SMTP_USER` — usuário SMTP
- `SMTP_PASS` — senha ou app password
- `SMTP_FROM` — (opcional) endereço From para o e-mail
- `STORE_EMAIL` — e-mail que receberá os pedidos

> Importante: nunca commite credenciais no repositório. Use o painel do Netlify para configurar variáveis seguras.

## Boas práticas e notas
- Mensagens de commit: padronize com `feat:`, `fix:`, `docs:`, `chore:`.
- Testes rápidos: use console.log e abra `parts/01-layout/index.html` para checar o comportamento antes de enviar PR.
- LGPD / privacidade: somente colete os dados estritamente necessários do cliente; documente no README qualquer armazenamento de dados e por quanto tempo serão retidos.

## Precisa de ajuda?
- Peça revisão no PR ou marque no issue com `@owner`.
- Posso ajudar a revisar o PR, ajustar CSS/JS, ou configurar o deploy no Netlify.

Obrigado — vamos deixar o Mac Coelho brilhando! 🍔
