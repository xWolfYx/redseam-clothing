import * as model from "./model.js";
import loginView from "./views/loginView.js";
import productsView from "./views/productsView.js";
import paginationView from "./views/paginationView.js";
import productSettingsView from "./views/productSettingsView.js";

function controlForm() {
  const { isLoggedIn } = model.state;
  if (isLoggedIn) return;

  if (location.hash === "#login" || location.hash === "#register")
    loginView.renderForm();
}

function controlFormSubmit(credentials) {
  if (location.hash === "#login") model.login(credentials);
  if (location.hash === "#register") model.register(credentials);
}

async function renderItemCount() {
  if (location.hash === "#login") return;
  if (location.hash === "#register") return;

  const data = await model.fetchProducts();
  const { total, per_page: itemsPerPage } = data.meta;
  productsView.renderItemCount(itemsPerPage, total);
  productsView.renderItems(data.data);
  const { /* links, */ meta } = data;
  console.log(data);

  const { last_page: lastPage, current_page: currentPage } = meta;
  paginationView.renderPagination(lastPage, currentPage);
}

async function controlPageChange(page) {
  const { lastPage } = model.state;

  if (page < 1) return;
  if (page > lastPage) return;
  if (page === model.state.currentPage) return;

  model.state.currentPage = page;
  const data = await model.fetchProducts(page);
  const { current_page: currentPage } = data.meta;
  productsView.renderItems(data.data);
  paginationView.renderPagination(lastPage, currentPage);
}

function initUserNavActions() {
  const { isLoggedIn } = model.state;
  if (isLoggedIn) return;
  else location.hash = "#login";
}

function controlItemOptions(setting) {
  if (setting === "filter") productSettingsView.toggleFilterOptions();
  if (setting === "sort") productSettingsView.toggleSortOptions();
}

async function controlFilter(values) {
  const { from, to } = values;
  model.state.filter.from = from;
  model.state.filter.to = to;

  // Fetch the data
  const data = await model.fetchProducts();
  productsView.renderItems(data.data);

  // Rerender pagination
  const { lastPage } = model.state;
  paginationView.renderPagination(lastPage, 1);
}

async function controlSort(sortOption) {
  model.state.sort = sortOption;
  const data = await model.fetchProducts();
  productsView.renderItems(data.data);
  const { lastPage } = model.state;
  paginationView.renderPagination(lastPage, 1);
  console.log(data);
}

function init() {
  console.log(model.state);
  // const userImg = model.state;
  const { isLoggedIn /* currentPage */ } = model.state;
  loginView.setNavContainerContent(isLoggedIn);
  loginView.addHandlerChangeForm(controlForm);
  loginView.addHandlerSubmitForm((credentials) =>
    controlFormSubmit(credentials),
  );

  productsView.addHandlerShowProducts(
    renderItemCount,
    model.state.isLoggedIn,
    // userImg,
  );
  paginationView.addHandlerPageChange(controlPageChange);

  document
    .querySelector(".nav-container")
    .addEventListener("click", initUserNavActions);
  productSettingsView.addHandlerSettingsRender(controlItemOptions);

  productSettingsView.addHandlerFilterItems(controlFilter);
  productSettingsView.addHandlerSortItems(controlSort);
}

init();

/*

On page load, it asks the Model if there’s a token.
If yes, it tells the Model to fetch products and hands them to ItemsView to display.
If no, it tells loginView to show the login form,
then listens for submits or toggle clicks (to switch to registration).
When you submit a form, it sends the inputs to the Model’s login or register,
then updates the View based on success (products) or failure (error message).

*/
