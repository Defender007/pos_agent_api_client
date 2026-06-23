import { DEFAULT_PAGE_SIZE, type ListQuery } from "@/lib/api/pagination";

export type PageSearchParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function numberValue(value: string | string[] | undefined, fallback: number) {
  const parsed = Number(firstValue(value));

  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function getListQuery(
  searchParams: PageSearchParams,
  options: {
    prefix?: string;
    defaultSortBy?: string;
    defaultSortOrder?: "asc" | "desc";
    allowedFilters?: string[];
  } = {},
): ListQuery {
  const prefix = options.prefix || "";
  const key = (name: string) => `${prefix}${name}`;
  const query: ListQuery = {
    page: numberValue(searchParams[key("page")], 1),
    page_size: numberValue(searchParams[key("page_size")], DEFAULT_PAGE_SIZE),
    sort_by:
      firstValue(searchParams[key("sort_by")]) ||
      options.defaultSortBy ||
      "created_at",
    sort_order:
      firstValue(searchParams[key("sort_order")]) === "asc" ? "asc" : "desc",
  };

  const search = firstValue(searchParams[key("search")])?.trim();
  if (search) query.search = search;

  options.allowedFilters?.forEach((filter) => {
    const value = firstValue(searchParams[key(filter)]);
    if (value !== undefined && value !== "") {
      query[filter] = value;
    }
  });

  return query;
}

