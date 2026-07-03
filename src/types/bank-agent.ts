export type BankAgentReviewDecision = "approved" | "rejected";

export type BankAgentReviewPayload = {
  decision: BankAgentReviewDecision;
  notes?: string | null;
};

export type BankAgentStatusValue =
  | "active"
  | "pending_approval"
  | "suspended"
  | "rejected"
  | "deactivated";

export type BankAgentStatusPayload = {
  status: BankAgentStatusValue;
  notes?: string | null;
};

export type BankAgentOrganization = {
  id?: string | null;
  name?: string | null;
  code?: string | null;
};

export type BankAgentKyc = {
  id?: string | null;
  agent_id?: string | null;
  bvn?: string | null;
  nin?: string | null;
  imei?: string | null;
  verification_status?: string | null;
  notes?: string | null;
};

export type BankAgentLocation = {
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  capture_method?: string | null;
};

export type BankAgent = {
  id: string;
  agent_code: string;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  phone: string;
  email?: string | null;
  business_name: string;
  merchant_id: string | null;
  biller_id: string | null;
  biller_name: string | null;
  registration_number?: string | null;
  business_segment?: string | null;
  business_segment_other?: string | null;
  agent_type?: "standard" | "solopreneur" | null;
  tid?: string | null;
  status: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  location?: BankAgentLocation | null;
  kyc?: BankAgentKyc | null;
  notes?: string | null;
  organization_id?: string | null;
  organization_name?: string | null;
  organization?: BankAgentOrganization | string | null;
  created_at?: string;
  updated_at?: string;
};
