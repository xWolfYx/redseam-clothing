import { API_URL } from "./config.js";

export const state = {
  isLoggedIn: checkToken(),
  page: 1,
};

function checkToken() {
  return localStorage.getItem("redberryAuthentication") ? true : false;
}

/*
Checks if a user is logged in by looking for a token in localStorage.
Sends login details to /login to get a token, or registration details to /register.
Fetches the product list from /products for logged-in users.
Stores the token in localStorage after login/registration, so the site remembers the user.
 */

export async function login(credentials) {
  try {
    // Check user credentials
    const { email, password } = credentials;
    const loginRequest = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    // Failure
    if (!loginRequest.ok) {
      throw new Error("Wrong credentials!");
    }
    // Success
    const userInfo = await loginRequest.json();

    localStorage.setItem("redberryAuthentication", userInfo.token);
  } catch (err) {
    console.log(err.message);
  }
}

export async function register(credentials) {
  try {
    // Check user credentials
    const { email, password, password_confirmation, username } = credentials;
    const loginRequest = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },

      body: JSON.stringify({
        email,
        password,
        password_confirmation,
        username,
      }),
    });

    // Failure
    if (!loginRequest.ok) {
      throw new Error("Wrong credentials!");
    }

    // Success
    const userInfo = await loginRequest.json();

    localStorage.setItem("redberryAuthentication", userInfo.token);
  } catch (err) {
    console.log(err.message);
  }
}

export async function fetchProducts() {
  const page = state.page;
  const res = await fetch(`${API_URL}/products?page=${page}'`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  const response = await res.json();
  return response;
}
