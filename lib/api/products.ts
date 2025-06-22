"use server";

import { cookies } from "next/headers";
import { API_BASE_URL } from "../axios";

interface GetProductsOptions {
  page?: number;
  search?: string;
  category?: string;
  tags?: string;
  ordering?: string;
  in_stock?: string;
}

export const getProducts = async (options: GetProductsOptions = {}) => {
  const {
    page = 1,
    search = "",
    category = "",
    tags = "",
    ordering = "",
    in_stock = "",
  } = options;

  const queryParams = new URLSearchParams({
    ...(page && { page: page.toString() }),
    ...(search && { search }),
    ...(category && { category }),
    ...(tags && { tags__name: tags }),
    ...(ordering && { ordering }),
    ...(in_stock && { in_stock }),
  });

  try {
    const res = await fetch(
      `${API_BASE_URL}/products/?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      count: 0,
      next: null,
      previous: null,
      results: [],
    };
  }
};

export const getProductById = async (id: number) => {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${id}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch product");
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};

export const getCategories = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/products/categories/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch categories");
    }

    const result = await res.json();
    return result.results || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
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

    const response = await res.json();
    console.log({ response });

    return response;
  } catch (error) {
    console.error("Error submitting review:", error);
    throw error;
  }
};
