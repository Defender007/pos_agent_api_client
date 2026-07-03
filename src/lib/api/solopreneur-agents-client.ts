import { parseApiError } from "@/lib/api/api-error";
import { getClientApiBaseUrl } from "@/lib/api/api-config";
import type { BusinessSegment } from "@/lib/business-segments";

export type CreateSolopreneurAgentPayload = {
  first_name: string;
  middle_name: string | null;
  last_name: string;
  phone: string;
  email: string;
  business_name: string;
  biller_id: string;
  registration_number: string | null;
  business_segment: BusinessSegment;
  business_segment_other: string | null;
  kyc: {
    bvn: string;
    nin: string;
    imei: string;
    notes: string;
  };
  location: {
    address: string;
    latitude: number;
    longitude: number;
    capture_method: "browser_geolocation";
  };
};

export type SolopreneurAgentResponse = {
  id: string;
  agent_code: string;
  merchant_id: string | null;
  biller_id: string | null;
  biller_name: string | null;
  tid?: string | null;
};

function getBankTokenFromBrowser() {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("bank_access_token="))
    ?.split("=")[1];
}

export async function createSolopreneurAgent(
  payload: CreateSolopreneurAgentPayload,
): Promise<{
  success: boolean;
  message: string;
  data: SolopreneurAgentResponse;
}> {
  const token = getBankTokenFromBrowser();

  const response = await fetch(
    `${getClientApiBaseUrl()}/bankadmin/agents/solopreneur`,
    {
      method: "POST",
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

  return response.json();
}
