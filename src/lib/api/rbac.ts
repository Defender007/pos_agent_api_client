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

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export type AdminUser = {
  id: string;
  email: string;
  roles: string[];
  permissions: string[];

  profile?: {
    first_name: string;
    last_name: string;
    middle_name?: string;
    designation?: string;
    organisation?: string;
    staff_id?: string;
    phone?: string;
  };
};

export type Role = {
  id: string;
  name: string;
  description: string;
  permissions: string[];
};

export type Permission = {
  id: string;
  name: string;
  description: string;
};

export type CurrentAdminProfile = AdminUser;

export async function getCurrentAdminProfile(): Promise<CurrentAdminProfile> {
  const response = await fetch(`${API_BASE_URL}/rbac/staff/me`, {
    cache: "no-store",
    headers: await getAuthHeaders(),
  });

  if (response.status === 401) {
    throw new Error("SESSION_EXPIRED");
  }

  if (!response.ok) {
    throw await parseApiError(response);
  }

  const result = await response.json();
  return result.data;
}

export async function getStaffUsers(
  query: ListQuery = {},
): Promise<PaginatedData<AdminUser>> {
  const response = await fetch(withListQuery(`${API_BASE_URL}/rbac/staff`, query), {
    cache: "no-store",
    headers: await getAuthHeaders(),
  });

  if (!response.ok) {
    throw await parseApiError(response);
  }

  const result = await response.json();
  return normalizePaginatedData(result.data, query);
}

export async function createRole(payload: {
  name: string;
  description: string;
}): Promise<Role> {
  const response = await fetch(`${API_BASE_URL}/rbac/roles`, {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw await parseApiError(response);
  }

  const result = await response.json();
  return result.data;
}

export async function getRoles(
  query: ListQuery = {},
): Promise<PaginatedData<Role>> {
  const response = await fetch(withListQuery(`${API_BASE_URL}/rbac/roles`, query), {
    cache: "no-store",
    headers: await getAuthHeaders(),
  });

  if (!response.ok) {
    throw await parseApiError(response);
  }

  const result = await response.json();
  return normalizePaginatedData(result.data, query);
}

export async function getPermissions(
  query: ListQuery = {},
): Promise<PaginatedData<Permission>> {
  const response = await fetch(
    withListQuery(`${API_BASE_URL}/rbac/permissions`, query),
    {
    cache: "no-store",
    headers: await getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw await parseApiError(response);
  }

  const result = await response.json();
  return normalizePaginatedData(result.data, query);
}

export async function createPermission(payload: {
  name: string;
  description: string;
}): Promise<Permission> {
  const response = await fetch(`${API_BASE_URL}/rbac/permissions`, {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw await parseApiError(response);
  }

  const result = await response.json();
  return result.data;
}

export async function getStaffUser(staffId: string): Promise<AdminUser> {
  const response = await fetch(`${API_BASE_URL}/rbac/staff/${staffId}`, {
    cache: "no-store",
    headers: await getAuthHeaders(),
  });

  if (!response.ok) {
    throw await parseApiError(response);
  }

  const result = await response.json();

  return result.data;
}
