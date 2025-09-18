// import { API_URL, AUTH_TOKEN } from "./config.js";
// import PreLoginView from "./views/preLoginView.js";
import * as model from "./model.js";
import preLoginView from "./views/preLoginView.js";
// import View from "./views/view.js";
import productsView from "./views/productsView.js";

function controlForm() {
  const { isLoggedIn } = model.state;

  if (!isLoggedIn) {
    location.hash = "";
    preLoginView.renderForm();
    preLoginView.setNavContainerContent();
  }

  if (isLoggedIn) {
    location.hash = "#products";
    model.fetchProducts();
  }
}

function controlFormSubmit(credentials) {
  if (location.hash === "#login" || location.hash === "")
    model.login(credentials);
  else if (location.hash === "#register") model.register(credentials);
}

async function controlProductsView() {
  const data = await model.fetchProducts();
  const { current_page, last_page, total } = data.meta;
  if (location.hash === "#products") {
    productsView.renderShopUI(current_page, last_page, total);
    productsView.renderItems(data.data);
  }
}

function init() {
  preLoginView.addHandlerChangeForm(controlForm);
  preLoginView.addHandlerSubmitForm((credentials) =>
    controlFormSubmit(credentials),
  );
  productsView.addHandlerShowProducts(controlProductsView);
}

init();

/*

On page load, it asks the Model if there’s a token.
If yes, it tells the Model to fetch products and hands them to ItemsView to display.
If no, it tells PreLoginView to show the login form,
then listens for submits or toggle clicks (to switch to registration).
When you submit a form, it sends the inputs to the Model’s login or register,
then updates the View based on success (products) or failure (error message).

*/
