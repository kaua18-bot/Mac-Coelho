/*
  parts/02-assets/script.js
  - Cópia editável do `assets/script.js` para experimentar alterações de JS e dados do cardápio.
  - Boas práticas:
    * Edite aqui para testar mudanças rapidamente no layout de `parts/01-layout/index.html`.
    * Mantenha em sincronia com `assets/script.js` quando for mesclar para o site principal.
    * Para testar localmente, abra `parts/01-layout/index.html` no navegador.
*/

// Dados do cardápio — você pode editar ou carregar do backend
const MENU = [
  { id: 'b1', name: 'Coelho Supreme', desc: 'Pão brioche, carne artesanal 180g, cheddar duplo, bacon crocante e molho especial.', price: 32.90, img: 'https://i.imgur.com/VF8x0Zm.jpg' },
  { id: 'b2', name: 'Coelho Bacon', desc: 'Hambúrguer 150g, cheddar, cebola crispy, bacon e molho da casa.', price: 27.90, img: 'https://i.imgur.com/HqAaA4C.jpg' },
  { id: 'p1', name: 'Batata Coelho', desc: 'Porção de batata frita com cheddar, bacon e tempero especial.', price: 22.00, img: 'https://i.imgur.com/QEOnyIb.jpg' },
  { id: 'm1', name: 'Milkshake Clássico', desc: 'Chocolate, morango ou baunilha — cremoso e delicioso.', price: 18.50, img: 'https://i.imgur.com/hf69i9i.jpg' }
];

// (restante do script é cópia do arquivo principal — mantenha sincronizado com a versão em assets/ se quiser)

const SIZES = [ { id: 's', name: 'P', mult: 1 }, { id: 'm', name: 'M', mult: 1.25 }, { id: 'l', name: 'G', mult: 1.5 } ];
const EXTRAS = [ { id: 'extra_bacon', name: 'Bacon', price: 4.00 }, { id: 'extra_cheddar', name: 'Cheddar', price: 3.00 }, { id: 'extra_molho', name: 'Molho Especial', price: 1.50 } ];

function formatBRL(v){ return v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'}); }

/* --------------------------------------------------------------------------
   Guia rápido das principais funções (edite conforme necessário):

   - renderMenu()
     Renderiza os cards do menu dentro de `#menuGrid` usando a constante MENU.
     Ideal para alterar itens, nomes, descrições e imagens.

   - showProductModal(productId)
     Abre um modal de customização para o produto (tamanhos, adicionais, quantidade,
     observações). Cria o modal dinamicamente se não existir.

   - addToCartItem(item)
     Adiciona um item (com `unitPrice`, `quantity`, `extras`, `notes`) ao localStorage
     e atualiza a UI do carrinho. Use este ponto para instrumentar validações ou
     persistência remota se quiser.

   - updateCartUI()
     Recalcula total, atualiza contador e renderiza os itens no modal do carrinho.
     Aqui é possível inserir lógica de descontos, taxas ou cálculo de frete.

   - renderCheckoutSummary()
     Popula o resumo do checkout com os itens atuais do carrinho (R$ formato BR).

   - buildOrderMessage(customer)
     Monta a string de mensagem que será enviada por WhatsApp; personalize o
     layout do texto (por ex., incluir id do pedido) se necessário.

   - sendOrderToServer(customer)
     Envia via POST para `/.netlify/functions/sendOrder` — a função serverless
     processa e encaminha por e-mail (ver `parts/03-netlify/sendOrder.js`).

   Modifique comentários ou adicione logs temporários (console.log) ao testar.
----------------------------------------------------------------------------*/

const CART_KEY = 'maccoelho_cart_v2';
function getCart(){ try{ return JSON.parse(localStorage.getItem(CART_KEY))||[] }catch(e){return[]} }
function saveCart(c){ localStorage.setItem(CART_KEY,JSON.stringify(c)) }

// Render + interatividade (simplificada) — copie o restante do script real se necessário
function renderMenu(){
  const grid = document.getElementById('menuGrid'); if(!grid) return;
  grid.innerHTML = '';
  MENU.forEach(item=>{
    const card = document.createElement('div'); card.className='menu-card';
    card.innerHTML = `\n      <img src="${item.img}" alt="${item.name}">\n      <div class="info">\n        <h3>${item.name}</h3>\n        <p>${item.desc}</p>\n        <div class="row">\n          <div class="price">${formatBRL(item.price)}</div>\n          <button class="add-btn" data-id="${item.id}">Adicionar</button>\n        </div>\n      </div>`;
    grid.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded',()=>{ renderMenu(); });
