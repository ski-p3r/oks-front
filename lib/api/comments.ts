"use server";

import { cookies } from "next/headers";
import { API_BASE_URL } from "../axios";

export interface CommentUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  city: string;
  avatar_url: string;
  created_at: string;
}

export interface CommentReply {
  id: number;
  blog: number;
  user: CommentUser;
  content: string;
  parent: number;
  created_at: string;
  updated_at?: string;
  replies: CommentReply[];
}

export interface Comment {
  id: number;
  blog: number;
  user: CommentUser;
  content: string;
  parent: number | null;
  created_at: string;
  updated_at?: string;
  replies: CommentReply[];
}

export interface CommentListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Comment[];
}

export const getCommentsByBlogId = async (blogId: number) => {
  try {
    const res = await fetch(`${API_BASE_URL}/blogs/comments/?blog=${blogId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch comments");
    }

    const result: CommentListResponse = await res.json();
    return result;
  } catch (error) {
    console.error("Error fetching comments:", error);
    return {
      count: 0,
      next: null,
      previous: null,
      results: [],
    };
  }
};

export const createComment = async (
  blogId: number,
  data: { content: string; parent?: number | null }
) => {
  const cookie = await cookies();
  const accessToken = cookie.get("oks_access")?.value;
  if (!accessToken) {
    throw new Error("Access token not found");
  }
  try {
    const res = await fetch(`${API_BASE_URL}/blogs/comments/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        blog: blogId,
        content: data.content,
        parent: data.parent || null,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to create comment");
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};

export const getCommentsByStoryId = async (storyId: number) => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/stories/comments/?story=${storyId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch comments");
    }

    const result: CommentListResponse = await res.json();
    return result;
  } catch (error) {
    console.error("Error fetching comments:", error);
    return {
      count: 0,
      next: null,
      previous: null,
      results: [],
    };
  }
};

export const createStoryComment = async (
  storyId: number,
  data: { content: string; parent?: number | null }
) => {
  const cookie = await cookies();
  const accessToken = cookie.get("oks_access")?.value;
  if (!accessToken) {
    throw new Error("Access token not found");
  }
  try {
    const res = await fetch(`${API_BASE_URL}/stories/comments/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        story: storyId,
        content: data.content,
        parent: data.parent || null,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to create comment");
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};
