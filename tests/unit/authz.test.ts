import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

import { getServerSession } from "next-auth";
import { requireRole, requireAdmin, AuthorizationError } from "@/lib/authz";

const mockedGetServerSession = getServerSession as unknown as ReturnType<typeof vi.fn>;

describe("requireRole / requireAdmin", () => {
  beforeEach(() => {
    mockedGetServerSession.mockReset();
  });

  it("throws AuthorizationError when there is no session", async () => {
    mockedGetServerSession.mockResolvedValue(null);
    await expect(requireRole("ADMIN", "EDITOR")).rejects.toBeInstanceOf(AuthorizationError);
  });

  it("throws AuthorizationError when the session has no role", async () => {
    mockedGetServerSession.mockResolvedValue({ user: {} });
    await expect(requireRole("ADMIN", "EDITOR")).rejects.toBeInstanceOf(AuthorizationError);
  });

  it("throws AuthorizationError when the role is not in the allowed list", async () => {
    mockedGetServerSession.mockResolvedValue({ user: { role: "EDITOR" } });
    await expect(requireAdmin()).rejects.toBeInstanceOf(AuthorizationError);
  });

  it("resolves the session when the role is allowed", async () => {
    const session = { user: { role: "ADMIN" } };
    mockedGetServerSession.mockResolvedValue(session);
    await expect(requireRole("ADMIN", "EDITOR")).resolves.toEqual(session);
  });

  it("resolves for EDITOR when EDITOR is in the allowed list", async () => {
    const session = { user: { role: "EDITOR" } };
    mockedGetServerSession.mockResolvedValue(session);
    await expect(requireRole("ADMIN", "EDITOR")).resolves.toEqual(session);
  });
});
