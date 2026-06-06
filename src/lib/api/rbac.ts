import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export type CurrentAdminProfile = {
  id: string;
  email: string;
  roles: string[];
  permissions: string[];
};

type CurrentAdminProfileResponse = {
  success: boolean;
  message: string;
  data: CurrentAdminProfile;
};

export async function getCurrentAdminProfile(): Promise<CurrentAdminProfile> {
  const cookieStore = await cookies();

  const token = cookieStore.get("access_token")?.value;

  const response = await fetch(`${API_BASE_URL}/rbac/staff/me`, {
    cache: "no-store",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log("RBAC STATUS:", response.status);

  const rawText = await response.text();

  console.log("RBAC RESPONSE:", rawText);

  if (response.status === 401) {
    throw new Error("SESSION_EXPIRED");
  }

  if (!response.ok) {
    throw new Error(rawText || "Failed to fetch admin profile");
  }

  const result: CurrentAdminProfileResponse = JSON.parse(rawText);

  return result.data;
}
