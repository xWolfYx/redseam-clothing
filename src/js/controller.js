import * as model from "./model.js";
import loginView from "./views/loginView.js";
import productsView from "./views/productsView.js";
import paginationView from "./views/paginationView.js";

function controlForm() {
  const { isLoggedIn } = model.state;
  if (isLoggedIn) return;

  console.log(isLoggedIn);

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
  const { total } = data.meta;
  productsView.renderShopUI(total);
  productsView.renderItems(data.data);
  const { links } = data;
  console.log(data);

  const { first, last, next, prev } = links;
  paginationView.renderPagination(first, last, next, prev, total);
  console.log(links);
}

function init() {
  // const userImg = model.state;
  const { isLoggedIn } = model.state;
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
