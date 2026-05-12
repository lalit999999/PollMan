import apiClient from "./apiClient";

/**
 * User Service
 * Fetch current user's profile from server
 */

export async function getProfile() {
  // Returns user object on success
  const res = await apiClient.get<{ success: boolean; data: any }>(
    "/user/profile",
  );

  return res?.data || null;
}

export default { getProfile };

export async function unlinkProvider(provider: "google" | "github") {
  const res = await apiClient.post("/user/unlink", { provider });
  return res?.data || null;
}
