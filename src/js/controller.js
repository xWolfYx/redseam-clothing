import * as model from "./model.js";
import loginView from "./views/loginView.js";
import productsView from "./views/productsView.js";
import paginationView from "./views/paginationView.js";
import productSettingsView from "./views/productSettingsView.js";
import listingView from "./views/listingView.js";
import cartView from "./views/cartView.js";
import checkoutView from "./views/checkoutView.js";

class Controller {
  constructor() {
    this.#init();
  }

  #init() {
    const { isLoggedIn } = model.state;
    const userImage = JSON.parse(localStorage.getItem(`userImg`));
    loginView.setNavContainerContent(isLoggedIn, userImage);
    loginView.addHandlerChangeForm(this.controlForm.bind(this));
    loginView.addHandlerSubmitForm((credentials) =>
      this.controlFormSubmit(credentials),
    );
    loginView.addHandlerPasswordDisplay(this.controlPasswordDisplay);

    loginView.addHandlerSetUserImg(this.controlSetUserImg.bind(this));
    loginView.addHandlerRemoveUserImg(this.controlRemoveUserImg.bind(this));

    productsView.addHandlerShowProducts(
      this.renderItemCount.bind(this),
      model.state.isLoggedIn,
      // userImg,
    );
    paginationView.addHandlerPageChange(this.controlPageChange.bind(this));

    document
      .querySelector(".nav-container")
      .addEventListener("click", this.controlUserNavActions.bind(this));
    productSettingsView.addHandlerSettingsRender(
      this.controlItemOptions.bind(this),
    );

    cartView.addHandlerAddToCart(this.controlAddToCart.bind(this));
    cartView.addHandlerRemoveFromCart(this.controlRemoveFromCart.bind(this));
    cartView.addHandlerChangeItemCount(this.controlChangeItemCount.bind(this));
    productSettingsView.addHandlerFilterItems(this.controlFilter.bind(this));
    productSettingsView.addHandlerSortItems(this.controlSort.bind(this));
    listingView.addHandlerRenderListing(this.controlRenderListing.bind(this));
    listingView.addHandlerToggleListing(this.controlToggleListing.bind(this));
    listingView.addHandlerListImgChange(this.controlListImgChange.bind(this));
    listingView.addHandlerSetItemColor(this.controlSetItemColor.bind(this));
    listingView.addHandlerSetItemSize(this.controlSetItemSize.bind(this));
    checkoutView.addHandlerCheckoutRender(
      this.controlRenderCheckoutContainer.bind(this),
    );
    checkoutView.addHandlerRemoveFromCart(
      this.controlRemoveFromCheckoutCart.bind(this),
    );
    checkoutView.addHandlerChangeItemCount(
      this.controlChangeCheckoutItemCount.bind(this),
    );
    checkoutView.addHandlerControlCheckout(this.controlCheckout.bind(this));

    if (isLoggedIn) this.controlGetCartItems();
  }

  controlForm() {
    const { isLoggedIn } = model.state;
    if (isLoggedIn) return;

    if (location.hash === "#login" || location.hash === "#register")
      loginView.renderForm();
    else loginView.hideForm();
  }

  controlPasswordDisplay(btn) {
    loginView.togglePasswordDisplay(btn);
  }

  controlSetUserImg(target) {
    loginView.setUserImg(target);
  }

  controlRemoveUserImg(target) {
    loginView.removeUserImg(target);
  }

  async controlFormSubmit(credentials) {
    try {
      if (location.hash === "#login") {
        const res = await model.login(credentials);
        if (res.status === 200) {
          location.hash = "";
          loginView.setNavContainerContent(true, model.state.userInfo.userImg);
          location.reload();
        }
      }

      if (location.hash === "#register") {
        const res = await model.register(credentials);
        console.log(res);
        if (res.status === 200) location.hash = "";
        location.reload();
      }
    } catch (err) {
      loginView.displayErrorMsg(err);
    }
  }

  async renderItemCount() {
    try {
      if (location.hash === "#login" || location.hash === "#register") return;
      await this.#fetchAndRenderProducts();
    } catch (err) {
      console.log(err.message);
    }
  }

  async controlPageChange(page) {
    try {
      const { lastPage, currentPage } = model.state;
      if (page < 1 || page > lastPage || page === currentPage) return;

      model.state.currentPage = page;
      this.#fetchAndRenderProducts(page);
    } catch (err) {
      console.log(err.message);
    }
  }

  controlUserNavActions() {
    const { isLoggedIn } = model.state;
    if (isLoggedIn) cartView.toggleCart();
    else location.hash = "#login";
  }

  controlItemOptions(setting) {
    if (setting === "filter") productSettingsView.toggleFilterOptions();
    if (setting === "sort") productSettingsView.toggleSortOptions();
  }

  async controlFilter(values) {
    try {
      const { from, to } = values;
      model.state.filter.from = from;
      model.state.filter.to = to;

      // Fetch the data
      this.#fetchAndRenderProducts();
    } catch (err) {
      console.log(err.message);
    }
  }

  async controlSort(sortOption) {
    try {
      model.state.sort = sortOption;
      this.#fetchAndRenderProducts();
    } catch (err) {
      console.log(err.message);
    }
  }

  async controlRenderListing(item) {
    try {
      const { id } = item.dataset;
      const productData = await model.fetchItem(id);
      await listingView.renderListing(productData);
    } catch (err) {
      console.log(err.message);
    }
  }

  controlToggleListing(listingState) {
    if (listingState === "show") listingView.showListing();
    if (listingState === "hide") listingView.hideListing();
  }

  controlListImgChange(targetImg, colorNum) {
    listingView.changeListingImage(targetImg, colorNum);
  }

  controlSetItemColor(colorBtn, colorNum) {
    listingView.setItemColor(colorBtn);
    listingView.changeListingImage(undefined, colorNum);
  }

  controlSetItemSize(sizeBtn) {
    listingView.setItemSize(sizeBtn);
  }

  async controlAddToCart() {
    const data = listingView.getItemData();
    const { id, specs: itemData } = data;
    await model.addToCart(id, itemData);

    const updatedCart = await model.getCartContent();
    cartView.renderCartUI(updatedCart);
  }

  async controlRemoveFromCart(id, color, size) {
    await model.removeFromCart(id, color, size);
    const updatedCart = await model.getCartContent();
    cartView.renderCartUI(updatedCart);
  }

  async controlChangeItemCount({ id, quantity, color, size }) {
    await model.changeItemCount(id, quantity, color, size);
    const updatedCart = await model.getCartContent();
    cartView.renderCartUI(updatedCart);
  }

  async controlGetCartItems() {
    const cartItemData = await model.getCartContent();
    cartView.renderCartUI(cartItemData);
  }

  async controlRenderCheckoutContainer() {
    try {
      if (!model.state.isLoggedIn) return;
      const data = await model.getCartContent();

      if (location.hash === "#checkout") checkoutView.renderCheckoutForm(data);
    } catch (err) {
      console.log(err.message);
    }
  }

  async controlRemoveFromCheckoutCart(id, color, size) {
    await model.removeFromCart(id, color, size);
    const updatedCart = await model.getCartContent();
    cartView.renderCartUI(updatedCart);
    checkoutView.renderCheckoutUI(updatedCart);
  }

  async controlChangeCheckoutItemCount({ id, quantity, color, size }) {
    await model.changeItemCount(id, quantity, color, size);
    const updatedCart = await model.getCartContent();
    cartView.renderCartUI(updatedCart);
    checkoutView.renderCheckoutUI(updatedCart);
  }

  async controlCheckout(data) {
    try {
      const res = await model.initCheckout(data);

      if (res.message === "Checkout successful. Thank you for your purchase!") {
        checkoutView.displayCheckoutConfirm();
        checkoutView.hideCheckoutForm();
        cartView.renderCartUI();
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  async #fetchAndRenderProducts(page = model.state.currentPage) {
    try {
      const data = await model.fetchProducts(page);
      const {
        total,
        per_page: itemsPerPage,
        last_page: lastPage,
        current_page: currentPage,
      } = data.meta;

      model.state.lastPage = lastPage;
      productsView.renderItemCount(itemsPerPage, total);
      productsView.renderItems(data.data);
      paginationView.renderPagination(lastPage, currentPage);
    } catch (err) {
      console.log(err.message);
    }
  }
}

new Controller();

/*

On page load, it asks the Model if there’s a token.
If yes, it tells the Model to fetch products and hands them to ItemsView to display.
If no, it tells loginView to show the login form,
then listens for submits or toggle clicks (to switch to registration).
When you submit a form, it sends the inputs to the Model’s login or register,
then updates the View based on success (products) or failure (error message).

*/
