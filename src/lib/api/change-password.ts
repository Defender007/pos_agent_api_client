import { parseApiError } from "@/lib/api/api-error";
import { getClientApiBaseUrl } from "@/lib/api/api-config";

export type ChangePasswordPayload = {
  current_password: string;
  new_password: string;
  confirm_password: string;
};

function getCookie(name: string) {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
}

async function changePassword(
  path: string,
  cookieName: "access_token" | "bank_access_token",
  payload: ChangePasswordPayload,
) {
  const token = getCookie(cookieName);

  const response = await fetch(`${getClientApiBaseUrl()}${path}`, {
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

  return response.json();
}

export function changeMerchantPassword(payload: ChangePasswordPayload) {
  return changePassword("/auth/staff/change-password", "access_token", payload);
}

export function changeBankPassword(payload: ChangePasswordPayload) {
  return changePassword(
    "/auth/bankadmin/change-password",
    "bank_access_token",
    payload,
  );
}
