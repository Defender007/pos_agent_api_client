import { cookies } from "next/headers";

import { getServerApiBaseUrl } from "@/lib/api/api-config";
import { parseApiError } from "@/lib/api/api-error";
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

async function getBankAgents(path: string): Promise<BankAgent[]> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
    headers: await getBankAuthHeaders(),
  });

  if (!response.ok) {
    throw await parseApiError(response);
  }

  const result = await response.json();

  return result.data;
}

export function getPendingApprovalAgents(): Promise<BankAgent[]> {
  return getBankAgents("/agents/pending-approval");
}

export function getApprovedAgents(): Promise<BankAgent[]> {
  return getBankAgents("/agents/approved");
}

export function getRejectedAgents(): Promise<BankAgent[]> {
  return getBankAgents("/agents/rejected");
}

export function getBankAdminAgents(): Promise<BankAgent[]> {
  return getBankAgents("/bankadmin/agents");
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
