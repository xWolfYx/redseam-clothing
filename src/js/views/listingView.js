import View from "./View.js";
import * as icon from "./icons.js";

class ListingView extends View {
  _parent = document.querySelector(".listing-container");

  addHandlerRenderListing(handler) {
    document.addEventListener("click", (e) => {
      const productCard = e.target.closest(".product-card");
      if (!productCard) return;
      else handler(productCard);
    });
  }

  addHandlerToggleListing(handler) {
    document.addEventListener("click", (e) => {
      const listingContainer = e.target.classList.contains("top-nav");
      const productCard = e.target.closest(".product-card");
      if (productCard) handler("show");
      else if (listingContainer) handler("hide");
    });
  }

  addHandlerListImgChange(handler) {
    document.addEventListener("click", (e) => {
      const targetImg = e.target.closest("img");
      if (!targetImg || !targetImg.closest(".listing-other-imgs")) return;
      handler(targetImg);
    });
  }

  addHandlerSetItemColor(handler) {
    document.addEventListener("click", (e) => {
      const colorBtn = e.target.closest("button");
      if (!colorBtn || !colorBtn.closest(".color-btns")) return;

      const { colorNum } = colorBtn.dataset;
      handler(colorBtn, +colorNum);
    });
  }

  addHandlerSetItemSize(handler) {
    document.addEventListener("click", (e) => {
      const sizeBtn = e.target.closest("button");
      if (!sizeBtn || !sizeBtn.closest(".size-btns")) return;

      handler(sizeBtn);
    });
  }

  renderListing(productData) {
    // Data from the API

    const {
      id,
      name,
      description,
      cover_image: coverImg,
      images, // [array]
      price,
      available_colors: availableColors, // [array]
      available_sizes: availableSizes, // [array]
      brand, // {object}
      quantity,
    } = productData;

    const { image: brandImg, name: brandName } = brand;

    // DOM elements

    this._parent.setAttribute("data-id", id);

    const nameEl = document.querySelector(".listing-name");
    nameEl.textContent = name;

    const descriptionEl = document.querySelector(".description");
    descriptionEl.textContent = description;

    const coverImgEl = document.querySelector(".listing-cover-img");
    coverImgEl.setAttribute("src", coverImg);
    coverImgEl.setAttribute("alt", name);

    const otherImgsEl = document.querySelector(".listing-other-imgs");
    otherImgsEl.innerHTML = images
      .map((img) => `<img src="${img}" alt="Other image">`)
      .join("");

    const priceEl = document.querySelector(".listing-price");
    priceEl.textContent = `$ ${price}`;

    const colorSpan = document.querySelector(".color");
    colorSpan.textContent = "Choose color:";

    const colorsContainer = document.querySelector(".color-btns");
    colorsContainer.innerHTML = availableColors
      .map(
        (color, i) =>
          `<button data-color="${color}" data-color-num="${i}" style="background-color: ${color.toLowerCase()}" class="color-btn"></button>`,
      )
      .join("");

    const sizeSpan = document.querySelector(".size");
    sizeSpan.textContent = "Choose size:";

    const sizesContainer = document.querySelector(".size-btns");
    sizesContainer.innerHTML = availableSizes
      ? availableSizes
          .map(
            (size) =>
              `<button data-size="${size}" data-size="${size}" class="size-btn">${size}</button>`,
          )
          .join("")
      : "No sizes available for this product";

    const quantityEl = document.querySelector("#quantity");

    let quantityHTML = "";

    for (let i = 1; i <= quantity; i++) {
      if (!quantity) quantityHTML = `<option value="0">0</value>`;
      else quantityHTML += `<option value="${i}">${i}</value>`;
    }
    quantityEl.innerHTML = quantityHTML;

    const listingAddToCartBtn = document.querySelector(
      ".listing-add-to-cart-btn",
    );

    listingAddToCartBtn.innerHTML = `<img src="${icon.cartWhite}"> Add to cart`;

    const brandImgEl = document.querySelector(".brand-img");
    brandImgEl.setAttribute("src", brandImg);

    const brandNameEl = document.querySelector(".brand-name");
    brandNameEl.textContent = `Brand: ${brandName}`;
  }

  showListing() {
    const shopList = document.querySelector(".shop-list");
    this._parent.classList.remove("hidden");
    shopList.classList.add("hidden");
  }

  hideListing() {
    const shopList = document.querySelector(".shop-list");
    this._parent.classList.add("hidden");
    shopList.classList.remove("hidden");
  }

  changeListingImage(targetImg, colorNum) {
    const listingImgContainer = document.querySelector(".listing-other-imgs");
    const listingImgs = [...listingImgContainer.children];
    const listingImgSrc = listingImgs.map((img) => img.getAttribute("src"));
    const coverImg = document.querySelector(".listing-cover-img");

    if (targetImg && colorNum === undefined)
      coverImg.setAttribute("src", targetImg.getAttribute("src"));
    if (colorNum !== undefined && !targetImg)
      coverImg.setAttribute("src", listingImgSrc[colorNum]);
  }

  setItemColor(colorBtn) {
    const colorBtnsContainer = document.querySelector(".color-btns");
    const allBtns = colorBtnsContainer.children;
    const colorSpan = document.querySelector(".color");

    [...allBtns].forEach((btn) => btn.classList.remove("active"));
    colorBtn.classList.add("active");
    colorSpan.textContent = `Color: ${colorBtn.dataset.color}`;
  }

  setItemSize(sizeBtn) {
    const sizeBtnsContainer = document.querySelector(".size-btns");
    const allBtns = sizeBtnsContainer.children;
    const sizeSpan = document.querySelector(".size");

    [...allBtns].forEach((btn) => btn.classList.remove("active"));
    sizeBtn.classList.add("active");
    sizeSpan.textContent = `Size: ${sizeBtn.dataset.size}`;
  }

  getItemData() {
    const listItemParameters = document.querySelector(".listing-parameters");
    const dataArr = new FormData(listItemParameters);

    const id = this._parent.getAttribute("data-id");
    const quantity = +dataArr.get("quantity");
    const colorBtn = document.querySelector(".color-btn.active");
    const sizeBtn = document.querySelector(".size-btn.active");

    const color = colorBtn ? colorBtn.dataset.color : null;
    const size = sizeBtn ? sizeBtn.dataset.size : null;

    const itemData = { id, specs: { color, size, quantity } };
    return itemData;
  }
}

export default new ListingView();
