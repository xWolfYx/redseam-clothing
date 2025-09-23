import * as model from "./model.js";
import loginView from "./views/loginView.js";
import productsView from "./views/productsView.js";
import paginationView from "./views/paginationView.js";
import productSettingsView from "./views/productSettingsView.js";
import listingView from "./views/listingView.js";

class Controller {
  constructor() {
    this.#init();
  }

  #init() {
    // const userImg = model.state;
    const { isLoggedIn /* currentPage */ } = model.state;
    loginView.setNavContainerContent(isLoggedIn);
    loginView.addHandlerChangeForm(this.controlForm.bind(this));
    loginView.addHandlerSubmitForm((credentials) =>
      this.controlFormSubmit(credentials),
    );

    productsView.addHandlerShowProducts(
      this.renderItemCount.bind(this),
      model.state.isLoggedIn,
      // userImg,
    );
    paginationView.addHandlerPageChange(this.controlPageChange.bind(this));

    document
      .querySelector(".nav-container")
      .addEventListener("click", this.initUserNavActions.bind(this));
    productSettingsView.addHandlerSettingsRender(
      this.controlItemOptions.bind(this),
    );

    productSettingsView.addHandlerFilterItems(this.controlFilter.bind(this));
    productSettingsView.addHandlerSortItems(this.controlSort.bind(this));
    listingView.addHandlerRenderListing(this.controlRenderListing.bind(this));
    listingView.addHandlerToggleListing(this.controlToggleListing.bind(this));
    listingView.addHandlerListImgChange(this.controlListImgChange.bind(this));
  }

  controlForm() {
    const { isLoggedIn } = model.state;
    if (isLoggedIn) return;

    if (location.hash === "#login" || location.hash === "#register")
      loginView.renderForm();
  }

  controlFormSubmit(credentials) {
    if (location.hash === "#login") model.login(credentials);
    if (location.hash === "#register") model.register(credentials);
  }

  async renderItemCount() {
    try {
      if (location.hash === "#login" || location.hash === "#register") return;
      await this.#fetchAndRenderProducts();
    } catch (err) {
      console.log(err);
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

  initUserNavActions() {
    const { isLoggedIn } = model.state;
    if (isLoggedIn) return;
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

  controlListImgChange(targetImg) {
    listingView.changeListingImage(targetImg);
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
      console.log(err);
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
