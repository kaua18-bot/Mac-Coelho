/*
  Documentação inline (ativo):
  - Este arquivo é a versão ativa usada pelo site (`assets/script.js`).
  - Incluí comentários orientativos em cada função principal para facilitar
    manutenção e onboarding rápido. Não altere a lógica ao adicionar comentários.
  - Para prototipar mudanças grandes, prefira editar em `parts/02-assets/script.js`
    e, quando pronto, copie as alterações para cá.
*/

// Dados do cardápio — você pode editar ou carregar do backend
const MENU = [
  { id: 'b1', name: 'Coelho Supreme', desc: 'Pão brioche, carne artesanal 180g, cheddar duplo, bacon crocante e molho especial.', price: 32.90, img: 'https://i.imgur.com/VF8x0Zm.jpg' },
  { id: 'b2', name: 'Coelho Bacon', desc: 'Hambúrguer 150g, cheddar, cebola crispy, bacon e molho da casa.', price: 27.90, img: 'https://i.imgur.com/HqAaA4C.jpg' },
  { id: 'p1', name: 'Batata Coelho', desc: 'Porção de batata frita com cheddar, bacon e tempero especial.', price: 22.00, img: 'https://i.imgur.com/QEOnyIb.jpg' },
  { id: 'm1', name: 'Milkshake Clássico', desc: 'Chocolate, morango ou baunilha — cremoso e delicioso.', price: 18.50, img: 'https://i.imgur.com/hf69i9i.jpg' }
];

// Opções globais (tamanhos e adicionais)
const SIZES = [
  { id: 's', name: 'P', mult: 1 },
  { id: 'm', name: 'M', mult: 1.25 },
  { id: 'l', name: 'G', mult: 1.5 }
];

const EXTRAS = [
  { id: 'extra_bacon', name: 'Bacon', price: 4.00 },
  { id: 'extra_cheddar', name: 'Cheddar', price: 3.00 },
  { id: 'extra_molho', name: 'Molho Especial', price: 1.50 }
];

// formata um número para o formato de moeda brasileiro (R$). Use sempre ao exibir preços.
function formatBRL(v){
  return v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
}

// CART: array de itens com opções
// Chave do localStorage usada para persistir o carrinho no navegador.
const CART_KEY = 'maccoelho_cart_v2';

// Recupera o carrinho do localStorage. Sempre retorna um array (vazio se não existir).
function getCart(){
  try{
    const raw = localStorage.getItem(CART_KEY);
    if(!raw) return [];
    return JSON.parse(raw) || [];
  }catch(e){
    // Em caso de erro (dados corrompidos), retorna carrinho vazio para não quebrar a UI.
    console.warn('getCart parse error', e);
    return [];
  }
}

// Persiste o carrinho no localStorage. Envolvido em try/catch para falhas de storage.
function saveCart(c){
  try{ localStorage.setItem(CART_KEY, JSON.stringify(c)); }
  catch(e){ console.warn('saveCart error', e); }
}

// Renderiza o cardápio na página dentro do container `#menuGrid`.
// - Mantém renderização idempotente: limpa o container antes de inserir os cards.
// - Cada card recebe um botão com data-id que abre o modal de customização.
function renderMenu(){
  const grid = document.getElementById('menuGrid');
  if(!grid) return; // em páginas de teste sem container, evita erro
  grid.innerHTML = '';

  MENU.forEach(item=>{
    const card = document.createElement('div');
    card.className='menu-card';
    card.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <div class="info">
        <h3>${item.name}</h3>
        <p>${item.desc}</p>
        <div class="row">
          <div class="price">${formatBRL(item.price)}</div>
          <button class="add-btn" data-id="${item.id}">Adicionar</button>
        </div>
      </div>`;
    grid.appendChild(card);
  });
  // Liga handlers após criação dos elementos.
  document.querySelectorAll('.add-btn').forEach(b=>b.addEventListener('click',e=>{
    const id = e.currentTarget.dataset.id; showProductModal(id);
  }));
}

// showProductModal(productId)
// - Cria (se necessário) e exibe um modal para customizar o produto selecionado.
// - Ponto de extensão: aqui você pode adicionar validações, opções de sibstituição
//   de ingredientes, e calcular promoções específicas por produto.
function showProductModal(productId){
  const product = MENU.find(p=>p.id===productId); if(!product) return;
  let modal = document.getElementById('productModal');
  if(!modal){
    modal = document.createElement('div'); modal.id='productModal'; modal.className='product-modal'; modal.setAttribute('aria-hidden','true');
    modal.innerHTML = `
      <div class="product-backdrop"></div>
      <div class="product-panel">
        <button id="closeProductModal" style="float:right;border:none;background:transparent;font-size:18px">✕</button>
        <h3 id="pm_title"></h3>
        <div style="display:flex;gap:12px;align-items:center">
          <img id="pm_img" src="" style="width:120px;height:80px;object-fit:cover;border-radius:8px">
          <div>
            <div id="pm_desc" style="color:var(--muted)"></div>
            <div style="margin-top:8px">Preço base: <strong id="pm_price"></strong></div>
          </div>
        </div>
        <div class="options">
          <div>
            <label>Tamanho</label>
            <div class="size-select" id="pm_sizes"></div>
          </div>
          <div>
            <label>Adicionais</label>
            <div class="extras" id="pm_extras"></div>
          </div>
          <div>
            <label>Quantidade<input type="number" id="pm_qty" value="1" min="1" style="width:100px;margin-top:6px"></label>
          </div>
          <div>
            <label>Observações<textarea id="pm_notes" rows="3" placeholder="Ex.: sem cebola"></textarea></label>
          </div>
          <div style="display:flex;gap:8px;justify-content:flex-end">
            <button id="pm_add" class="btn-primary">Adicionar ao carrinho</button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(modal);
    modal.querySelector('.product-backdrop').addEventListener('click',()=>modal.setAttribute('aria-hidden','true'));
    modal.querySelector('#closeProductModal').addEventListener('click',()=>modal.setAttribute('aria-hidden','true'));
  }
  // preencher campos do modal com os dados do produto
  modal.querySelector('#pm_title').textContent = product.name;
  modal.querySelector('#pm_img').src = product.img;
  modal.querySelector('#pm_desc').textContent = product.desc;
  modal.querySelector('#pm_price').textContent = formatBRL(product.price);
  // sizes
  const sizesContainer = modal.querySelector('#pm_sizes'); sizesContainer.innerHTML='';
  SIZES.forEach(s=>{
    const b = document.createElement('button'); b.type='button'; b.className='btn'; b.textContent = `${s.name}`; b.dataset.size = s.id;
    b.addEventListener('click',()=>{
      modal.querySelectorAll('#pm_sizes .btn').forEach(x=>x.classList.remove('active')); b.classList.add('active');
    });
    if(s.id==='s') b.classList.add('active');
    sizesContainer.appendChild(b);
  });
  // extras
  const extrasContainer = modal.querySelector('#pm_extras'); extrasContainer.innerHTML='';
  EXTRAS.forEach(ex=>{
    const id = 'chk_'+ex.id;
    const lbl = document.createElement('label'); lbl.innerHTML = `<input type="checkbox" id="${id}" data-id="${ex.id}" data-price="${ex.price}"> ${ex.name} (+${formatBRL(ex.price)})`;
    extrasContainer.appendChild(lbl);
  });
  modal.querySelector('#pm_qty').value = 1; modal.querySelector('#pm_notes').value='';
  modal.setAttribute('aria-hidden','false');

  // Handler do botão 'Adicionar ao carrinho' dentro do modal.
  // Constrói o objeto cartItem com price calculado (tamanho + adicionais) e quantidade.
  modal.querySelector('#pm_add').onclick = ()=>{
    const selectedSizeBtn = modal.querySelector('#pm_sizes .active');
    const sizeId = selectedSizeBtn ? selectedSizeBtn.dataset.size : 's';
    const size = SIZES.find(x=>x.id===sizeId) || SIZES[0];
    const qty = Math.max(1, parseInt(modal.querySelector('#pm_qty').value)||1);
    const notes = modal.querySelector('#pm_notes').value||'';
    const extras = [];
    modal.querySelectorAll('#pm_extras input[type=checkbox]').forEach(ch=>{ if(ch.checked) extras.push({id: ch.dataset.id, price: parseFloat(ch.dataset.price), name: ch.parentNode.textContent.trim()}) });
    // calcular preço unitário: preço base * multiplicador do tamanho + soma dos extras
    const extrasTotal = extras.reduce((s,e)=>s+e.price,0);
    const unitPrice = +(product.price * size.mult + extrasTotal).toFixed(2);
    const cartItem = {
      cartId: Date.now() + Math.random().toString(36).slice(2,6),
      productId: product.id,
      name: product.name,
      img: product.img,
      size: size.name,
      sizeId: size.id,
      extras: extras.map(e=>({id:e.id,name:e.name,price:e.price})),
      notes,
      unitPrice,
      quantity: qty
    };
    // Adiciona ao carrinho (persistência e UI são tratadas em addToCartItem)
    addToCartItem(cartItem);
    modal.setAttribute('aria-hidden','true');
  };
}

function addToCartItem(item){
  // Adiciona o item ao carrinho, persiste e atualiza a interface.
  const cart = getCart();
  cart.push(item);
  saveCart(cart); updateCartUI();
  showToast(`${item.name} adicionado ao carrinho`);
}

function updateCartUI(){
  // Atualiza contador no cabeçalho, renderiza itens no modal e recalcula total.
  const cart = getCart();
  const count = cart.reduce((s,i)=>s+i.quantity,0);
  document.getElementById('cartCount').textContent = count;
  const itemsEl = document.getElementById('cartItems'); if(!itemsEl) return;
  itemsEl.innerHTML = '';
  let total = 0;
  cart.forEach((it, idx)=>{
    total += it.unitPrice * it.quantity;
    const row = document.createElement('div'); row.className='cart-row';
    const extrasText = (it.extras && it.extras.length)>0 ? '<div style="color:var(--muted);font-size:13px">Adicionais: '+it.extras.map(e=>e.name).join(', ')+'</div>':'';
    row.innerHTML = `<div style="display:flex;gap:8px;align-items:center;margin-bottom:8px">
      <img src="${it.img}" alt="${it.name}" style="width:64px;height:44px;object-fit:cover;border-radius:6px">
      <div style="flex:1">
        <strong>${it.name} <small style=\"color:var(--muted)\">(${it.size})</small></strong>
        ${extrasText}
        <div style="color:var(--muted);font-size:13px">${formatBRL(it.unitPrice)} x ${it.quantity}</div>
      </div>
      <div style="text-align:right">
        <button class="btn" data-action="minus" data-idx="${idx}">-</button>
        <button class="btn" data-action="plus" data-idx="${idx}">+</button>
        <button class="btn" data-action="remove" data-idx="${idx}" style="margin-left:8px">Remover</button>
      </div>
    </div>`;
    itemsEl.appendChild(row);
  });
  // Exibe total formatado
  document.getElementById('cartTotal').textContent = formatBRL(total);
  // handlers
  itemsEl.querySelectorAll('button').forEach(b=>{
    b.addEventListener('click', e=>{
      const idx = parseInt(e.currentTarget.dataset.idx);
      const action = e.currentTarget.dataset.action;
      const cart = getCart(); if(isNaN(idx) || !cart[idx]) return;
      if(action==='plus'){ cart[idx].quantity += 1 }
      else if(action==='minus'){ cart[idx].quantity = Math.max(1, cart[idx].quantity-1) }
      else if(action==='remove'){ cart.splice(idx,1) }
      saveCart(cart); updateCartUI();
    });
  });
  // Atualiza o resumo do checkout após qualquer alteração no carrinho.
  renderCheckoutSummary();
}

function clearCart(){ localStorage.removeItem(CART_KEY); updateCartUI(); }

// CART MODAL
const cartModal = document.getElementById('cartModal');
document.getElementById('openCartBtn').addEventListener('click',()=>{ cartModal.setAttribute('aria-hidden','false'); updateCartUI(); });
document.getElementById('closeCartBtn').addEventListener('click',()=>{ cartModal.setAttribute('aria-hidden','true'); });
document.querySelector('.cart-backdrop').addEventListener('click',()=>cartModal.setAttribute('aria-hidden','true'));

document.getElementById('checkoutBtn').addEventListener('click',()=>{
  // scroll to checkout section
  document.getElementById('checkout').scrollIntoView({behavior:'smooth'});
  cartModal.setAttribute('aria-hidden','true');
});

// Dark mode toggle
const darkToggle = document.getElementById('darkToggle');
function setDark(v){ if(v) document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark'); localStorage.setItem('maccoelho_dark', v? '1':'0'); }
darkToggle.addEventListener('click',()=> setDark(!document.documentElement.classList.contains('dark')) );
if(localStorage.getItem('maccoelho_dark')==='1') setDark(true);

// Delivery form
document.getElementById('deliveryForm').addEventListener('submit',e=>{
  e.preventDefault(); const addr = document.getElementById('address').value.trim();
  const el = document.getElementById('deliveryResult');
  if(!addr) { el.textContent='Informe o endereço'; return }
  const eta = Math.floor(30 + Math.random()*25);
  el.innerHTML = `<strong>Entrega estimada:</strong> ${eta} minutos<br><small>Taxa aproximada calculada localmente.</small>`;
});

// Contact form basic handler
document.getElementById('contactForm').addEventListener('submit', e=>{ e.preventDefault(); alert('Mensagem enviada (simulada).'); e.target.reset(); });

// checkout summary render
function renderCheckoutSummary(){
  const summary = document.getElementById('checkoutSummary'); if(!summary) return;
  const cart = getCart(); if(cart.length===0){ summary.innerHTML = '<em>Carrinho vazio</em>'; return }
  let html = '<ul style="padding-left:18px">'; let total=0;
  // Render de cada item do carrinho no checkout (inclui adicionais e observações)
  cart.forEach(it=>{ html += `<li>${it.name} (${it.size}) x${it.quantity} — ${formatBRL(it.unitPrice*it.quantity)}${it.extras.length? '<div style="color:var(--muted);font-size:13px">Adicionais: '+it.extras.map(e=>e.name).join(', ')+'</div>':''}${it.notes? '<div style="color:var(--muted);font-size:13px">Obs: '+it.notes+'</div>':''}</li>`; total += it.unitPrice*it.quantity });
  html += `</ul><div style="margin-top:8px"><strong>Total: ${formatBRL(total)}</strong></div>`;
  summary.innerHTML = html;
}

// WhatsApp / Email sending
// STORE_WHATSAPP: número em formato internacional (padrão para wa.me: country+area+number sem sinais)
const STORE_WHATSAPP = '5519971080410'; // número da loja em formato internacional (sem símbolos)
const STORE_EMAIL = 'maccoelho.delivery@gmail.com';

function buildOrderMessage(customer){
  // Monta uma string legível do pedido para enviar via WhatsApp (ou e-mail plain-text)
  const cart = getCart(); let total = 0; let itemsTxt = '';
  cart.forEach(it=>{ itemsTxt += `- ${it.name} (${it.size}) x${it.quantity} (${formatBRL(it.unitPrice*it.quantity)} )\n`; total += it.unitPrice*it.quantity; if(it.extras.length) itemsTxt += `  Adicionais: ${it.extras.map(e=>e.name).join(', ')}\n`; if(it.notes) itemsTxt += `  Obs: ${it.notes}\n`; });
  const msg = `Pedido Novo - Mac Coelho\nNome: ${customer.name}\nTelefone: ${customer.phone}\nEndereço: ${customer.address}\nItens:\n${itemsTxt}Total: ${formatBRL(total)}\nPagamento: ${customer.payment}\nObservações: ${customer.notes || '-'}\n`;
  return msg;
}

document.getElementById('sendWhatsApp').addEventListener('click', ()=>{
  const customer = { name: document.getElementById('c_name').value.trim(), phone: document.getElementById('c_phone').value.trim(), address: document.getElementById('c_address').value.trim(), payment: document.getElementById('c_payment').value, notes: document.getElementById('c_notes').value.trim() };
  if(!customer.name || !customer.phone || !customer.address){ alert('Preencha nome, telefone e endereço'); return }
  const msg = buildOrderMessage(customer);
  const url = `https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent(msg)}`;
  window.open(url,'_blank');
});

async function sendOrderToServer(customer){
  try{
    const cart = getCart(); if(!cart || cart.length===0){ alert('Carrinho vazio'); return }
    const total = cart.reduce((s,i)=>s + (i.unitPrice * i.quantity), 0);
    const payload = { customer, cart, total };
    const res = await fetch('/.netlify/functions/sendOrder', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    });
    if(res.ok){ showToast('Pedido enviado com sucesso!'); clearCart(); }
    else{
      const text = await res.text(); alert('Falha ao enviar pedido: '+text);
    }
  }catch(err){
    // Erros de rede ou da função serverless chegam aqui — logue e avise o usuário.
    console.error('sendOrderToServer error', err);
    alert('Erro ao enviar pedido: '+(err.message || err));
  }
}

document.getElementById('sendEmail').addEventListener('click', ()=>{
  const customer = { name: document.getElementById('c_name').value.trim(), phone: document.getElementById('c_phone').value.trim(), address: document.getElementById('c_address').value.trim(), payment: document.getElementById('c_payment').value, notes: document.getElementById('c_notes').value.trim() };
  if(!customer.name || !customer.phone || !customer.address){ alert('Preencha nome, telefone e endereço'); return }
  // envia para serverless (Netlify function)
  sendOrderToServer(customer);
});

// Toast helper
function showToast(msg){ const t = document.createElement('div'); t.textContent = msg; t.style.position='fixed'; t.style.right='18px'; t.style.bottom='18px'; t.style.background='var(--card)'; t.style.padding='10px 14px'; t.style.borderRadius='10px'; t.style.boxShadow='0 6px 18px rgba(0,0,0,0.15)'; document.body.appendChild(t); setTimeout(()=>t.style.opacity='0',2200); setTimeout(()=>t.remove(),2600); }

// MAP: inicializa Leaflet com coordenadas aproximadas para Campinas/SP (ajuste se necessário)
function initMap(){ try{ const map = L.map('map').setView([-22.905, -47.058], 15); L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, }).addTo(map); L.marker([-22.905, -47.058]).addTo(map).bindPopup('Mac Coelho — Rua William Neumann, 355').openPopup(); }catch(e){console.warn('Leaflet não carregou',e)} }

// Inicialização
document.addEventListener('DOMContentLoaded',()=>{ renderMenu(); updateCartUI(); initMap(); });
