import View from "./View.js";
import * as icon from "./icons.js";

/*
ProductsView: Shows the product list with names,
prices, and images, plus a header (e.g., “Showing 1-10 of 50 results”).
*/

class ProductsView extends View {
  addHandlerShowProducts(handler) {
    ["hashchange", "load"].forEach((ev) =>
      window.addEventListener(ev, handler),
    );
  }

  renderShopUI(itemsPerPage, totalItems) {
    document.querySelector(".main-container").classList.remove("login");
    this._parent.innerHTML = `
         <header class="product-list-header">
          <h1>Products</h1>
          <div class="list-info-container">
            <span class="display-info">Showing 1-${itemsPerPage} of ${totalItems} results</span>
            <div class="filter-settings">
              <img src="${icon.adjustmentsHor}">
              <span>Filter</span>
            </div>
            <div class="sort-settings">
              <span>Sort</span>
              <img src="${icon.chevronDown}">
            </div>
          </div>
        </header>
        <div class="shop-list"></div>`;
  }

  renderItems(list) {
    const shopList = document.querySelector(".shop-list");
    let itemsHTMLString = "";
    list.forEach((item) => {
      itemsHTMLString += `
          <div class="product-card">
            <div class="img-container">
              <img src="${item.cover_image}" class="cover-img">
            </div>
            <div class="item-text">
              <p class="item-name">${item.name}</p>
              <p class="item-price">$ ${item.price}</p>
            </div>
          </div>`;
    });
    shopList.insertAdjacentHTML("beforeend", itemsHTMLString);
  }
}

export default new ProductsView();
