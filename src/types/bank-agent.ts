export type BankAgentReviewDecision = "approved" | "rejected";

export type BankAgentReviewPayload = {
  decision: BankAgentReviewDecision;
  notes?: string | null;
};

export type BankAgentOrganization = {
  id?: string | null;
  name?: string | null;
  code?: string | null;
};

export type BankAgent = {
  id: string;
  agent_code: string;
  first_name: string;
  last_name: string;
  phone: string;
  email?: string | null;
  business_name: string;
  tid?: string | null;
  status: string;
  organization_id?: string | null;
  organization_name?: string | null;
  organization?: BankAgentOrganization | string | null;
  created_at?: string;
  updated_at?: string;
};
