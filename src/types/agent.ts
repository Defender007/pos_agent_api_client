export type AgentStatus =
  | "active"
  | "suspended"
  | "pending"
  | "pending_approval"
  | "rejected"
  | "deactivated";

export type AgentKyc = {
  id?: string;
  agentId?: string;
  bvn: string;
  nin: string;
  imei: string;
  verificationStatus?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Agent = {
  id: string;
  agentCode: string;
  merchantId: string | null;
  billerId: string | null;
  billerName: string | null;
  firstName?: string;
  lastName?: string;
  fullName: string;
  phone: string;
  email?: string;
  businessName: string;
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
  status: AgentStatus;
  createdAt?: string;
  updatedAt?: string;
  kyc?: AgentKyc;
};
export type CreateAgentPayload = {
  agent_code: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  status?: AgentStatus;
  business_name: string;
  kyc: {
    bvn: string;
    nin: string;
    imei: string;
    notes?: string;
  };
  location: {
    address: string;
    latitude: number;
    longitude: number;
    capture_method: "browser_geolocation";
  };
  indemnity: {
    accepted: boolean;
    version: string;
  };
};

export type UpdateAgentPayload = Partial<{
  agent_code: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  business_name: string;
  status?: AgentStatus;
  kyc: Partial<{
    bvn: string;
    nin: string;
    imei: string;
    notes: string;
  }>;
}>;
