import * as icon from "./icons";

class CartView {
  _parent = document.querySelector(".cart");

  addHandlerAddToCart(handler) {
    const addToCartBtn = document.querySelector(".listing-add-to-cart-btn");
    addToCartBtn.addEventListener("click", handler);
  }

  renderCartUI() {
    // if nothing is in the cart
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
  }

  toggleCart() {
    const cartWrapper = document.querySelector(".cart-wrapper");
    const cartCloseBtn = document.querySelector(".cart-close-btn");
    cartCloseBtn.addEventListener("click", () => {
      this._parent.classList.remove("open");
      cartWrapper.classList.add("hidden");
    });

    if (cartWrapper.classList.contains("hidden")) {
      cartWrapper.classList.remove("hidden");
      this._parent.classList.add("open");
    }
    console.log("Cart opened");
  }
}

export default new CartView();
