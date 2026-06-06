export type AgentStatus = "active" | "suspended" | "pending";

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
  firstName?: string;
  lastName?: string;
  fullName: string;
  phone: string;
  email?: string;
  businessName: string;
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
