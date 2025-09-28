import { API_URL } from "./config.js";
import { setCartKey } from "./views/helpers.js";

export const state = {
  userInfo: {},
  isLoggedIn: checkToken(),
  currentPage: 1,
  lastPage: 1,
  filter: {
    from: "",
    to: "",
  },
  sort: "",
  cart: {},
};

function checkToken() {
  const token = localStorage.getItem("redberryAuthentication");
  if (token) {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      const { userInfo, userImg } = JSON.parse(storedUser);
      state.userInfo = userInfo;
      state.userImg = userImg || "";
    }
  }
  return !!token;
}

/*
Checks if a user is logged in by looking for a token in localStorage.
Sends login details to /login to get a token, or registration details to /register.
Fetches the product list from /products for logged-in users.
Stores the token in localStorage after login/registration, so the site remembers the user.
 */

export async function login(data) {
  // Check user credentials
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  // Failure;
  if (!res.ok) {
    let errorMsg = "Unexpected Error";
    if (res.status === 401) errorMsg = "Wrong credentials!";
    if (res.status === 422) errorMsg = "Please fill out all data";

    throw new Error(errorMsg);
  }

  // Success
  const userInfo = await res.json();

  localStorage.setItem("redberryAuthentication", userInfo.token);
  state.userInfo.userImg = userInfo.user.avatar;

  localStorage.setItem("userImg", JSON.stringify(state.userInfo.userImg));

  return res;
}

export async function register(formData) {
  // Check user credentials
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },

    body: formData,
  });

  // Failure
  if (!res.ok) {
    let errorMsg = "Unexpected Error";
    if (res.status === 401) errorMsg = "Wrong credentials!";
    if (res.status === 422) errorMsg = "Please fill out all data";

    throw new Error(errorMsg);
  }

  // Success
  const userInfo = await res.json();

  localStorage.setItem("redberryAuthentication", userInfo.token);
  state.userInfo.userImg = userInfo.user.avatar;

  localStorage.setItem("userImg", JSON.stringify(state.userInfo.userImg));

  return res;
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
    const res = await fetch(`${API_URL}/products/${id}`, {
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

export async function addToCart(id, itemData) {
  try {
    if (!state.isLoggedIn) return;

    const token = localStorage.getItem("redberryAuthentication");

    const res = await fetch(`${API_URL}/cart/products/${id}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(itemData),
    });

    if (!res.ok) throw new Error("Couldn't add item to the cart");
    if (res.status === 201) console.log("Item successfully added to the cart");

    const response = await res.json();

    const key = setCartKey(id, itemData.color, itemData.size);
    if (state.cart[key]) {
      state.cart[key].quantity += itemData.quantity;
    } else {
      state.cart[key] = { ...itemData };
    }
    return response;
  } catch (err) {
    console.log(err);
  }
}

export async function removeFromCart(id, color, size) {
  try {
    if (!state.isLoggedIn) return;

    const token = localStorage.getItem("redberryAuthentication");

    const res = await fetch(`${API_URL}/cart/products/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ color, size }),
    });

    if (!res.ok) throw new Error("Couldn't remove item from the cart");
    if (res.status === 200)
      console.log("Item successfully deleted from the cart");
  } catch (err) {
    console.log(err.message);
  }
}

export async function getCartContent() {
  try {
    const token = localStorage.getItem("redberryAuthentication");

    const res = await fetch(`${API_URL}/cart`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Couldn't get cart items");
    if (res.status === 200) console.log("Cart items successfully fetched");

    const response = await res.json();

    return response;
  } catch (err) {
    console.log(err);
  }
}

export async function changeItemCount(id, quantity, color, size) {
  try {
    if (!state.isLoggedIn) return;

    const token = localStorage.getItem("redberryAuthentication");

    const res = await fetch(`${API_URL}/cart/products/${id}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity, color, size }),
    });

    if (!res.ok) throw new Error("Couldn't update cart items");

    const response = await res.json();

    return response;
  } catch (err) {
    console.log(err);
  }
}

export async function initCheckout(data) {
  try {
    if (!state.isLoggedIn) return;

    const token = localStorage.getItem("redberryAuthentication");

    const res = await fetch(`${API_URL}/cart/checkout`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Couldn't initialize purchase");

    const response = await res.json();

    return response;
  } catch (err) {
    console.log(err);
  }
}
