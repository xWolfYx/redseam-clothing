import View from "./View.js";

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

  renderItemCount(itemsPerPage, totalItems) {
    this._parent.classList.remove("login");
    const displayInfo = document.querySelector(".display-info");
    displayInfo.textContent = `Showing 1-${itemsPerPage} of ${totalItems} results`;
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
    shopList.innerHTML = itemsHTMLString;
  }
}

export default new ProductsView();
