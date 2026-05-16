export type AgentStatus = "active" | "suspended" | "pending";

export type Agent = {
  id: string;
  agentCode: string;
  fullName: string;
  phone: string;
  businessName: string;
  status: AgentStatus;
};
