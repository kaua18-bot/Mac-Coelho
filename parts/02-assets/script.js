// Copia do assets/script.js — edite esta versão separadamente se precisar

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
