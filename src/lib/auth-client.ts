import { createAuthClient } from "better-auth/react";
import { API_BASE_URL } from "@/constants";

export const authClient = createAuthClient({
  baseURL: `${API_BASE_URL}/auth`,
  fetchOptions: {
    credentials: "include",
  },
});

let pendingSessionRequest: Promise<Awaited<ReturnType<typeof authClient.getSession>>> | null =
  null;

export const getCurrentSession = async () => {
  if (!pendingSessionRequest) {
    pendingSessionRequest = authClient.getSession().finally(() => {
      pendingSessionRequest = null;
    });
  }

  return pendingSessionRequest;
};

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "teacher" | "student";
  image?: string;
};
