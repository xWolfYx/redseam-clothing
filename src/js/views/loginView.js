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
  _parent = document.querySelector(".login-form");
  addHandlerChangeForm(handler) {
    ["hashchange", "load"].forEach((ev) =>
      window.addEventListener(ev, handler),
    );
  }

  addHandlerSubmitForm(handler) {
    this._parent.addEventListener("submit", (e) => {
      e.preventDefault();
      const dataArr = new FormData(e.target);
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  renderForm() {
    document.querySelector(".main-container").classList.add("pre-login");
    if (location.hash === "#login")
      this._parent.innerHTML = `
          <img src="src/img/login-img.webp" class="login-img">
          <h1>Log in</h1>
          <div class="input-fields">
            <input type="text" placeholder="Email or username" name="email" autocomplete="on">
            <input type="password" placeholder="Password" name="password" required>
          </div>
          <div class="action-fields">
            <input type="submit" value="Log in">
            <p>Not a member? <a href="#register">Register</a></p>
          </div>`;
    else if (location.hash == "#register")
      this._parent.innerHTML = `
          <img src="src/img/login-img.webp" class="login-img">
          <h1>Registration</h1>
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
  }

  setNavContainerContent(isLoggedIn) {
    const navContainer = document.querySelector(".nav-container");
    navContainer.innerHTML = !isLoggedIn
      ? `<img src="${icon.union}" class="header-login-icon">
         <p>Log in</p>`
      : "";
  }
}

export default new LoginView();
