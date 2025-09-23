import { API_URL } from "./config.js";

export const state = {
  userInfo: {},
  // isLoggedIn: checkToken(),
  currentPage: 1,
  lastPage: 1,
  filter: {
    from: "",
    to: "",
  },
  sort: "",
};

// function checkToken() {
//   return localStorage.getItem("redberryAuthentication") ? true : false;
// }

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
  try {
    const { currentPage, sort } = state;
    const { from: filterFrom, to: filterTo } = state.filter;

    const res = await fetch(
      `${API_URL}/products?page=${currentPage}${filterFrom ? `&filter%5Bprice_from%5D=${filterFrom}` : ""}${filterTo ? `&filter%5Bprice_to%5D=${filterTo}` : ""}${sort ? `&sort=${sort}` : ""}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      },
    );

    const response = await res.json();
    const { last_page: lastPage } = response.meta;
    state.lastPage = lastPage;
    return response;
  } catch (err) {
    console.log(err.message);
  }
}

export async function fetchItem(id) {
  try {
    const res = await fetch(`${API_URL}/products/${id}}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    const response = await res.json();
    return response;
  } catch (err) {
    console.log(err.message);
  }
}
