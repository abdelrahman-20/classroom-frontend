import type { AuthProvider } from "@refinedev/core";
import { authClient, SessionUser } from "@/lib/auth-client";

export const authProvider: AuthProvider = {
  login: async ({ email, password, providerName }) => {
    if (providerName) {
      if (providerName !== "google" && providerName !== "github") {
        return {
          success: false,
          error: {
            name: "LoginError",
            message: `Unsupported social provider: ${providerName}`,
          },
        };
      }

      const { error } = await authClient.signIn.social({
        provider: providerName,
        callbackURL: window.location.origin,
      });

      if (error) {
        return {
          success: false,
          error: {
            name: "LoginError",
            message: error.message ?? "Login failed",
          },
        };
      }

      return { success: true };
    }

    const { error } = await authClient.signIn.email({ email, password });

    if (error) {
      return {
        success: false,
        error: { name: "LoginError", message: error.message ?? "Login failed" },
      };
    }

    return { success: true, redirectTo: "/" };
  },

  register: async ({ name, email, password, providerName }) => {
    if (providerName) {
      if (providerName !== "google" && providerName !== "github") {
        return {
          success: false,
          error: {
            name: "RegistrationError",
            message: `Unsupported social provider: ${providerName}`,
          },
        };
      }

      const { error } = await authClient.signIn.social({
        provider: providerName,
        callbackURL: window.location.origin,
      });

      if (error) {
        return {
          success: false,
          error: {
            name: "RegistrationError",
            message: error.message ?? "Registration failed",
          },
        };
      }

      return { success: true };
    }

    const { error } = await authClient.signUp.email({
      name: String(name ?? "").trim(),
      email: String(email),
      password: String(password),
    });

    if (error) {
      return {
        success: false,
        error: {
          name: "RegistrationError",
          message: error.message ?? "Registration failed",
        },
      };
    }

    return { success: true, redirectTo: "/" };
  },

  logout: async () => {
    await authClient.signOut();
    return { success: true, redirectTo: "/login" };
  },

  check: async () => {
    const { data: session } = await authClient.getSession();

    if (session?.user) {
      return { authenticated: true };
    }

    return { authenticated: false, redirectTo: "/login", logout: true };
  },

  getPermissions: async () => {
    const { data: session } = await authClient.getSession();
    return (session?.user as SessionUser | undefined)?.role ?? null;
  },

  getIdentity: async () => {
    const { data: session } = await authClient.getSession();
    const user = session?.user as SessionUser | undefined;

    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.image,
      role: user.role,
    };
  },

  onError: async (error) => {
    const isSessionFailure =
      error?.statusCode === 401 ||
      (error?.statusCode === 403 &&
        /authentication|session|unauthorized/i.test(error.message ?? ""));

    if (isSessionFailure) {
      return { logout: true, redirectTo: "/login" };
    }
    return {};
  },
};
