import { parseApiError } from "@/lib/api/api-error";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function getBankTokenFromBrowser() {
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("bank_access_token="));

  return cookie ? decodeURIComponent(cookie.split("=")[1]) : undefined;
}

type CreateRolePayload = {
  name: string;
  description?: string | null;
};

type CreatePermissionPayload = {
  name: string;
  description?: string | null;
};

export async function createBankadminRole(payload: CreateRolePayload) {
  const token = getBankTokenFromBrowser();

  const response = await fetch(`${API_BASE_URL}/bankadmin/roles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw await parseApiError(response);
  }

  const result = await response.json();

  return result.data;
}

export async function createBankadminPermission(
  payload: CreatePermissionPayload,
) {
  const token = getBankTokenFromBrowser();

  const response = await fetch(`${API_BASE_URL}/bankadmin/permissions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw await parseApiError(response);
  }

  const result = await response.json();

  return result.data;
}
