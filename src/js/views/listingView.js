import View from "./View.js";
import * as icon from "./icons.js";

class ListingView extends View {
  _parent = document.querySelectorAll(".shop-list");

  addHandlerShowListing(handler) {
    document.addEventListener("click", (e) => {
      const productCard = e.target.closest(".product-card");
      if (!productCard) return;
      else handler(productCard);
    });
  }

  showListing(productData) {
    // Data from the API

    const {
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

    const colorsContainer = document.querySelector(".color-btns");
    colorsContainer.innerHTML = availableColors
      .map(
        (color) =>
          `<button data-color="color" style="background-color: ${color.toLowerCase()}" class="color-btn"></button>`,
      )
      .join("");

    const sizesContainer = document.querySelector(".size-btns");
    sizesContainer.innerHTML = availableSizes
      .map(
        (size) =>
          `<button data-size="${size}" class="size-btn">${size}</button>`,
      )
      .join("");

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

    console.log(productData);
  }
}

export default new ListingView();
