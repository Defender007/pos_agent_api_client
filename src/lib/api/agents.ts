import { Agent } from "@/types/agent";
import { cookies } from "next/headers";
import { CreateAgentPayload } from "@/types/agent";
import { getServerApiBaseUrl } from "@/lib/api/api-config";
import {
  mapPaginatedItems,
  normalizePaginatedData,
  type ListQuery,
  type PaginatedData,
  withListQuery,
} from "@/lib/api/pagination";

const API_BASE_URL = getServerApiBaseUrl();

type AgentListApiItem = {
  id: string;
  agent_code: string;
  merchant_id: string | null;
  biller_id: string | null;
  biller_name: string | null;
  first_name: string;
  last_name: string;
  phone: string;
  business_name: string;
  status: Agent["status"];
};

type AgentApiResponse = {
  success: boolean;
  message: string;
  data: AgentListApiItem[] | PaginatedData<AgentListApiItem>;
};

type SingleAgentApiResponse = {
  success: boolean;
  message: string;
  data: {
    id: string;
    agent_code: string;
    merchant_id: string | null;
    biller_id: string | null;
    biller_name: string | null;
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    business_name: string;
    tid?: string | null;
    address?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    location?: {
      address?: string | null;
      latitude?: number | null;
      longitude?: number | null;
      capture_method?: string | null;
    };
    status: Agent["status"];
    created_at: string;
    updated_at: string;
    kyc?: {
      id: string;
      agent_id: string;
      bvn: string;
      nin: string;
      imei: string;
      verification_status: string;
      notes?: string;
      created_at: string;
      updated_at: string;
    };
  };
};

function mapAgentListItem(agent: AgentListApiItem): Agent {
  return {
    id: agent.id,
    agentCode: agent.agent_code,
    merchantId: agent.merchant_id,
    billerId: agent.biller_id,
    billerName: agent.biller_name,
    fullName: `${agent.first_name} ${agent.last_name}`,
    phone: agent.phone,
    businessName: agent.business_name,
    status: agent.status,
  };
}

export async function getAgents(
  query: ListQuery = {},
): Promise<PaginatedData<Agent>> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const response = await fetch(withListQuery(`${API_BASE_URL}/agents`, query), {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.status === 401) {
    throw new Error("SESSION_EXPIRED");
  }

  if (!response.ok) {
    throw new Error("Failed to fetch agents");
  }

  const result: AgentApiResponse = await response.json();
  const paginated = normalizePaginatedData(result.data, query);

  return mapPaginatedItems(paginated, mapAgentListItem);
}

export async function getAgentById(agentId: string): Promise<Agent> {
  const cookieStore = await cookies();

  const token = cookieStore.get("access_token")?.value;

  const response = await fetch(
    `${API_BASE_URL}/agents/${agentId}`,

    {
      cache: "no-store",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (response.status === 401) {
    throw new Error("SESSION_EXPIRED");
  }

  if (!response.ok) {
    throw new Error("Failed to fetch agents");
  }

  const result: SingleAgentApiResponse = await response.json();

  return {
    id: result.data.id,
    agentCode: result.data.agent_code,
    merchantId: result.data.merchant_id,
    billerId: result.data.biller_id,
    billerName: result.data.biller_name,
    firstName: result.data.first_name,
    lastName: result.data.last_name,
    fullName: `${result.data.first_name} ${result.data.last_name}`,
    phone: result.data.phone,
    email: result.data.email,
    businessName: result.data.business_name,
    tid: result.data.tid,
    address: result.data.address ?? result.data.location?.address,
    latitude: result.data.latitude ?? result.data.location?.latitude,
    longitude: result.data.longitude ?? result.data.location?.longitude,
    location: result.data.location,
    status: result.data.status,
    createdAt: result.data.created_at,
    updatedAt: result.data.updated_at,

    kyc: result.data.kyc
      ? {
          id: result.data.kyc.id,
          agentId: result.data.kyc.agent_id,
          bvn: result.data.kyc.bvn,
          nin: result.data.kyc.nin,
          imei: result.data.kyc.imei,
          verificationStatus: result.data.kyc.verification_status,
          notes: result.data.kyc.notes,
          createdAt: result.data.kyc.created_at,
          updatedAt: result.data.kyc.updated_at,
        }
      : undefined,
  };
}

export async function createAgent(payload: CreateAgentPayload) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  const response = await fetch(`${API_BASE_URL}/agents`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (response.status === 401) {
    throw new Error("SESSION_EXPIRED");
  }

  if (!response.ok) {
    throw new Error("Failed to fetch agents");
  }

  return response.json();
}
