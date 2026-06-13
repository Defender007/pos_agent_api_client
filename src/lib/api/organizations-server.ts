import { cookies } from "next/headers";

import { parseApiError } from "@/lib/api/api-error";
import type { Organization } from "@/lib/api/organizations";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function getBankAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("bank_access_token")?.value;

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getOrganizations(): Promise<Organization[]> {
  const response = await fetch(`${API_BASE_URL}/organizations`, {
    cache: "no-store",
    headers: await getBankAuthHeaders(),
  });

  if (!response.ok) {
    throw await parseApiError(response);
  }

  const result = await response.json();

  return result.data;
}

export async function getOrganization(organizationId: string): Promise<any> {
  const response = await fetch(
    `${API_BASE_URL}/organizations/${organizationId}`,
    {
      cache: "no-store",
      headers: await getBankAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw await parseApiError(response);
  }

  const result = await response.json();

  return result.data;
}

export async function getOrganizationStaff(organizationId: string) {
  const response = await fetch(
    `${API_BASE_URL}/organizations/${organizationId}/staff`,
    {
      cache: "no-store",
      headers: await getBankAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw await parseApiError(response);
  }

  const result = await response.json();

  return result.data;
}
export async function getOrganizationStaffMember(
  organizationId: string,
  staffId: string,
) {
  const response = await fetch(
    `${API_BASE_URL}/organizations/${organizationId}/staff/${staffId}`,
    {
      cache: "no-store",
      headers: await getBankAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw await parseApiError(response);
  }

  const result = await response.json();

  return result.data;
}
