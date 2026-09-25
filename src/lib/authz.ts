import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { Role } from "@prisma/client";

export class AuthorizationError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "AuthorizationError";
  }
}

/**
 * Server-side session + role check. Every admin mutation (server action) must call this
 * first: Server Actions are reachable by direct POST regardless of which page rendered the
 * form or whether the UI hides the control, so the admin layout's session redirect is not
 * sufficient authorization on its own.
 */
export async function requireRole(...roles: Role[]) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: Role } | undefined)?.role;
  if (!session || !role || !roles.includes(role)) {
    throw new AuthorizationError();
  }
  return session;
}

export async function requireAdmin() {
  return requireRole("ADMIN");
}
