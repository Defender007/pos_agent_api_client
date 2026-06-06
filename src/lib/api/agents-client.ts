import { CreateAgentPayload } from "@/types/agent";
import { UpdateAgentPayload } from "@/types/agent";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function getCookie(name: string) {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
}

export async function updateAgentClient(
  agentId: string,
  payload: UpdateAgentPayload,
) {
  const token = getCookie("access_token");

  const response = await fetch(`${API_BASE_URL}/agents/${agentId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to update agent");
  }

  return response.json();
}
export async function createAgentClient(payload: CreateAgentPayload) {
  const token = getCookie("access_token");

  const response = await fetch(`${API_BASE_URL}/agents`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to create agent");
  }

  return response.json();
}
