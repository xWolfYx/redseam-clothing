import * as icon from "./icons";

class CartView {
  _parent = document.querySelector(".cart");
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
}

export default new CartView();
