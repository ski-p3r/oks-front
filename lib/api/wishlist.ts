"use server";

import { cookies } from "next/headers";
import { API_BASE_URL } from "../axios";

// Get wishlist items
export const getWishlistItems = async () => {
  const cookie = await cookies();
  const accessToken = cookie.get("oks_access")?.value;
  if (!accessToken) throw new Error("Access token not found");

  try {
    const res = await fetch(`${API_BASE_URL}/products/wishlist/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch wishlist items");
    return await res.json();
  } catch (error) {
    console.error("Error fetching wishlist items:", error);
    throw error;
  }
};

export const getWishlistCount = async () => {
  const cookie = await cookies();
  const accessToken = cookie.get("oks_access")?.value;
  if (!accessToken) throw new Error("Access token not found");

  try {
    const res = await fetch(`${API_BASE_URL}/products/wishlist/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch wishlist items");
    const response = await res.json();
    return response.products.length || 0;
  } catch (error) {
    console.error("Error fetching wishlist items:", error);
    throw error;
  }
};

// Add item to wishlist
export const addToWishlist = async (productId: number) => {
  const cookie = await cookies();
  const accessToken = cookie.get("oks_access")?.value;
  if (!accessToken) throw new Error("Access token not found");

  try {
    const res = await fetch(`${API_BASE_URL}/products/wishlist/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ product: productId }),
    });

    if (!res.ok) throw new Error("Failed to add item to wishlist");
    return await res.json();
  } catch (error) {
    console.error("Error adding item to wishlist:", error);
    throw error;
  }
};

// Remove item from wishlist
export const removeFromWishlist = async (productId: number) => {
  const cookie = await cookies();
  const accessToken = cookie.get("oks_access")?.value;
  if (!accessToken) throw new Error("Access token not found");

  try {
    const res = await fetch(`${API_BASE_URL}/products/wishlist/remove/`, {
      method: "POST", // based on custom @action in the backend
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ product: productId }),
    });

    if (!res.ok) throw new Error("Failed to remove item from wishlist");
    return await res.json();
  } catch (error) {
    console.error("Error removing item from wishlist:", error);
    throw error;
  }
};
