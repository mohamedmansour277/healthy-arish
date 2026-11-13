// خوارزمية التطبيق وإدارة الحالة والتنقل بين الصفحات
(function () {
  const STORAGE_KEY = "healthy_arish_cart_v1";

  const state = {
    route: "home", // home | categories | cart | more
    selectedCategory: "all", // all | milk | drinks | yogurt | cheese | offers
    searchQuery: "",
    cart: loadCart()
  };

  function loadCart() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveCart() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.cart));
    updateCartBadges();
  }

  function getCartItemQty(productId) {
    const found = state.cart.find((item) => item.id === productId);
    return found ? found.qty : 0;
  }

  function addToCart(productId, qty = 1) {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;

    const existing = state.cart.find((item) => item.id === productId);
    if (existing) {
      existing.qty += qty;
    } else {
      state.cart.push({ id: productId, qty });
    }
    saveCart();
    showToast(`تمت إضافة "${product.name}" إلى السلة`);
    renderCurrentView();
  }

  function updateItemQty(productId, delta) {
    const index = state.cart.findIndex((item) => item.id === productId);
    if (index === -1) return;

    state.cart[index].qty += delta;
    if (state.cart[index].qty <= 0) {
      state.cart.splice(index, 1);
    }
    saveCart();
    renderCurrentView();
  }

  function removeItem(productId) {
    state.cart = state.cart.filter((item) => item.id !== productId);
    saveCart();
    showToast("تم حذف المنتج من السلة");
    renderCurrentView();
  }

  function updateCartBadges() {
    const totalCount = state.cart.reduce((sum, item) => sum + item.qty, 0);
    const headerBadge = document.getElementById("headerCartBadge");
    const navBadge = document.getElementById("navCartBadge");

    [headerBadge, navBadge].forEach((badge) => {
      if (!badge) return;
      if (totalCount > 0) {
        badge.textContent = totalCount;
        badge.classList.remove("hidden");
      } else {
        badge.classList.add("hidden");
      }
    });
  }

  function showToast(message) {
    const toast = document.getElementById("appToast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2200);
  }

  // التنقل بين الصفحات
  function navigateTo(route, options = {}) {
    state.route = route;
    if (options.category) {
      state.selectedCategory = options.category;
    }
    document.querySelectorAll(".nav-item").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.route === route);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
    renderCurrentView();
  }

  // خوارزمية التصفية والبحث الذكي
  function getFilteredProducts() {
    const q = state.searchQuery.trim().toLowerCase();
    return PRODUCTS.filter((product) => {
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.categoryName.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (state.selectedCategory === "all") return true;
      if (state.selectedCategory === "offers") return product.isOffer;
      return product.category === state.selectedCategory;
    });
  }

  // مكون بطاقة المنتج
  function renderProductCard(product) {
    const qty = getCartItemQty(product.id);
    const discountPercent = product.oldPrice
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 0;

    return `
      <article class="product-card">
        ${discountPercent > 0 ? `<span class="discount-tag">خصم ${discountPercent}%</span>` : ""}
        <div class="product-visual" data-open-product="${product.id}">
          ${product.illustration}
        </div>
        <div>
          <div class="product-cat-label">${product.categoryName}</div>
          <h3 class="product-name" data-open-product="${product.id}">${product.name}</h3>
          <div class="product-weight">${product.weight}</div>
        </div>
        <div class="product-footer">
          <div class="price-stack">
            <span class="current-price">${product.price} ج.م</span>
            ${product.oldPrice ? `<span class="old-price">${product.oldPrice} ج.م</span>` : ""}
          </div>
          ${
            qty === 0
              ? `<button type="button" class="add-to-cart-btn" data-add-id="${product.id}">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  <span>أضف</span>
                </button>`
              : `<div class="qty-stepper">
                  <button type="button" class="qty-btn" data-qty-id="${product.id}" data-delta="1" aria-label="زيادة">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                  <span class="qty-value">${qty}</span>
                  <button type="button" class="qty-btn" data-qty-id="${product.id}" data-delta="-1" aria-label="إنقاص">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                </div>`
          }
        </div>
      </article>
    `;
  }

  // 1. الصفحة الرئيسية (مطابقة للتصميم المرفق)
  function renderHomeView() {
    const searchActive = state.searchQuery.trim().length > 0;
    const featuredProducts = searchActive
      ? getFilteredProducts()
      : PRODUCTS.filter((p) => p.isPopular);

    return `
      <!-- البانر الرئيسي الأزرق -->
      <section class="hero-banner">
        <div class="hero-wordmark-box">
          <div class="hero-floating-badges" aria-hidden="true">
            <div class="floating-card green-card">
              <svg width="20" height="28" viewBox="0 0 40 50" fill="none">
                <rect x="14" y="2" width="12" height="5" rx="2" fill="#0D4EDB"/>
                <rect x="10" y="7" width="20" height="38" rx="4" fill="#FFFFFF"/>
                <rect x="11" y="18" width="18" height="16" fill="#0D4EDB"/>
              </svg>
            </div>
            <div class="floating-card lime-card">
              <svg width="26" height="28" viewBox="0 0 40 42" fill="none">
                <rect x="8" y="6" width="24" height="4" rx="2" fill="#FFFFFF"/>
                <path d="M10 10H30L28 36H12L10 10Z" fill="#0D4EDB"/>
              </svg>
            </div>
          </div>

          <h1 class="hero-main-title">Healthy</h1>
          <p class="hero-branch-subtitle">${STORE_CONFIG.branch}</p>
        </div>

        <div class="hero-cta-row">
          <button type="button" class="hero-btn hero-btn-primary" data-goto-cat="all">
            <span class="hero-btn-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="9" cy="20" r="1.5"></circle>
                <circle cx="18" cy="20" r="1.5"></circle>
                <path d="M3 4H5.5L7.5 14.5H18L20 7.5H6.5"></path>
              </svg>
            </span>
            <span>تسوق الآن</span>
          </button>

          <button type="button" class="hero-btn hero-btn-outline" data-goto-cat="offers">
            <span class="hero-btn-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <line x1="19" y1="5" x2="5" y2="19"></line>
                <circle cx="7" cy="7" r="2.2"></circle>
                <circle cx="17" cy="17" r="2.2"></circle>
              </svg>
            </span>
            <span>اكتشف العروض</span>
          </button>
        </div>
      </section>

      <!-- قسم تسوق حسب الأقسام -->
      <section class="section-block">
        <div class="section-header-row">
          <h2 class="section-title">تسوق حسب الأقسام</h2>
        </div>

        <div class="categories-bento-grid">
          ${CATEGORIES.map(
            (cat) => `
            <button type="button" class="cat-card ${cat.theme}" data-goto-cat="${cat.id}">
              <span class="cat-card-title">${cat.name}</span>
              <span class="cat-card-illustration">${cat.illustration}</span>
            </button>
          `
          ).join("")}
        </div>

        <!-- بطاقة العروض والخصومات العريضة -->
        <button type="button" class="offers-wide-banner" data-goto-cat="offers">
          <div class="offers-text-group">
            <div class="offers-title">العروض</div>
            <div class="offers-subtitle">والخصومات</div>
          </div>

          <div class="offers-brand-corner">
            <span class="brand-script">Healthy</span>
            <svg class="brand-leaves" viewBox="0 0 44 28" fill="none">
              <path d="M22 25C13 25 5 18 4 6C15 5 23 12 22 25Z" fill="#8CD843"/>
              <path d="M23 25C32 25 39 19 40 9C30 8 23 14 23 25Z" fill="#E3EA3E"/>
            </svg>
          </div>

          <svg class="offers-watermark-percent" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="7">
            <circle cx="50" cy="50" r="42"></circle>
            <line x1="70" y1="30" x2="30" y2="70"></line>
            <circle cx="35" cy="35" r="6"></circle>
            <circle cx="65" cy="65" r="6"></circle>
          </svg>
        </button>
      </section>

      <!-- المنتجات الأكثر طلباً أو نتائج البحث -->
      <section class="section-block">
        <div class="section-header-row">
          <h2 class="section-title">${searchActive ? "نتائج البحث" : "الأكثر طلباً في العريش"}</h2>
          <button type="button" class="section-link" data-goto-cat="all">
            <span>عرض الكل</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
        </div>

        ${
          featuredProducts.length > 0
            ? `<div class="products-grid">${featuredProducts.map(renderProductCard).join("")}</div>`
            : `<div class="empty-state">
                <h3>لا توجد منتجات مطابقة</h3>
                <p>جرب البحث باسم منتج آخر مثل حليب أو زبادي أو جبن</p>
              </div>`
        }
      </section>
    `;
  }

  // 2. صفحة الأقسام والمنتجات
  function renderCategoriesView() {
    const filters = [
      { id: "all", label: "الكل" },
      { id: "milk", label: "الألبان" },
      { id: "drinks", label: "المشروبات" },
      { id: "yogurt", label: "الزبادي" },
      { id: "cheese", label: "الجبن" },
      { id: "offers", label: "العروض والخصومات" }
    ];

    const items = getFilteredProducts();

    return `
      <div class="page-header-bar">
        <h1 class="page-main-heading">الأقسام والمنتجات</h1>
        <span style="font-size:0.84rem;font-weight:700;color:var(--ink-muted);">${items.length} منتج</span>
      </div>

      <div class="section-block" style="padding-top:8px;">
        <div class="filter-pills-row">
          ${filters
            .map(
              (f) => `
            <button type="button" class="filter-pill ${state.selectedCategory === f.id ? "active" : ""}" data-select-cat="${f.id}">
              ${f.label}
            </button>
          `
            )
            .join("")}
        </div>

        ${
          items.length > 0
            ? `<div class="products-grid">${items.map(renderProductCard).join("")}</div>`
            : `<div class="empty-state">
                <div class="empty-state-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="7"></circle>
                    <line x1="20" y1="20" x2="16.2" y2="16.2"></line>
                  </svg>
                </div>
                <h3>لا توجد منتجات في هذا التصنيف حالياً</h3>
                <p>يمكنك تصفح باقي الأقسام الطازجة المتاحة</p>
                <button type="button" class="add-to-cart-btn" data-select-cat="all">عرض جميع المنتجات</button>
              </div>`
        }
      </div>
    `;
  }

  // 3. صفحة السلة وإتمام الطلب عبر واتساب
  function renderCartView() {
    if (state.cart.length === 0) {
      return `
        <div class="page-header-bar">
          <h1 class="page-main-heading">سلة المشتريات</h1>
        </div>
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="20" r="1.6"></circle>
              <circle cx="18" cy="20" r="1.6"></circle>
              <path d="M2.5 3.5H5.5L7.6 14.5C7.8 15.4 8.6 16 9.5 16H17.8C18.7 16 19.5 15.4 19.7 14.5L21.2 7.5H6.3"></path>
            </svg>
          </div>
          <h3>سلتك فارغة حالياً</h3>
          <p>أضف منتجات الألبان الطازجة من فرع العريش لتبدأ طلبك</p>
          <button type="button" class="whatsapp-order-btn" style="max-width:220px;" data-goto-cat="all">
            تصفح المنتجات
          </button>
        </div>
      `;
    }

    let subtotal = 0;
    const cartRows = state.cart
      .map((item) => {
        const product = PRODUCTS.find((p) => p.id === item.id);
        if (!product) return "";
        const lineTotal = product.price * item.qty;
        subtotal += lineTotal;

        return `
          <div class="cart-item-card">
            <div class="cart-item-thumb">${product.illustration}</div>
            <div class="cart-item-info">
              <div class="cart-item-title">${product.name}</div>
              <div class="cart-item-meta">${product.weight} • ${product.price} ج.م للقطعة</div>
              <div class="cart-item-price">${lineTotal} ج.م</div>
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;">
              <button type="button" class="remove-item-btn" data-remove-id="${product.id}" aria-label="حذف">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6L18.1 19.1C18 20.2 17.1 21 16 21H8C6.9 21 6 20.2 5.9 19.1L5 6"></path>
                </svg>
              </button>
              <div class="qty-stepper">
                <button type="button" class="qty-btn" data-qty-id="${product.id}" data-delta="1" aria-label="زيادة">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
                <span class="qty-value">${item.qty}</span>
                <button type="button" class="qty-btn" data-qty-id="${product.id}" data-delta="-1" aria-label="إنقاص">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        `;
      })
      .join("");

    const delivery = subtotal >= STORE_CONFIG.freeDeliveryThreshold ? 0 : STORE_CONFIG.deliveryFee;
    const total = subtotal + delivery;

    return `
      <div class="page-header-bar">
        <h1 class="page-main-heading">سلة المشتريات</h1>
        <span style="font-size:0.84rem;font-weight:700;color:var(--brand-blue);">
          ${delivery === 0 ? "توصيل مجاني مفعل" : `أضف ${STORE_CONFIG.freeDeliveryThreshold - subtotal} ج.م لتوصيل مجاني`}
        </span>
      </div>

      <div class="cart-list">${cartRows}</div>

      <form class="checkout-card" id="checkoutForm">
        <div class="summary-row">
          <span>المجموع الفرعي</span>
          <span>${subtotal} ج.م</span>
        </div>
        <div class="summary-row">
          <span>رسوم التوصيل داخل العريش</span>
          <span>${delivery === 0 ? "مجاني" : `${delivery} ج.م`}</span>
        </div>
        <div class="summary-row total-row">
          <span>الإجمالي النهائي</span>
          <span>${total} ج.م</span>
        </div>

        <div class="form-group">
          <label class="form-label" for="custName">الاسم بالكامل</label>
          <input class="form-control" type="text" id="custName" required placeholder="أدخل اسمك" />
        </div>

        <div class="form-group">
          <label class="form-label" for="custPhone">رقم الهاتف</label>
          <input class="form-control" type="tel" id="custPhone" required placeholder="01xxxxxxxxx" />
        </div>

        <div class="form-group">
          <label class="form-label" for="custAddress">عنوان التوصيل في العريش</label>
          <input class="form-control" type="text" id="custAddress" required placeholder="الحي / الشارع / علامة مميزة" />
        </div>

        <div class="form-group">
          <label class="form-label" for="custNotes">ملاحظات إضافية (اختياري)</label>
          <input class="form-control" type="text" id="custNotes" placeholder="مثال: موعد التوصيل المناسب" />
        </div>

        <button type="submit" class="whatsapp-order-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path d="M21 11.5C21 16.75 16.75 21 11.5 21C9.8 21 8.2 20.55 6.8 19.75L3 21L4.25 17.2C3.45 15.8 3 14.2 3 12.5C3 7.25 7.25 3 12.5 3C17.2 3 21 6.8 21 11.5Z"></path>
          </svg>
          <span>إرسال الطلب عبر واتساب</span>
        </button>
      </form>
    `;
  }

  // 4. صفحة المزيد
  function renderMoreView() {
    return `
      <div class="page-header-bar">
        <h1 class="page-main-heading">المزيد عن Healthy</h1>
      </div>

      <div class="more-hero-card">
        <h2>Healthy - فرع العريش</h2>
        <p>نقدم لأهالي العريش وشمال سيناء أجود منتجات الألبان الطازجة يومياً بمعايير جودة وسلامة غذائية عالية، من المزرعة إلى باب بيتك.</p>
      </div>

      <div class="info-list">
        <div class="info-tile">
          <div class="info-tile-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 21C16 17 19 13.5 19 9.5C19 5.6 15.9 2.5 12 2.5C8.1 2.5 5 5.6 5 9.5C5 13.5 8 17 12 21Z"></path>
              <circle cx="12" cy="9.5" r="2.5"></circle>
            </svg>
          </div>
          <div class="info-tile-content">
            <h3>عنوان الفرع</h3>
            <p>${STORE_CONFIG.address}</p>
          </div>
        </div>

        <div class="info-tile">
          <div class="info-tile-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="9"></circle>
              <polyline points="12 7 12 12 15 14"></polyline>
            </svg>
          </div>
          <div class="info-tile-content">
            <h3>مواعيد العمل والتوصيل</h3>
            <p>${STORE_CONFIG.workingHours}</p>
          </div>
        </div>

        <div class="info-tile">
          <div class="info-tile-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="1" y="4" width="15" height="13" rx="2"></rect>
              <polygon points="16 8 20 8 23 11 23 17 16 17 16 8"></polygon>
              <circle cx="5.5" cy="18.5" r="2.5"></circle>
              <circle cx="18.5" cy="18.5" r="2.5"></circle>
            </svg>
          </div>
          <div class="info-tile-content">
            <h3>سياسة التوصيل السريع</h3>
            <p>توصيل مبرد خلال 45 دقيقة داخل مدينة العريش، ومجاني للطلبات فوق ${STORE_CONFIG.freeDeliveryThreshold} ج.م.</p>
          </div>
        </div>

        <div class="info-tile">
          <div class="info-tile-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z"></path>
              <polyline points="9 12 11 14 15 10"></polyline>
            </svg>
          </div>
          <div class="info-tile-content">
            <h3>ضمان الجودة والطزاجة</h3>
            <p>جميع منتجاتنا طبيعية 100% خالية من الزيوت المهدرجة والمواد الحافظة.</p>
          </div>
        </div>
      </div>
    `;
  }

  // فتح نافذة تفاصيل المنتج
  function openProductModal(productId) {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;

    const modal = document.getElementById("productModal");
    const body = document.getElementById("productModalBody");
    const qty = getCartItemQty(product.id);

    body.innerHTML = `
      <div style="background:var(--bg-surface);border-radius:18px;padding:20px;display:flex;justify-content:center;margin-bottom:16px;">
        <div style="width:130px;height:130px;display:flex;align-items:center;justify-content:center;">
          ${product.illustration}
        </div>
      </div>
      <div class="product-cat-label">${product.categoryName} • ${product.weight}</div>
      <h2 style="font-size:1.3rem;font-weight:900;margin:4px 0 8px;">${product.name}</h2>
      <p style="font-size:0.9rem;color:var(--ink-muted);line-height:1.6;margin-bottom:18px;">${product.description}</p>
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
        <div>
          <span style="font-size:1.35rem;font-weight:900;color:var(--brand-blue);">${product.price} ج.م</span>
          ${product.oldPrice ? `<span class="old-price" style="margin-right:6px;font-size:0.9rem;">${product.oldPrice} ج.م</span>` : ""}
        </div>
        <button type="button" class="whatsapp-order-btn" style="margin-top:0;width:auto;padding:0 24px;" data-modal-add="${product.id}">
          <span>${qty > 0 ? `أضف المزيد (في السلة: ${qty})` : "أضف إلى السلة"}</span>
        </button>
      </div>
    `;

    modal.classList.remove("hidden");
  }

  function closeProductModal() {
    document.getElementById("productModal").classList.add("hidden");
  }

  // إرسال الطلب عبر رابط واتساب منسق
  function handleCheckoutSubmit(event) {
    event.preventDefault();
    const name = document.getElementById("custName").value.trim();
    const phone = document.getElementById("custPhone").value.trim();
    const address = document.getElementById("custAddress").value.trim();
    const notes = document.getElementById("custNotes").value.trim();

    let subtotal = 0;
    const lines = state.cart.map((item, idx) => {
      const p = PRODUCTS.find((prod) => prod.id === item.id);
      const lineTotal = p.price * item.qty;
      subtotal += lineTotal;
      return `${idx + 1}. ${p.name} (${p.weight}) × ${item.qty} = ${lineTotal} ج.م`;
    });

    const delivery = subtotal >= STORE_CONFIG.freeDeliveryThreshold ? 0 : STORE_CONFIG.deliveryFee;
    const total = subtotal + delivery;

    const message = [
      `*طلب جديد - Healthy فرع العريش*`,
      `--------------------------`,
      `*الاسم:* ${name}`,
      `*الهاتف:* ${phone}`,
      `*العنوان:* ${address}`,
      notes ? `*ملاحظات:* ${notes}` : "",
      `--------------------------`,
      `*تفاصيل الطلب:*`,
      ...lines,
      `--------------------------`,
      `*المجموع الفرعي:* ${subtotal} ج.م`,
      `*التوصيل:* ${delivery === 0 ? "مجاني" : delivery + " ج.م"}`,
      `*الإجمالي النهائي:* ${total} ج.م`
    ]
      .filter(Boolean)
      .join("\n");

    const waUrl = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank", "noopener");
  }

  function renderCurrentView() {
    const container = document.getElementById("appView");
    if (!container) return;

    if (state.route === "home") {
      container.innerHTML = renderHomeView();
    } else if (state.route === "categories") {
      container.innerHTML = renderCategoriesView();
    } else if (state.route === "cart") {
      container.innerHTML = renderCartView();
    } else if (state.route === "more") {
      container.innerHTML = renderMoreView();
    }

    const checkoutForm = document.getElementById("checkoutForm");
    if (checkoutForm) {
      checkoutForm.addEventListener("submit", handleCheckoutSubmit);
    }
  }

  // تفويض الأحداث العام
  document.addEventListener("click", (e) => {
    const routeBtn = e.target.closest("[data-route]");
    if (routeBtn) {
      e.preventDefault();
      navigateTo(routeBtn.dataset.route);
      return;
    }

    const gotoCatBtn = e.target.closest("[data-goto-cat]");
    if (gotoCatBtn) {
      navigateTo("categories", { category: gotoCatBtn.dataset.gotoCat });
      return;
    }

    const selectCatBtn = e.target.closest("[data-select-cat]");
    if (selectCatBtn) {
      state.selectedCategory = selectCatBtn.dataset.selectCat;
      renderCurrentView();
      return;
    }

    const addBtn = e.target.closest("[data-add-id]");
    if (addBtn) {
      addToCart(addBtn.dataset.addId, 1);
      return;
    }

    const modalAddBtn = e.target.closest("[data-modal-add]");
    if (modalAddBtn) {
      addToCart(modalAddBtn.dataset.modalAdd, 1);
      closeProductModal();
      return;
    }

    const qtyBtn = e.target.closest("[data-qty-id]");
    if (qtyBtn) {
      updateItemQty(qtyBtn.dataset.qtyId, Number(qtyBtn.dataset.delta));
      return;
    }

    const removeBtn = e.target.closest("[data-remove-id]");
    if (removeBtn) {
      removeItem(removeBtn.dataset.removeId);
      return;
    }

    const openProd = e.target.closest("[data-open-product]");
    if (openProd) {
      openProductModal(openProd.dataset.openProduct);
      return;
    }

    if (e.target.id === "productModal" || e.target.closest("#closeModalBtn")) {
      closeProductModal();
    }
  });

  // تهيئة البحث وشريط التمرير
  function init() {
    const searchBtn = document.getElementById("openSearchBtn");
    const searchDrawer = document.getElementById("searchDrawer");
    const searchInput = document.getElementById("globalSearchInput");
    const clearSearchBtn = document.getElementById("clearSearchBtn");

    searchBtn.addEventListener("click", () => {
      searchDrawer.classList.toggle("open");
      if (searchDrawer.classList.contains("open")) {
        searchInput.focus();
      }
    });

    searchInput.addEventListener("input", (e) => {
      state.searchQuery = e.target.value;
      clearSearchBtn.classList.toggle("hidden", !state.searchQuery);
      if (state.route !== "home" && state.route !== "categories") {
        navigateTo("categories");
      } else {
        renderCurrentView();
      }
    });

    clearSearchBtn.addEventListener("click", () => {
      state.searchQuery = "";
      searchInput.value = "";
      clearSearchBtn.classList.add("hidden");
      renderCurrentView();
    });

    window.addEventListener("scroll", () => {
      const header = document.getElementById("topHeader");
      header.classList.toggle("scrolled", window.scrollY > 10);
    });

    updateCartBadges();
    renderCurrentView();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
