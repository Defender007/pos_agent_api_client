import { cookies } from "next/headers";

import { getServerApiBaseUrl } from "@/lib/api/api-config";
import { parseApiError } from "@/lib/api/api-error";
import {
  normalizePaginatedData,
  type ListQuery,
  type PaginatedData,
  withListQuery,
} from "@/lib/api/pagination";

const API_BASE_URL = getServerApiBaseUrl();

async function getBankAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("bank_access_token")?.value;

  return {
    Authorization: `Bearer ${token}`,
  };
}

export type BankadminStaffProfile = {
  first_name?: string | null;
  last_name?: string | null;
  middle_name?: string | null;
  designation?: string | null;
  organisation?: string | null;
  staff_id?: string | null;
  phone?: string | null;
};

export type BankadminStaff = {
  id: string;
  email: string;
  role?: string | null;
  roles?: string[];
  organization_id?: string | null;
  status: string;
  must_change_password?: boolean;
  permissions?: string[];
  profile?: BankadminStaffProfile | null;
};

export type BankadminRole = {
  id: string;
  name: string;
  description?: string | null;
  permissions?: string[];
};

export type BankadminPermission = {
  id: string;
  name: string;
  description?: string | null;
};

export async function getBankadminStaff(
  query: ListQuery = {},
): Promise<PaginatedData<BankadminStaff>> {
  const response = await fetch(
    withListQuery(`${API_BASE_URL}/bankadmin/staff`, query),
    {
      cache: "no-store",
      headers: await getBankAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw await parseApiError(response);
  }

  const result = await response.json();

  return normalizePaginatedData(result.data, query);
}

export async function getBankadminRoles(
  query: ListQuery = {},
): Promise<PaginatedData<BankadminRole>> {
  const response = await fetch(
    withListQuery(`${API_BASE_URL}/bankadmin/roles`, query),
    {
      cache: "no-store",
      headers: await getBankAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw await parseApiError(response);
  }

  const result = await response.json();

  return normalizePaginatedData(result.data, query);
}

export async function getBankadminPermissions(
  query: ListQuery = {},
): Promise<PaginatedData<BankadminPermission>> {
  const response = await fetch(
    withListQuery(`${API_BASE_URL}/bankadmin/permissions`, query),
    {
      cache: "no-store",
      headers: await getBankAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw await parseApiError(response);
  }

  const result = await response.json();

  return normalizePaginatedData(result.data, query);
}
