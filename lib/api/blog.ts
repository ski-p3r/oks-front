"use server";

import { API_BASE_URL } from "../axios";

interface GetBlogsOptions {
  tags?: string;
  authorId?: number;
  published?: boolean;
  search?: string;
  ordering?: string;
  page?: number;
}

export const getBlogs = async (options: GetBlogsOptions = {}) => {
  const {
    tags = "",
    authorId = "",
    published = "",
    search = "",
    ordering = "",
    page = "",
  } = options;

  const queryParams = new URLSearchParams({
    ...(tags && { tags__name: tags }),
    ...(authorId && { author__id: authorId.toString() }),
    ...(published !== undefined && { published: published.toString() }),
    ...(search && { search: search }),
    ...(ordering && { ordering: ordering }),
    ...(page && { page: page.toString() }),
  });
  const url = `${API_BASE_URL}/blogs/?${queryParams.toString()}`;
  console.log(url);

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch blogs");
  }

  const result = await res.json();

  return result;
};

export const getBlogBySlug = async (slug: string) => {
  const res = await fetch(`${API_BASE_URL}/blogs/${slug}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch blog");
  }

  const result = await res.json();

  return result;
};
