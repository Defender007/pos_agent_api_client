import { parseApiError } from "@/lib/api/api-error";
import {
  normalizePaginatedData,
  type ListQuery,
  type PaginatedData,
  withListQuery,
} from "@/lib/api/pagination";
import type {
  BankAgent,
  BankAgentReviewPayload,
  BankAgentStatusPayload,
} from "@/types/bank-agent";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function getCookie(name: string) {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
}

async function getBankAgents(
  path: string,
  query: ListQuery = {},
): Promise<PaginatedData<BankAgent>> {
  const token = getCookie("bank_access_token");

  const response = await fetch(withListQuery(`${API_BASE_URL}${path}`, query), {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
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

export async function bankReviewAgent(
  agentId: string,
  payload: BankAgentReviewPayload,
) {
  const token = getCookie("bank_access_token");

  const response = await fetch(`${API_BASE_URL}/agents/${agentId}/bank-review`, {
    method: "PATCH",
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

export async function bankUpdateAgentStatus(
  agentId: string,
  payload: BankAgentStatusPayload,
) {
  const token = getCookie("bank_access_token");

  const response = await fetch(
    `${API_BASE_URL}/bankadmin/agents/${agentId}/status`,
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
