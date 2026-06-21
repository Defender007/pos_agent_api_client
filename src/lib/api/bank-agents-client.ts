import { parseApiError } from "@/lib/api/api-error";
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

async function getBankAgents(path: string): Promise<BankAgent[]> {
  const token = getCookie("bank_access_token");

  const response = await fetch(`${API_BASE_URL}${path}`, {
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
