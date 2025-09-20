import * as model from "./model.js";
import loginView from "./views/loginView.js";
import productsView from "./views/productsView.js";
import paginationView from "./views/paginationView.js";

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

async function controlProductsView() {
  if (location.hash === "#login") return;
  if (location.hash === "#register") return;

  const data = await model.fetchProducts();
  const { total, per_page: itemsPerPage } = data.meta;
  productsView.renderShopUI(itemsPerPage, total);
  productsView.renderItems(data.data);
  const { links, meta } = data;
  console.log(data);

  const { last_page: lastPage, current_page: currentPage } = meta;
  paginationView.renderPagination(lastPage, currentPage);
  console.log(links);
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

function init() {
  console.log(model.state);
  // const userImg = model.state;
  const { isLoggedIn, currentPage } = model.state;
  loginView.setNavContainerContent(isLoggedIn);
  loginView.addHandlerChangeForm(controlForm);
  loginView.addHandlerSubmitForm((credentials) =>
    controlFormSubmit(credentials),
  );

  productsView.addHandlerShowProducts(
    controlProductsView,
    model.state.isLoggedIn,
    // userImg,
  );
  // paginationView.addHandlerPaginationRender(controlPageChange(currentPage));
  paginationView.addHandlerPageChange(controlPageChange);
  // paginationView.addHandlerPaginationRender(controlPaginationView);
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
