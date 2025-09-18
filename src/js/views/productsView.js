import View from "./View.js";

/*
ProductsView: Shows the product list with names,
prices, and images, plus a header (e.g., “Showing 1-10 of 50 results”).
*/

class ProductsView extends View {
  _parent = document.querySelector(".main-container");

  addHandlerShowProducts(handler) {
    ["hashchange", "load"].forEach((ev) =>
      window.addEventListener(ev, handler),
    );
  }

  renderShopUI(page, totalPages, totalItems) {
    document.querySelector(".main-container").classList.remove("pre-login");
    this._parent.innerHTML = `
         <header class="product-list-header">
          <h1>Products</h1>
          <div class="list-info-container">
            <span class="display-info">Showing 1-10 of ${totalItems} results</span>
            <div class="filter-settings">
              <img src="../../src/img/adjustments-horizontal.svg">
              <span>Filter</span>
            </div>
            <div class="sort-settings">
              <span>Sort</span>
              <img src="src/img/chevron-down.svg">
            </div>
          </div>
        </header>
        <div class="shop-list"></div>
        <footer>
          <div class="page-container">
            <img src="src/img/chevron-left.svg" alt="">
            <span class="page active">${page}</span>
            <span class="page">${page + 1}</span>
            <span class="page">...</span>
            <span class="page">${totalPages - 1}</span>
            <span class="page">${totalPages}</span>
            <img src="src/img/chevron-right.svg" alt="">
          </div>
        </footer>`;
  }

  renderItems(list) {
    const shopList = document.querySelector(".shop-list");
    console.log(shopList);
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
    console.log(itemsHTMLString);
    shopList.insertAdjacentHTML("beforeend", itemsHTMLString);
  }
}

export default new ProductsView();
