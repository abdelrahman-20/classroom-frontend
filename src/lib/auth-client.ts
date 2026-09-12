import { createAuthClient } from "better-auth/react";
import { BASE_URL } from "@/constants";

export const authClient = createAuthClient({
  baseURL: `${BASE_URL}/auth`,
  fetchOptions: {
    credentials: "include",
  },
});

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "teacher" | "student";
  image?: string;
};
