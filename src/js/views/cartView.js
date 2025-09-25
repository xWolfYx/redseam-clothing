import * as icon from "./icons";

class CartView {
  _parent = document.querySelector(".cart");

  addHandlerAddToCart(handler) {
    const addToCartBtn = document.querySelector(".listing-add-to-cart-btn");
    addToCartBtn.addEventListener("click", handler);
  }

  addHandlerRemoveFromCart(handler) {
    document.addEventListener("click", (e) => {
      if (!e.target.classList.contains("cart-item-remove")) return;
      const itemId = e.target.closest(".cart-item").dataset.id;
      if (!itemId) return;
      else handler(+itemId);
    });
  }

  addHandlerRenderCartItems() {}

  renderCartUI(data) {
    const totalItemPrice = data.reduce(
      (acc, item) => (acc += item.total_price),
      0,
    );

    const deliveryPrice = 5;

    if (data.length <= 0) {
      this._parent.innerHTML = `
      <span class="cart-item-count">Shopping cart (0)</span>
      <div class="cart-close-btn">
        <img src="${icon.xMark}">
      </div>
      <div class="empty-cart-notice">
        <img src="${icon.emptyCart}">
        <span class="cart-msg-1">Ooops!</span>
        <span class="cart-msg-2">You've got nothing in your cart just yet...</span>
      </div>
      <button class="start-shopping-btn">Start shopping</button>`;
      return;
    }

    const html = `
      <span class="cart-item-count">Shopping cart (${data.length})</span>
      <div class="cart-close-btn">
        <img src="${icon.xMark}">
      </div>
        <div class="cart-items">
          ${this.renderCartItems(data)}
        </div>
      <div class="item-price">
        <span class="items-subtotal">Items subtotal</span>
        <span class="items-subtotal-price" span>$ ${totalItemPrice}</span>
        <span class="delivery">Delivery</span>
        <span class="delivery-price" span>$ ${deliveryPrice}</span>
        <span class="total">Total</span>
        <span class="total-price">$ ${totalItemPrice + deliveryPrice}</span>
      </div>
      <button class="go-to-checkout-btn">Go to checkout</button>`;

    this._parent.innerHTML = html;
  }

  toggleCart() {
    document.body.style.overflow = "hidden";
    const cartWrapper = document.querySelector(".cart-wrapper");
    const cartCloseBtn = document.querySelector(".cart-close-btn");

    cartWrapper.addEventListener("click", (e) => {
      if (!e.target.classList.contains("cart-wrapper")) return;

      document.body.style.overflow = "";
      this._parent.classList.remove("open");
      cartWrapper.classList.add("hidden");
    });

    cartCloseBtn.addEventListener("click", () => {
      document.body.style.overflow = "";
      this._parent.classList.remove("open");
      cartWrapper.classList.add("hidden");
    });

    if (cartWrapper.classList.contains("hidden")) {
      cartWrapper.classList.remove("hidden");
      this._parent.classList.add("open");
    }
    console.log("Cart opened");
  }

  renderCartItems(data) {
    const cartIconPlus = `
        <svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.75 1.25C5.75 0.835786 5.41421 0.5 5 0.5C4.58579 0.5 4.25 0.835786 4.25 1.25V4.75H0.75C0.335786 4.75 0 5.08579 0 5.5C0 5.91421 0.335786 6.25 0.75 6.25L4.25 6.25V9.75C4.25 10.1642 4.58579 10.5 5 10.5C5.41421 10.5 5.75 10.1642 5.75 9.75V6.25L9.25 6.25C9.66421 6.25 10 5.91421 10 5.5C10 5.08579 9.66421 4.75 9.25 4.75H5.75V1.25Z" fill="#3E424A"/>
        </svg>`;
    const cartIconMinus = `
        <svg width="10" height="3" viewBox="0 0 10 3" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.75 0.75C0.335786 0.75 0 1.08579 0 1.5C0 1.91421 0.335786 2.25 0.75 2.25L9.25 2.25C9.66421 2.25 10 1.91421 10 1.5C10 1.08579 9.66421 0.75 9.25 0.75H0.75Z" fill="#E1DFE1"/>
        </svg>`;

    return data
      .map(
        (item) => `
        <div class="cart-item" data-id="${item.id}">
          <img src="${item.cover_image}" alt="" class="cart-item-img">
          <div class="cart-item-info">
            <span class="cart-item-name">${item.name}</span>
            <span class="cart-item-price">$ ${item.price}</span>
            <span class="cart-item-color">${item.color}</span>
            <span class="cart-item-size">${item.size}</span>
          </div>
          <div class="cart-item-actions">
            <div class="cart-item-quantity-selector">
              <button>${cartIconMinus}</button>
              <span>${item.quantity}</span>
              <button>${cartIconPlus}</button>
            </div>
            <span class="cart-item-remove">Remove</span>
          </div>
        </div>`,
      )
      .join("");
  }
}

export default new CartView();
