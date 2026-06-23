export type ListQuery = {
  page?: number;
  page_size?: number;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  [key: string]: string | number | boolean | undefined;
};

export type PaginatedData<T> = {
  items: T[];
  pagination: {
    page: number;
    page_size: number;
    total_items: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
  sort: {
    sort_by: string;
    sort_order: "asc" | "desc";
  };
  filters: Record<string, unknown>;
};

export const DEFAULT_PAGE_SIZE = 20;

export function buildListSearchParams(query: ListQuery = {}) {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === "") return;
    params.set(key, String(value));
  });

  return params;
}

export function withListQuery(url: string, query?: ListQuery) {
  const params = buildListSearchParams(query);
  const queryString = params.toString();

  return queryString ? `${url}?${queryString}` : url;
}

function fallbackPagination(itemCount: number, query: ListQuery = {}) {
  const page = Number(query.page) || 1;
  const pageSize = Number(query.page_size) || DEFAULT_PAGE_SIZE;

  return {
    page,
    page_size: pageSize,
    total_items: itemCount,
    total_pages: itemCount > 0 ? Math.ceil(itemCount / pageSize) : 0,
    has_next: itemCount > page * pageSize,
    has_previous: page > 1,
  };
}

export function normalizePaginatedData<T>(
  data: T[] | PaginatedData<T>,
  query: ListQuery = {},
): PaginatedData<T> {
  if (Array.isArray(data)) {
    return {
      items: data,
      pagination: fallbackPagination(data.length, query),
      sort: {
        sort_by: String(query.sort_by || "created_at"),
        sort_order: query.sort_order === "asc" ? "asc" : "desc",
      },
      filters: {},
    };
  }

  return data;
}

export function mapPaginatedItems<TInput, TOutput>(
  data: PaginatedData<TInput>,
  mapper: (item: TInput) => TOutput,
): PaginatedData<TOutput> {
  return {
    ...data,
    items: data.items.map(mapper),
  };
}

