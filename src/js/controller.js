// import { API_URL, AUTH_TOKEN } from "./config.js";
// import PreLoginView from "./views/preLoginView.js";
import * as model from "./model.js";
import preLoginView from "./views/preLoginView.js";
// import View from "./views/view.js";
// import itemsView from "./views/itemsView.js";

function controlForm() {
  const { isLoggedIn } = model.state;

  if (!isLoggedIn) {
    preLoginView.renderForm();
  }
}

function controlFormSubmit(credentials) {
  if (location.hash === "#login" || location.hash === "")
    model.login(credentials);
  else if (location.hash === "#register") model.register(credentials);
}

function init() {
  preLoginView.addHandlerChangeForm(controlForm);
  preLoginView.addHandlerSubmitForm((credentials) =>
    controlFormSubmit(credentials),
  );
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
