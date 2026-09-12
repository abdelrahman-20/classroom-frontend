import type { AccessControlProvider } from "@refinedev/core";
import { authClient } from "@/lib/auth-client";
import { UserRole } from "@/types";

type Role = UserRole | string | null;

const adminOnly = (role: Role) => role === UserRole.ADMIN;
const notStudent = (role: Role) => role !== UserRole.STUDENT;

export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action, params }) => {
    const { data: session } = await authClient.getSession();
    const role = (session?.user as { role?: Role } | undefined)?.role ?? null;

    if (!role) return { can: false, reason: "Unauthorized" };

    const rules: Record<string, Record<string, (r: Role) => boolean>> = {
      dashboard: {
        list: () => true,
        show: () => true,
      },
      users: {
        list: adminOnly,
        create: adminOnly,
        edit: (r) => adminOnly(r) || params?.id === params?.userId,
        show: (r) => adminOnly(r) || params?.id === params?.userId,
        delete: adminOnly,
      },
      departments: {
        list: () => true,
        create: adminOnly,
        edit: adminOnly,
        show: () => true,
        delete: adminOnly,
      },
      subjects: {
        list: () => true,
        create: adminOnly,
        edit: notStudent,
        show: () => true,
        delete: adminOnly,
      },
      classes: {
        list: () => true,
        create: notStudent,
        edit: notStudent,
        show: () => true,
        delete: notStudent,
      },
    };

    const resourceRules = rules[resource ?? ""];
    if (!resourceRules) return { can: true };

    const check = resourceRules[action ?? ""];
    if (!check) return { can: true };

    return check(role) ? { can: true } : { can: false, reason: "Forbidden" };
  },

  options: {
    buttons: {
      enableAccessControl: true,
      hideIfUnauthorized: true,
    },
  },
};
