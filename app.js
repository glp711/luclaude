const products = Array.isArray(window.PRODUCTS) ? window.PRODUCTS : [];
const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

const state = {
  query: "",
  type: "Todos",
  aroma: "Todos",
  size: "Todos",
  maxPrice: 500,
  sort: "featured",
  visible: 24,
  cart: JSON.parse(localStorage.getItem("lume-cart") || "{}"),
};

const els = {
  hero: document.querySelector(".hero"),
  productGrid: document.querySelector("#productGrid"),
  resultCount: document.querySelector("#resultCount"),
  searchInput: document.querySelector("#searchInput"),
  typeFilter: document.querySelector("#typeFilter"),
  aromaFilter: document.querySelector("#aromaFilter"),
  sizeFilter: document.querySelector("#sizeFilter"),
  priceRange: document.querySelector("#priceRange"),
  priceValue: document.querySelector("#priceValue"),
  sortSelect: document.querySelector("#sortSelect"),
  loadMore: document.querySelector("#loadMore"),
  clearFilters: document.querySelector("#clearFilters"),
  scentTags: document.querySelector("#scentTags"),
  cartDrawer: document.querySelector("#cartDrawer"),
  drawerBackdrop: document.querySelector("#drawerBackdrop"),
  cartItems: document.querySelector("#cartItems"),
  cartCount: document.querySelector(".cart-count"),
  cartTotal: document.querySelector("#cartTotal"),
  productDialog: document.querySelector("#productDialog"),
  dialogBody: document.querySelector("#dialogBody"),
};

function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function uniqueValues(key) {
  return [...new Set(products.map((item) => item[key]).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, "pt-BR")
  );
}

function fillSelect(select, values) {
  select.innerHTML = ["Todos", ...values]
    .map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`)
    .join("");
}

function init() {
  fillSelect(els.typeFilter, uniqueValues("type"));
  fillSelect(els.aromaFilter, uniqueValues("aroma"));
  fillSelect(els.sizeFilter, uniqueValues("size"));

  const maxPrice = Math.ceil(Math.max(...products.map((item) => item.priceNumber)) / 10) * 10;
  state.maxPrice = maxPrice;
  els.priceRange.max = String(maxPrice);
  els.priceRange.value = String(maxPrice);
  els.priceValue.textContent = money.format(maxPrice);

  const heroProduct =
    products.find((item) => item.type === "Difusor" && item.image) ||
    products.find((item) => item.image);
  if (heroProduct) {
    els.hero.style.setProperty("--hero-image", `url("${heroProduct.image}")`);
  }

  document.querySelector("#metric-products").textContent = String(products.length);
  document.querySelector("#metric-types").textContent = String(uniqueValues("type").length);
  document.querySelector("#metric-aromas").textContent = String(uniqueValues("aroma").length);

  renderScentTags();
  bindEvents();
  render();
  renderCart();
}

function bindEvents() {
  els.searchInput.addEventListener("input", (event) => {
    state.query = event.target.value;
    resetVisible();
  });

  els.typeFilter.addEventListener("change", (event) => {
    state.type = event.target.value;
    resetVisible();
  });

  els.aromaFilter.addEventListener("change", (event) => {
    state.aroma = event.target.value;
    resetVisible();
  });

  els.sizeFilter.addEventListener("change", (event) => {
    state.size = event.target.value;
    resetVisible();
  });

  els.priceRange.addEventListener("input", (event) => {
    state.maxPrice = Number(event.target.value);
    els.priceValue.textContent = money.format(state.maxPrice);
    resetVisible();
  });

  els.sortSelect.addEventListener("change", (event) => {
    state.sort = event.target.value;
    render();
  });

  els.clearFilters.addEventListener("click", () => {
    state.query = "";
    state.type = "Todos";
    state.aroma = "Todos";
    state.size = "Todos";
    state.maxPrice = Number(els.priceRange.max);
    state.sort = "featured";
    state.visible = 24;
    els.searchInput.value = "";
    els.typeFilter.value = "Todos";
    els.aromaFilter.value = "Todos";
    els.sizeFilter.value = "Todos";
    els.priceRange.value = String(state.maxPrice);
    els.priceValue.textContent = money.format(state.maxPrice);
    els.sortSelect.value = "featured";
    render();
  });

  els.loadMore.addEventListener("click", () => {
    state.visible += 24;
    render();
  });

  document.querySelector(".cart-toggle").addEventListener("click", openCart);
  document.querySelector(".cart-close").addEventListener("click", closeCart);
  els.drawerBackdrop.addEventListener("click", closeCart);
  document.querySelector(".dialog-close").addEventListener("click", () => els.productDialog.close());

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeCart();
    }
  });
}

function resetVisible() {
  state.visible = 24;
  render();
}

function filteredProducts() {
  const query = normalize(state.query);
  let list = products.filter((item) => {
    const searchable = normalize(`${item.name} ${item.aroma} ${item.type} ${item.size} ${item.skus}`);
    return (
      (!query || searchable.includes(query)) &&
      (state.type === "Todos" || item.type === state.type) &&
      (state.aroma === "Todos" || item.aroma === state.aroma) &&
      (state.size === "Todos" || item.size === state.size) &&
      item.priceNumber <= state.maxPrice
    );
  });

  list = [...list].sort((a, b) => {
    if (state.sort === "price-asc") return a.priceNumber - b.priceNumber;
    if (state.sort === "price-desc") return b.priceNumber - a.priceNumber;
    if (state.sort === "name-asc") return a.name.localeCompare(b.name, "pt-BR");
    return a.number - b.number;
  });

  return list;
}

function render() {
  const list = filteredProducts();
  const visibleList = list.slice(0, state.visible);
  els.resultCount.textContent = String(list.length);
  els.productGrid.innerHTML = visibleList.map(productCard).join("");
  els.loadMore.hidden = visibleList.length >= list.length;
  hydrateProductButtons();
  refreshIcons();
}

function productCard(item) {
  return `
    <article class="product-card">
      <button class="product-image-button" type="button" data-open="${item.id}" aria-label="Ver ${escapeHtml(item.name)}">
        <img class="product-image" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" loading="lazy" />
      </button>
      <div class="product-info">
        <div class="product-kicker">
          <span class="pill">${escapeHtml(item.type)}</span>
          <span class="pill alt">${escapeHtml(item.aroma)}</span>
        </div>
        <h3 class="product-name">${escapeHtml(item.name)}</h3>
        <div class="product-meta">${escapeHtml(item.size)} · ${item.variants} ${item.variants === 1 ? "variacao" : "variacoes"}</div>
        <div class="product-price">${escapeHtml(item.price)}</div>
      </div>
      <div class="product-actions">
        <button class="add-button" type="button" data-add="${item.id}">Adicionar</button>
        <button class="quick-button" type="button" data-open="${item.id}" aria-label="Ver detalhes">
          <i data-lucide="eye"></i>
        </button>
      </div>
    </article>
  `;
}

function hydrateProductButtons() {
  document.querySelectorAll("[data-add]").forEach((button) => {
    button.addEventListener("click", () => addToCart(button.dataset.add));
  });

  document.querySelectorAll("[data-open]").forEach((button) => {
    button.addEventListener("click", () => openProduct(button.dataset.open));
  });
}

function renderScentTags() {
  const topAromas = uniqueValues("aroma")
    .filter((aroma) => aroma !== "Assinatura")
    .slice(0, 18);
  els.scentTags.innerHTML = topAromas
    .map((aroma) => `<button type="button" data-aroma="${escapeHtml(aroma)}">${escapeHtml(aroma)}</button>`)
    .join("");
  els.scentTags.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      state.aroma = button.dataset.aroma;
      els.aromaFilter.value = state.aroma;
      resetVisible();
      document.querySelector("#catalogo").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function addToCart(id) {
  state.cart[id] = (state.cart[id] || 0) + 1;
  persistCart();
  renderCart();
  openCart();
}

function removeFromCart(id) {
  delete state.cart[id];
  persistCart();
  renderCart();
}

function changeQty(id, delta) {
  const next = (state.cart[id] || 0) + delta;
  if (next <= 0) {
    removeFromCart(id);
    return;
  }
  state.cart[id] = next;
  persistCart();
  renderCart();
}

function persistCart() {
  localStorage.setItem("lume-cart", JSON.stringify(state.cart));
}

function renderCart() {
  const lines = Object.entries(state.cart)
    .map(([id, qty]) => ({ product: products.find((item) => item.id === id), qty }))
    .filter((line) => line.product);

  const totalQty = lines.reduce((sum, line) => sum + line.qty, 0);
  const totalPrice = lines.reduce((sum, line) => sum + line.product.priceNumber * line.qty, 0);
  els.cartCount.textContent = String(totalQty);
  els.cartTotal.textContent = money.format(totalPrice);

  if (!lines.length) {
    els.cartItems.innerHTML = '<p class="empty-cart">Seu carrinho esta vazio.</p>';
    return;
  }

  els.cartItems.innerHTML = lines
    .map(
      ({ product, qty }) => `
        <div class="cart-line">
          <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" />
          <div>
            <h3>${escapeHtml(product.name)}</h3>
            <p>${escapeHtml(product.price)}</p>
            <div class="qty-control" aria-label="Quantidade">
              <button type="button" data-qty="${product.id}" data-delta="-1">-</button>
              <span>${qty}</span>
              <button type="button" data-qty="${product.id}" data-delta="1">+</button>
            </div>
          </div>
          <button class="icon-button" type="button" data-remove="${product.id}" aria-label="Remover">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      `
    )
    .join("");

  els.cartItems.querySelectorAll("[data-qty]").forEach((button) => {
    button.addEventListener("click", () => changeQty(button.dataset.qty, Number(button.dataset.delta)));
  });
  els.cartItems.querySelectorAll("[data-remove]").forEach((button) => {
    button.addEventListener("click", () => removeFromCart(button.dataset.remove));
  });
  refreshIcons();
}

function openCart() {
  els.cartDrawer.classList.add("is-open");
  els.cartDrawer.setAttribute("aria-hidden", "false");
  els.drawerBackdrop.classList.add("is-open");
}

function closeCart() {
  els.cartDrawer.classList.remove("is-open");
  els.cartDrawer.setAttribute("aria-hidden", "true");
  els.drawerBackdrop.classList.remove("is-open");
}

function openProduct(id) {
  const item = products.find((product) => product.id === id);
  if (!item) return;
  els.dialogBody.innerHTML = `
    <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" />
    <div class="dialog-copy">
      <div class="product-kicker">
        <span class="pill">${escapeHtml(item.type)}</span>
        <span class="pill alt">${escapeHtml(item.aroma)}</span>
      </div>
      <h2>${escapeHtml(item.name)}</h2>
      <div class="product-price">${escapeHtml(item.price)}</div>
      <p>${escapeHtml(item.size)} · ${item.variants} ${item.variants === 1 ? "variacao" : "variacoes"}</p>
      <p>SKU inicial: ${escapeHtml(item.skus.split(";")[0] || item.id)}</p>
      <div class="dialog-actions">
        <button class="add-button" type="button" data-add="${item.id}">Adicionar ao carrinho</button>
        <a class="external-link" href="${escapeHtml(item.link)}" target="_blank" rel="noreferrer">Ver original</a>
      </div>
    </div>
  `;
  els.dialogBody.querySelector("[data-add]").addEventListener("click", () => addToCart(item.id));
  els.productDialog.showModal();
}

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

init();
