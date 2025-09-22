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

    let loginType;

    if (location.hash === "#login") loginType = "Log in";
    if (location.hash === "#register") loginType = "Registration";

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
      const html = `
          <h1>${loginType}</h1>
          <div class="input-fields">
            <input type="email" placeholder="Email" name="email" autocomplete="on">
            <input type="password" placeholder="Password" name="password" required>
          </div>
          <div class="action-fields">
            <input type="submit" value="Log in">
            <p>Not a member? <a href="#register">Register</a></p>
          </div>`;
      loginForm.innerHTML = html;
    }

    if (location.hash === "#register") {
      const html = `
          <h1>${loginType}</h1>
          <div class="input-fields">
            <input type="text" placeholder="Username" name="username" minlength="3" autocomplete="on">
            <input type="email" name="email" placeholder="Email" autocomplete="on">
            <input type="password" name="password" placeholder="Password" minlength="3" required>
            <input type="password" name="password_confirmation" placeholder="Confirm Password" required>
          </div>
          <div class="action-fields">
            <input type="submit" value="Log in">
            <p>Already member? <a href="#login">Log in</a></p>
          </div>`;
      loginForm.innerHTML = html;
    }
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
}

export default new LoginView();
