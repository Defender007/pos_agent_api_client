import { cookies } from "next/headers";

import { getServerApiBaseUrl } from "@/lib/api/api-config";
import { parseApiError } from "@/lib/api/api-error";
import {
  normalizePaginatedData,
  type ListQuery,
  type PaginatedData,
  withListQuery,
} from "@/lib/api/pagination";
import type {
  MerchantIndemnitySummary,
  Organization,
} from "@/lib/api/organizations";

const API_BASE_URL = getServerApiBaseUrl();

export type OrganizationAgent = {
  id: string;
  agent_code: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  business_name: string;
  merchant_id: string | null;
  biller_id: string | null;
  biller_name: string | null;
  agent_type?: "standard" | "solopreneur" | null;
  tid?: string | null;
  organization_id: string;
  created_by_staff_id: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export type OrganizationDetail = Organization & {
  merchant_staff_count: number;
  agent_count: number;
  indemnity?: MerchantIndemnitySummary | null;
};

export type OrganizationStaffMember = {
  id: string;
  email: string;
  role?: string | null;
  status?: string | null;
  profile?: {
    first_name?: string | null;
    middle_name?: string | null;
    last_name?: string | null;
    phone?: string | null;
  } | null;
};

async function getBankAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("bank_access_token")?.value;

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getOrganizations(
  query: ListQuery = {},
): Promise<PaginatedData<Organization>> {
  const response = await fetch(
    withListQuery(`${API_BASE_URL}/organizations`, query),
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

export async function getOrganization(
  organizationId: string,
): Promise<OrganizationDetail> {
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

export async function getOrganizationStaff(
  organizationId: string,
  query: ListQuery = {},
): Promise<PaginatedData<OrganizationStaffMember>> {
  const response = await fetch(
    withListQuery(
      `${API_BASE_URL}/organizations/${organizationId}/staff`,
      query,
    ),
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

export async function getOrganizationAgents(
  organizationId: string,
  query: ListQuery = {},
): Promise<PaginatedData<OrganizationAgent>> {
  const response = await fetch(
    withListQuery(
      `${API_BASE_URL}/organizations/${organizationId}/agents`,
      query,
    ),
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
