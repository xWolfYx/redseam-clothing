import View from "./View";
import * as icon from "./icons";

class CheckoutView extends View {
  _parent = document.querySelector(".checkout-container");

  addHandlerCheckoutRender(handler) {
    ["hashchange", "load"].forEach((ev) =>
      window.addEventListener(ev, handler),
    );
  }

  addHandlerRemoveFromCart(handler) {
    this._parent.addEventListener("click", (e) => {
      if (!e.target.classList.contains("cart-item-remove")) return;

      const itemID = e.target.closest(".cart-item").dataset.id;
      const itemColor = e.target.closest(".cart-item").dataset.color;
      const itemSize = e.target.closest(".cart-item").dataset.size;

      handler(+itemID, itemColor, itemSize);
    });
  }

  addHandlerChangeItemCount(handler) {
    this._parent.addEventListener("click", (e) => {
      const quantitySelector = e.target.closest(".cart-item-quantity-selector");

      if (!quantitySelector) return;

      const id = +e.target.closest(".cart-item").dataset.id;
      const color = e.target.closest(".cart-item").dataset.color;
      const size = e.target.closest(".cart-item").dataset.size;

      const decreaseBtn = e.target.closest(".decrease-quantity-btn");
      const increaseBtn = e.target.closest(".increase-quantity-btn");

      if (decreaseBtn) {
        const quantity = +decreaseBtn.nextElementSibling.textContent;
        if (quantity < 2) return;
        handler({ quantity: quantity - 1, id, color, size });
      }

      if (e.target.closest(".increase-quantity-btn")) {
        const quantity = increaseBtn.previousElementSibling.textContent;
        handler({ quantity: +quantity + 1, id, color, size });
      }
    });
  }

  addHandlerControlCheckout(handler) {
    const payBtn = this._parent.querySelector(".pay-btn");
    payBtn.addEventListener("click", () => {
      const form = this._parent.querySelector(".checkout-form");
      const dataArr = new FormData(form);
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  renderCheckoutForm(data) {
    const shopContainer = document.querySelector(".shop-container");

    shopContainer.classList.add("hidden");
    this._parent.classList.remove("hidden");

    this.renderCheckoutUI(data);
  }

  hideCheckoutForm() {
    const shopContainer = document.querySelector(".shop-container");
    this._parent.classList.add("hidden");
    shopContainer.classList.remove("hidden");
  }

  renderCheckoutUI(data) {
    const cartOverviewDiv = document.querySelector(".cart-overview");
    const itemSubtotalPriceEl = this._parent.querySelector(
      ".items-subtotal-price",
    );
    const deliveryPriceEl = this._parent.querySelector(".delivery-price");
    const totalPriceEl = this._parent.querySelector(".total-price");

    const totalItemPrice = data.reduce(
      (acc, item) => (acc += item.total_price),
      0,
    );

    const deliveryPrice = 5;

    cartOverviewDiv.innerHTML = this.renderCheckoutItems(data);
    itemSubtotalPriceEl.textContent = `$ ${totalItemPrice}`;
    deliveryPriceEl.textContent = `$ ${deliveryPrice}`;
    totalPriceEl.textContent = `$ ${totalItemPrice + deliveryPrice}`;
  }

  renderCheckoutItems(data) {
    return data
      .map((item) => {
        const isDisabled = item.quantity <= 1 ? true : false;
        const cartIconPlus = `
          <svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.75 1.25C5.75 0.835786 5.41421 0.5 5 0.5C4.58579 0.5 4.25 0.835786 4.25 1.25V4.75H0.75C0.335786 4.75 0 5.08579 0 5.5C0 5.91421 0.335786 6.25 0.75 6.25L4.25 6.25V9.75C4.25 10.1642 4.58579 10.5 5 10.5C5.41421 10.5 5.75 10.1642 5.75 9.75V6.25L9.25 6.25C9.66421 6.25 10 5.91421 10 5.5C10 5.08579 9.66421 4.75 9.25 4.75H5.75V1.25Z"
          fill="${this._activeBtnColor}"/>
          </svg>`;
        const cartIconMinus = `
          <svg width="10" height="3" viewBox="0 0 10 3" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.75 0.75C0.335786 0.75 0 1.08579 0 1.5C0 1.91421 0.335786 2.25 0.75 2.25L9.25 2.25C9.66421 2.25 10 1.91421 10 1.5C10 1.08579 9.66421 0.75 9.25 0.75H0.75Z"
          fill="${isDisabled ? this._disabledBtnColor : this._activeBtnColor}"/>
          </svg>`;
        return `
          <div class="cart-item" data-id="${item.id}" data-color="${item.color}" data-size="${item.size}">
            <img src="${item.cover_image}" alt="" class="cart-item-img">
            <div class="cart-item-info">
              <span class="cart-item-name">${item.name}</span>
              <span class="cart-item-price">$ ${item.price}</span>
              <span class="cart-item-color">${item.color}</span>
              <span class="cart-item-size">${item.size}</span>
            </div>
            <div class="cart-item-actions">
              <div class="cart-item-quantity-selector">
                <button class="decrease-quantity-btn" ${isDisabled ? "disabled" : ""}>${cartIconMinus}</button>
                <span>${item.quantity}</span>
                <button class="increase-quantity-btn">${cartIconPlus}</button>
              </div>
              <span class="cart-item-remove">Remove</span>
            </div>
          </div>`;
      })
      .join("");
  }

  displayCheckoutConfirm() {
    const checkoutMessageWrapper = document.createElement("div");
    checkoutMessageWrapper.classList = "checkout-message-wrapper";
    document.body.append(checkoutMessageWrapper);
    const checkoutMessageDiv = document.createElement("div");
    checkoutMessageDiv.className = "checkout-message-div";
    checkoutMessageWrapper.append(checkoutMessageDiv);

    const msgCloseBtn = document.createElement("div");
    msgCloseBtn.classList = "msg-close-btn";
    msgCloseBtn.innerHTML = `<img src="${icon.xMark}">`;
    checkoutMessageDiv.append(msgCloseBtn);

    const messageTextDiv = document.createElement("div");
    messageTextDiv.className = "message-text-container";
    checkoutMessageDiv.append(messageTextDiv);
    messageTextDiv.innerHTML = `
    <div class="checkout-message">
      <img src="${icon.vector}">
      <span class="main-msg">Congrats!</span>
      <span class="secondary-msg">Your order is placed successfully!</span>
      <button class="checkout-message-btn">Continue shopping</button>
    </div>`;

    checkoutMessageWrapper.addEventListener("click", (e) => {
      if (
        e.target.closest(".msg-close-btn") ||
        e.target.closest(".checkout-message-btn")
      )
        checkoutMessageWrapper.style.opacity = "0";
      setTimeout(() => {
        checkoutMessageWrapper.remove();
        location.hash = "";
      }, 200);
    });
  }
}

export default new CheckoutView();
