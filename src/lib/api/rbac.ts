import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
    throw new Error("Failed to fetch admin profile");
  }

  const result = await response.json();
  return result.data;
}

export async function getStaffUsers(): Promise<AdminUser[]> {
  const response = await fetch(`${API_BASE_URL}/rbac/staff`, {
    cache: "no-store",
    headers: await getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch staff users");
  }

  const result = await response.json();
  return result.data;
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
    throw new Error("Failed to create role");
  }

  const result = await response.json();
  return result.data;
}

export async function getRoles(): Promise<Role[]> {
  const response = await fetch(`${API_BASE_URL}/rbac/roles`, {
    cache: "no-store",
    headers: await getAuthHeaders(),
  });

  if (!response.ok) {
    console.error("Failed to fetch roles:", await response.text());
    return [];
  }

  const result = await response.json();
  return result.data;
}

export async function getPermissions(): Promise<Permission[]> {
  const response = await fetch(`${API_BASE_URL}/rbac/permissions`, {
    cache: "no-store",
    headers: await getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch permissions");
  }

  const result = await response.json();
  return result.data;
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
    throw new Error("Failed to create permission");
  }

  const result = await response.json();
  return result.data;
}
