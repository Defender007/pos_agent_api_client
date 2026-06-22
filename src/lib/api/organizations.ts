import { parseApiError } from "@/lib/api/api-error";
import type { BusinessSegment } from "@/lib/business-segments";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function getBankTokenFromBrowser() {
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("bank_access_token="));

  return cookie?.split("=")[1];
}

export type Organization = {
  id: string;
  name: string;
  code: string | null;
  registration_number: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  address: string | null;
  organization_type?: "standard" | "solopreneur_system" | null;
  is_system?: boolean;
  business_segment?: BusinessSegment | null;
  business_segment_other?: string | null;
  status: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export async function createOrganization(payload: {
  name: string;
  code?: string | null;
  registration_number?: string | null;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  organization_type?: "standard";
  business_segment: BusinessSegment;
  business_segment_other?: string | null;
  is_active: boolean;
}): Promise<Organization> {
  const token = getBankTokenFromBrowser();

  const response = await fetch(`${API_BASE_URL}/organizations`, {
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

export async function createOrganizationStaff(
  organizationId: string,
  payload: {
    email: string;
    password?: string;
    role: string;
    profile: {
      first_name: string;
      last_name: string;
      middle_name?: string;
      designation?: string;
      organisation?: string;
      staff_id?: string;
      phone?: string;
    };
  },
) {
  const token = getBankTokenFromBrowser();

  const response = await fetch(
    `${API_BASE_URL}/organizations/${organizationId}/staff`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw await parseApiError(response);
  }

  const result = await response.json();

  return result.data;
}

export async function updateOrganizationStaff(
  organizationId: string,
  staffId: string,
  payload: {
    email?: string;
    status?: string;
    password?: string;
    profile?: {
      first_name?: string;
      last_name?: string;
      middle_name?: string | null;
      designation?: string | null;
      staff_id?: string | null;
      phone?: string | null;
    };
  },
) {
  const token = getBankTokenFromBrowser();

  const response = await fetch(
    `${API_BASE_URL}/organizations/${organizationId}/staff/${staffId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw await parseApiError(response);
  }

  const result = await response.json();

  return result.data;
}
