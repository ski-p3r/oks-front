"use server";

import { cookies } from "next/headers";
import { API_BASE_URL } from "../axios";

// Update profile
export const getProfile = async (data: {
  first_name: string;
  last_name: string;
  city: string;
  avatar_url?: string;
}) => {
  const cookie = await cookies();
  const accessToken = cookie.get("oks_access")?.value;
  if (!accessToken) throw new Error("Access token not found");

  try {
    const res = await fetch(`${API_BASE_URL}/auth/profile/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to update profile");
    const main = await res.json();
    cookie.set("oks_user", JSON.stringify(main));
    return main;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

export const updateProfile = async (data: {
  first_name: string;
  last_name: string;
  city: string;
  avatar_url?: string;
}) => {
  const cookie = await cookies();
  const accessToken = cookie.get("oks_access")?.value;
  if (!accessToken) throw new Error("Access token not found");

  try {
    const res = await fetch(`${API_BASE_URL}/auth/profile/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to update profile");
    const user = await fetch(`${API_BASE_URL}/auth/profile/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!user.ok) throw new Error("Failed to fetch user profile");
    const main = await user.json();
    cookie.set("oks_user", JSON.stringify(main));
    return await res.json();
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

// Change password
export const changePassword = async (data: {
  old_password: string;
  new_password: string;
  confirm_password: string;
}) => {
  const cookie = await cookies();
  const accessToken = cookie.get("oks_access")?.value;
  if (!accessToken) throw new Error("Access token not found");

  try {
    const res = await fetch(`${API_BASE_URL}/auth/change-password/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || "Failed to change password");
    }

    return await res.json();
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};
