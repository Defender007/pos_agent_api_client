import { getClientApiBaseUrl } from "@/lib/api/api-config";
import { parseApiError } from "@/lib/api/api-error";

export type BillerOption = {
  biller_id: string;
  biller_name: string;
  biller_short_name: string | null;
  country_code: string | null;
};

export type FetchBillersOptions = {
  page?: number;
  size?: number;
  authContext?: "bank" | "merchant";
};

export type BillersPage = {
  items: BillerOption[];
  page: number;
  size: number;
};

function getCookie(name: string) {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
}

export async function fetchBillers({
  page = 0,
  size = 100,
  authContext = "bank",
}: FetchBillersOptions = {}): Promise<BillersPage> {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  });
  const token = getCookie(
    authContext === "bank" ? "bank_access_token" : "access_token",
  );

  const response = await fetch(`${getClientApiBaseUrl()}/billers?${params}`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw await parseApiError(response);
  }

  const result = await response.json();

  return {
    items: result.data?.items || [],
    page: Number(result.data?.page ?? page),
    size: Number(result.data?.size ?? size),
  };
}

