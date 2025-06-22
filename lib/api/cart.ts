"use server";

import { cookies } from "next/headers";
import { API_BASE_URL } from "../axios";

export const getCartItems = async () => {
  const cookie = await cookies();
  const accessToken = cookie.get("oks_access")?.value;
  if (!accessToken) {
    throw new Error("Access token not found");
  }
  try {
    const res = await fetch(`${API_BASE_URL}/products/cart-items/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch cart items");
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    throw error;
  }
};

export const getCartCount = async () => {
  const cookie = await cookies();
  const accessToken = cookie.get("oks_access")?.value;
  if (!accessToken) {
    throw new Error("Access token not found");
  }
  try {
    const res = await fetch(`${API_BASE_URL}/products/cart-items/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch cart items");
    }

    const result = await res.json();
    return result.results.length || 0;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    throw error;
  }
};

export const updateCartItemQuantity = async (
  itemId: number,
  quantity: number
) => {
  const cookie = await cookies();
  const accessToken = cookie.get("oks_access")?.value;
  if (!accessToken) {
    throw new Error("Access token not found");
  }
  try {
    const res = await fetch(`${API_BASE_URL}/products/cart-items/${itemId}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ quantity }),
    });

    if (!res.ok) {
      throw new Error("Failed to update cart item");
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error updating cart item:", error);
    throw error;
  }
};

export const removeCartItem = async (itemId: number) => {
  const cookie = await cookies();
  const accessToken = cookie.get("oks_access")?.value;
  if (!accessToken) {
    throw new Error("Access token not found");
  }
  try {
    const res = await fetch(`${API_BASE_URL}/products/cart-items/${itemId}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to remove cart item");
    }

    return true;
  } catch (error) {
    console.error("Error removing cart item:", error);
    throw error;
  }
};

export const addToCart = async (data: {
  product: number;
  quantity: number;
}) => {
  const cookie = await cookies();
  const accessToken = cookie.get("oks_access")?.value;
  if (!accessToken) {
    throw new Error("Access token not found");
  }
  try {
    const res = await fetch(`${API_BASE_URL}/products/cart-items/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Failed to add item to cart");
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error adding item to cart:", error);
    throw error;
  }
};
