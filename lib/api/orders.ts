"use server";

import { cookies } from "next/headers";
import { API_BASE_URL } from "../axios";

interface OrderData {
  shipping_address: string;
  contact_number: string;
}

export const createOrder = async (data: OrderData) => {
  const cookie = await cookies();
  const accessToken = cookie.get("oks_access")?.value;
  if (!accessToken) {
    throw new Error("Access token not found");
  }

  try {
    const res = await fetch(`${API_BASE_URL}/products/orders/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });
    console.log({ res });

    if (!res.ok) {
      throw new Error("Failed to create order");
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const getOrders = async () => {
  const cookie = await cookies();
  const accessToken = cookie.get("oks_access")?.value;
  if (!accessToken) {
    throw new Error("Access token not found");
  }

  try {
    const res = await fetch(`${API_BASE_URL}/products/orders/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch orders");
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const getOrderById = async (id: number) => {
  const cookie = await cookies();
  const accessToken = cookie.get("oks_access")?.value;
  if (!accessToken) {
    throw new Error("Access token not found");
  }

  try {
    const res = await fetch(`${API_BASE_URL}/products/orders/${id}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch order");
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

export const getOrdersCount = async () => {
  const cookie = await cookies();
  const accessToken = cookie.get("oks_access")?.value;
  if (!accessToken) throw new Error("Access token not found");

  try {
    const res = await fetch(`${API_BASE_URL}/products/orders/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch orders");
    const data = await res.json();
    return data.count || 0;
  } catch (error) {
    console.error("Error fetching orders count:", error);
    return 0;
  }
};
