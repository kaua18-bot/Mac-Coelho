# Parts — Mac Coelho

Esta pasta contém versões "por partes" do projeto para facilitar edição direta no GitHub.

Estrutura:
- parts/01-layout — arquivo `index.html` (somente layout). Edite este arquivo para testar HTML e estrutura.
- parts/02-assets — `script.js` e `styles.css` (cópias simplificadas). Edite aqui os assets se quiser testar alterações visuais ou JS.
- parts/03-netlify — `sendOrder.js` e `package.json` (exemplo da função serverless). Atualize as variáveis de ambiente ao fazer deploy.
- parts/04-docs — esta documentação.

Como usar:
- Você pode editar qualquer arquivo em `parts/` diretamente pelo GitHub (botão Edit) ou clonar o repo e trabalhar localmente.
- Após editar, copie os arquivos desejados para o diretório principal ou abra um Pull Request.

Notas de deploy:
- A função `sendOrder.js` é um exemplo que usa `nodemailer` e variáveis de ambiente:
  - SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, SMTP_FROM, STORE_EMAIL
- Para ativar o envio por e-mail no Netlify, adicione essas variáveis em Settings → Build & deploy → Environment.

