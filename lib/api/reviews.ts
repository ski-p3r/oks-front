"use server";

import { cookies } from "next/headers";
import { API_BASE_URL } from "../axios";

interface ReviewData {
  product: number;
  rating: number;
  comment: string;
}

export const submitReview = async (data: ReviewData) => {
  const cookie = await cookies();
  const accessToken = cookie.get("oks_access")?.value;
  if (!accessToken) {
    throw new Error("Access token not found");
  }
  try {
    const res = await fetch(`${API_BASE_URL}/products/reviews/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    const response = await res.json();
    return response;
  } catch (error) {
    console.error("Error submitting review:", error);
    throw error;
  }
};

export const getReviewsByProductId = async (productId: number) => {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${productId}/reviews/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch reviews");
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
};
