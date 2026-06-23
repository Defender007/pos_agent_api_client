import { cookies } from "next/headers";

import { getServerApiBaseUrl } from "@/lib/api/api-config";
import { parseApiError } from "@/lib/api/api-error";
import {
  normalizePaginatedData,
  type ListQuery,
  type PaginatedData,
  withListQuery,
} from "@/lib/api/pagination";
import type { BankAgent, BankAgentReviewPayload } from "@/types/bank-agent";

const API_BASE_URL = getServerApiBaseUrl();

async function getBankAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("bank_access_token")?.value;

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function getBankAgents(
  path: string,
  query: ListQuery = {},
): Promise<PaginatedData<BankAgent>> {
  const response = await fetch(withListQuery(`${API_BASE_URL}${path}`, query), {
    cache: "no-store",
    headers: await getBankAuthHeaders(),
  });

  if (!response.ok) {
    throw await parseApiError(response);
  }

  const result = await response.json();

  return normalizePaginatedData(result.data, query);
}

export function getPendingApprovalAgents(
  query?: ListQuery,
): Promise<PaginatedData<BankAgent>> {
  return getBankAgents("/agents/pending-approval", query);
}

export function getApprovedAgents(
  query?: ListQuery,
): Promise<PaginatedData<BankAgent>> {
  return getBankAgents("/agents/approved", query);
}

export function getRejectedAgents(
  query?: ListQuery,
): Promise<PaginatedData<BankAgent>> {
  return getBankAgents("/agents/rejected", query);
}

export function getBankAdminAgents(
  query?: ListQuery,
): Promise<PaginatedData<BankAgent>> {
  return getBankAgents("/bankadmin/agents", query);
}

export async function getBankAgentById(agentId: string): Promise<BankAgent> {
  const response = await fetch(`${API_BASE_URL}/bankadmin/agents/${agentId}`, {
    cache: "no-store",
    headers: await getBankAuthHeaders(),
  });

  if (!response.ok) {
    throw await parseApiError(response);
  }

  const result = await response.json();

  return result.data;
}

export async function bankReviewAgent(
  agentId: string,
  payload: BankAgentReviewPayload,
) {
  const response = await fetch(`${API_BASE_URL}/agents/${agentId}/bank-review`, {
    method: "PATCH",
    cache: "no-store",
    headers: await getBankAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw await parseApiError(response);
  }

  const result = await response.json();

  return result.data;
}
