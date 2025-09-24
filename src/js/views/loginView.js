import View from "./View.js";
import * as icon from "./icons.js";

/*
LoginView: Shows a login form or registration form.
It also listens for form submits or clicks on “Register”/“Log in” links to switch forms.
*/

/*
 *  Don't forget to add pre-login class to the main element
 *  <main class="main-container pre-login">
 */

class LoginView extends View {
  _parent = document.querySelector(".login-container");
  addHandlerChangeForm(handler) {
    ["hashchange", "load"].forEach((ev) =>
      window.addEventListener(ev, handler),
    );
  }

  addHandlerPasswordDisplay(handler) {
    this._parent.addEventListener("click", (e) => {
      if (!e.target.closest(".password-eye")) return;
      handler(e.target.closest("button"));
    });
  }

  addHandlerSubmitForm(handler) {
    window.addEventListener("submit", (e) => {
      e.preventDefault();
      const dataArr = new FormData(e.target);
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  renderForm() {
    const shopContainer = document.querySelector(".shop-container");
    const mainContainer = document.querySelector(".main-container");
    const loginForm = document.querySelector(".login-form");

    if (location.hash === "#login" || location.hash === "#register") {
      shopContainer.classList.add("hidden");
      mainContainer.classList.add("login");
      this._parent.classList.remove("hidden");
    } else {
      this._parent.classList.add("hidden");
      shopContainer.classList.remove("hidden");
      mainContainer.classList.remove("login");
    }

    if (location.hash === "#login") {
      loginForm.innerHTML = this.renderLoginForm();
    }

    if (location.hash === "#register") {
      loginForm.innerHTML = this.renderRegisterForm();
    }
  }

  renderRegisterForm() {
    return `
          <h1>Register</h1>
          <div class="input-fields">
            <input type="text" placeholder="Username" name="username" minlength="3" autocomplete="on" required>
            <input type="email" name="email" placeholder="Email" autocomplete="on" required>
            <div class="password-field">
              <input type="password" name="password" placeholder="Password" minlength="3" required>
              <button type="button" class="password-eye"><img src="${icon.passwordEye}"></button>
            </div>
            <div class="password-field">
              <input type="password" name="password_confirmation" placeholder="Confirm Password" required>
              <button type="button" class="password-eye"><img src="${icon.passwordEye}"></button>
            </div>
          </div>
          <div class="action-fields">
            <input type="submit" value="Log in">
            <p>Already member? <a href="#login">Log in</a></p>
          </div>`;
  }

  renderLoginForm() {
    return `
          <h1>Log in</h1>
          <div class="input-fields">
            <input type="email" placeholder="Email" name="email" autocomplete="on" required>
            <div class="password-field">
              <input type="password" placeholder="Password" name="password" required>
              <button type="button" class="password-eye"><img src="${icon.passwordEye}"></button>
            </div>
          </div>
          <div class="action-fields">
            <input type="submit" value="Log in">
            <p>Not a member? <a href="#register">Register</a></p>
          </div>`;
  }

  hideForm() {
    this._parent.classList.add("hidden");
  }

  setNavContainerContent(isLoggedIn, userImg) {
    const navContainer = document.querySelector(".nav-container");
    const userActions = isLoggedIn
      ? `
    <img src="${icon.cart}" alt="cart">
    <div class="user-container">
      <div class="user-img-container">
        <img src="${userImg ?? icon.defaultUserImg}" alt="user-img" class="user-img">
      </div>
      <img src="${icon.chevronDown}" alt="user options">
    </div>`
      : `
    <div class="user-container">
      <img src="${icon.union}" class="header-login-icon">
      <p>Log in</p>
    </div>`;
    navContainer.innerHTML = userActions;
  }

  togglePasswordDisplay(btn) {
    const input = btn.previousElementSibling;

    input.type = input.type === "password" ? "text" : "password";
  }
}

export default new LoginView();
