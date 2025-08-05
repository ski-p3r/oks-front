"use server";

import { cookies } from "next/headers";

export const getUser = async () => {
  const cookie = await cookies();
  const user = cookie.get("oks_user")?.value;
  return user ? JSON.parse(user) : null;
};

export const clearUser = async () => {
  const cookie = await cookies();
  cookie.delete("oks_user");
  cookie.delete("oks_access");
  cookie.delete("oks_refresh");
};
