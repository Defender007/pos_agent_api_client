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
  pageSize?: number;
  search?: string;
  authContext?: "bank" | "merchant";
};

export type BillersPage = {
  items: BillerOption[];
  page: number;
  pageSize: number;
  hasNext: boolean;
};

function getCookie(name: string) {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
}

export async function fetchBillers({
  page = 1,
  pageSize = 100,
  search,
  authContext = "bank",
}: FetchBillersOptions = {}): Promise<BillersPage> {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });

  if (search?.trim()) {
    params.set("search", search.trim());
  }

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
  const data = result.data || {};
  const pagination = data.pagination || {};

  return {
    items: data.items || [],
    page: Number(pagination.page ?? page),
    pageSize: Number(pagination.page_size ?? pageSize),
    hasNext: Boolean(pagination.has_next),
  };
}
