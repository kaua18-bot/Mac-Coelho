/*
  parts/03-netlify/sendOrder.js
  - Exemplo de função serverless (Netlify Function) para envio de pedidos por e-mail usando nodemailer.
  - Variáveis de ambiente necessárias no Netlify (Settings > Build & deploy > Environment):
      SMTP_HOST, SMTP_PORT, SMTP_SECURE ("true"|"false"), SMTP_USER, SMTP_PASS, SMTP_FROM, STORE_EMAIL
  - Teste localmente com o Netlify CLI: `netlify dev` (configure um .env ou use o UI do Netlify para variáveis locais).
  - Observação: este arquivo é uma cópia em `parts/`. Para deploy automático coloque a função em `netlify/functions/sendOrder.js`.
*/

const nodemailer = require('nodemailer');

exports.handler = async function(event, context) {
  if(event.httpMethod !== 'POST'){
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let payload;
  try { payload = JSON.parse(event.body); } catch(e) { return { statusCode: 400, body: 'Bad request' }; }

  const { customer, cart, total } = payload || {};
  if(!customer || !customer.name || !customer.phone) return { statusCode: 400, body: 'Missing customer fields' };

  // Config via ENV
  const SMTP_HOST = process.env.SMTP_HOST;
  const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
  const SMTP_SECURE = (process.env.SMTP_SECURE === 'true');
  const SMTP_USER = process.env.SMTP_USER;
  const SMTP_PASS = process.env.SMTP_PASS;
  const SMTP_FROM = process.env.SMTP_FROM || SMTP_USER;
  const STORE_EMAIL = process.env.STORE_EMAIL;

  if(!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !STORE_EMAIL){
    return { statusCode: 500, body: 'SMTP not configured on the server' };
  }

  const transporter = nodemailer.createTransport({ host: SMTP_HOST, port: SMTP_PORT, secure: SMTP_SECURE, auth: { user: SMTP_USER, pass: SMTP_PASS } });

  // Build message
  let itemsTxt = '';
  if(Array.isArray(cart)){
    cart.forEach(it=>{ itemsTxt += `- ${it.name} (${it.size}) x${it.quantity} - R$ ${it.unitPrice * it.quantity}\n`; if(it.extras && it.extras.length) itemsTxt += `  Adicionais: ${it.extras.map(e=>e.name).join(', ')}\n`; if(it.notes) itemsTxt += `  Obs: ${it.notes}\n`; });
  }

  const mailText = `Novo pedido - Mac Coelho\nNome: ${customer.name}\nTelefone: ${customer.phone}\nEndereço: ${customer.address || '-'}\n\nItens:\n${itemsTxt}\nTotal: R$ ${total}\nPagamento: ${customer.payment || '-'}\nObservações: ${customer.notes || '-'}\n`;

  const mailHtml = `<pre>${mailText.replace(/</g,'&lt;')}</pre>`;

  try{
    await transporter.sendMail({ from: SMTP_FROM, to: STORE_EMAIL, subject: `Pedido: ${customer.name} - ${new Date().toLocaleString()}`, text: mailText, html: mailHtml });
    return { statusCode: 200, body: JSON.stringify({ ok: true, message: 'Email sent' }) };
  }catch(err){
    console.error('sendMail error', err);
    return { statusCode: 500, body: 'Failed to send email: '+ (err.message || err) };
  }
};
