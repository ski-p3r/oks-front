"use server";

import { cookies } from "next/headers";
import { API_BASE_URL } from "../axios";

interface GetStoriesOptions {
  tags?: string;
  role?: string;
  search?: string;
  ordering?: string;
  page?: number;
}

export const getStories = async (options: GetStoriesOptions = {}) => {
  const {
    tags = "",
    role = "",
    search = "",
    ordering = "-created_at",
    page = 1,
  } = options;

  const queryParams = new URLSearchParams({
    ...(tags && { tags__name: tags }),
    ...(role && { user__role: role }),
    ...(search && { search: search }),
    ...(ordering && { ordering: ordering }),
    ...(page && { page: page.toString() }),
  });

  try {
    const res = await fetch(
      `${API_BASE_URL}/stories/?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch stories");
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error fetching stories:", error);
    return {
      count: 0,
      next: null,
      previous: null,
      results: [],
    };
  }
};

export const getStoryTags = async (search = "", page = 1) => {
  const queryParams = new URLSearchParams({
    ...(search && { search }),
    page: page.toString(),
  });

  try {
    const res = await fetch(
      `${API_BASE_URL}/stories/tags/?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch story tags");
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error fetching story tags:", error);
    return {
      count: 0,
      next: null,
      previous: null,
      results: [],
    };
  }
};

export const createStory = async (data: {
  title: string;
  body: string;
  image_url?: string | undefined;
  tags: string[];
}) => {
  const cookie = await cookies();
  const accessToken = cookie.get("oks_access")?.value;
  if (!accessToken) {
    throw new Error("Access token not found");
  }
  try {
    const res = await fetch(`${API_BASE_URL}/stories/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Failed to create story");
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error creating story:", error);
    throw error;
  }
};

export const getStoryById = async (id: number) => {
  try {
    const res = await fetch(`${API_BASE_URL}/stories/${id}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch story");
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error fetching story:", error);
    return null;
  }
};

export const likeStory = async (id: number) => {
  try {
    const res = await fetch(`${API_BASE_URL}/stories/${id}/like/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to like story");
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error liking story:", error);
    throw error;
  }
};
