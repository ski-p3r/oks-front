"use server";

import { cookies } from "next/headers";
import { API_BASE_URL } from "../axios";

export const login = async (data: { email: string; password: string }) => {
  const res = await fetch(`${API_BASE_URL}/auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  const result = await res.json();
  const cookie = await cookies();
  cookie.set("oks_access", result.access);
  cookie.set("oks_refresh", result.access);
  cookie.set("oks_user", JSON.stringify(result.user));

  // Fetch the cart
  const cartRes = await fetch(`${API_BASE_URL}/products/cart/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${result.access}`,
    },
  });

  if (!cartRes.ok) {
    throw new Error("Failed to fetch cart");
  }

  const cartData = await cartRes.json();

  if (cartData.results && cartData.results.length > 0) {
    // Get the first cart ID and store it in the database
    const cartId = cartData.results[0].id;
    cookie.set("oks_cart", cartId.toString());
  } else {
    // Create a new cart
    const newCartRes = await fetch(`${API_BASE_URL}/products/cart/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${result.access}`,
      },
      body: JSON.stringify({}),
    });

    if (!newCartRes.ok) {
      throw new Error("Failed to create a new cart");
    }

    const newCart = await newCartRes.json();
    const cartId = newCart.id;
    cookie.set("oks_cart", cartId.toString());
  }

  return result;
};
