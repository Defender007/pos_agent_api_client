import { cookies } from "next/headers";

import { parseApiError } from "@/lib/api/api-error";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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

export async function getBankadminStaff(): Promise<BankadminStaff[]> {
  const response = await fetch(`${API_BASE_URL}/bankadmin/staff`, {
    cache: "no-store",
    headers: await getBankAuthHeaders(),
  });

  if (!response.ok) {
    throw await parseApiError(response);
  }

  const result = await response.json();

  return result.data;
}

export async function getBankadminRoles(): Promise<BankadminRole[]> {
  const response = await fetch(`${API_BASE_URL}/bankadmin/roles`, {
    cache: "no-store",
    headers: await getBankAuthHeaders(),
  });

  if (!response.ok) {
    throw await parseApiError(response);
  }

  const result = await response.json();

  return result.data;
}

export async function getBankadminPermissions(): Promise<
  BankadminPermission[]
> {
  const response = await fetch(`${API_BASE_URL}/bankadmin/permissions`, {
    cache: "no-store",
    headers: await getBankAuthHeaders(),
  });

  if (!response.ok) {
    throw await parseApiError(response);
  }

  const result = await response.json();

  return result.data;
}
