import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const getExcerpt = (content: string, maxLength = 150) => {
  const plainText = content.replace(/\n/g, " ");
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength) + "...";
};
