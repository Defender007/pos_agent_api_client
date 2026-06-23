"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { PaginatedData } from "@/lib/api/pagination";

type Option = {
  label: string;
  value: string;
};

const PAGE_SIZES = ["10", "20", "50", "100"];

function useQueryUpdater() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return useMemo(
    () => ({
      get: (key: string) => searchParams.get(key),
      set: (
        updates: Record<string, string | number | null | undefined>,
        resetPageParam?: string,
      ) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(updates).forEach(([key, value]) => {
          if (value === null || value === undefined || value === "") {
            params.delete(key);
          } else {
            params.set(key, String(value));
          }
        });

        if (resetPageParam) {
          params.set(resetPageParam, "1");
        }

        const query = params.toString();
        router.push(query ? `${pathname}?${query}` : pathname);
      },
    }),
    [pathname, router, searchParams],
  );
}

export function SearchInput({
  placeholder = "Search",
  paramName = "search",
  pageParam = "page",
}: {
  placeholder?: string;
  paramName?: string;
  pageParam?: string;
}) {
  const query = useQueryUpdater();
  const [value, setValue] = useState(query.get(paramName) || "");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if ((query.get(paramName) || "") !== value.trim()) {
        query.set({ [paramName]: value.trim() || null }, pageParam);
      }
    }, 400);

    return () => window.clearTimeout(timer);
  }, [pageParam, paramName, query, value]);

  return (
    <div className="flex min-w-0 flex-1 rounded-xl border border-slate-300 bg-white">
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 rounded-l-xl px-4 py-3 text-sm outline-none"
      />

      {value ? (
        <button
          type="button"
          onClick={() => setValue("")}
          className="px-3 text-sm font-semibold text-slate-500 hover:text-[#005C2E]"
        >
          Clear
        </button>
      ) : null}
    </div>
  );
}

export function FilterSelect({
  label,
  paramName,
  options,
  pageParam = "page",
}: {
  label: string;
  paramName: string;
  options: Option[];
  pageParam?: string;
}) {
  const query = useQueryUpdater();

  return (
    <label className="grid gap-1 text-xs font-semibold text-slate-500">
      {label}
      <select
        value={query.get(paramName) || ""}
        onChange={(event) =>
          query.set({ [paramName]: event.target.value || null }, pageParam)
        }
        className="min-w-40 rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-medium text-slate-700"
      >
        {options.map((option) => (
          <option key={option.value || "all"} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function SortControls({
  options,
  sortByParam = "sort_by",
  sortOrderParam = "sort_order",
  pageParam = "page",
}: {
  options: Option[];
  sortByParam?: string;
  sortOrderParam?: string;
  pageParam?: string;
}) {
  const query = useQueryUpdater();
  const sortOrder = query.get(sortOrderParam) === "asc" ? "asc" : "desc";

  return (
    <div className="flex flex-wrap gap-3">
      <label className="grid gap-1 text-xs font-semibold text-slate-500">
        Sort by
        <select
          value={query.get(sortByParam) || options[0]?.value || "created_at"}
          onChange={(event) =>
            query.set({ [sortByParam]: event.target.value }, pageParam)
          }
          className="min-w-40 rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-medium text-slate-700"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <button
        type="button"
        onClick={() =>
          query.set(
            { [sortOrderParam]: sortOrder === "asc" ? "desc" : "asc" },
            pageParam,
          )
        }
        className="self-end rounded-xl border border-[#BFDCCB] px-4 py-3 text-sm font-semibold text-[#005C2E] hover:bg-[#E6F4EC]"
      >
        {sortOrder === "asc" ? "Ascending" : "Descending"}
      </button>
    </div>
  );
}

export function PageSizeSelect({
  paramName = "page_size",
  pageParam = "page",
}: {
  paramName?: string;
  pageParam?: string;
}) {
  const query = useQueryUpdater();

  return (
    <label className="grid gap-1 text-xs font-semibold text-slate-500">
      Page size
      <select
        value={query.get(paramName) || "20"}
        onChange={(event) =>
          query.set({ [paramName]: event.target.value }, pageParam)
        }
        className="rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-medium text-slate-700"
      >
        {PAGE_SIZES.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ClearFiltersButton({
  params,
  pageParam = "page",
}: {
  params: string[];
  pageParam?: string;
}) {
  const query = useQueryUpdater();

  return (
    <button
      type="button"
      onClick={() =>
        query.set(
          Object.fromEntries(params.map((param) => [param, null])),
          pageParam,
        )
      }
      className="self-end rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
    >
      Clear Filters
    </button>
  );
}

export function PaginationControls<T>({
  data,
  pageParam = "page",
}: {
  data: PaginatedData<T>;
  pageParam?: string;
}) {
  const query = useQueryUpdater();
  const { pagination } = data;
  const total = pagination.total_items;
  const start = total === 0 ? 0 : (pagination.page - 1) * pagination.page_size + 1;
  const end = Math.min(pagination.page * pagination.page_size, total);

  return (
    <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
      <div>
        Showing {start}-{end} of {total}
        <span className="ml-3 font-semibold text-slate-900">
          Page {pagination.page} of {Math.max(pagination.total_pages, 1)}
        </span>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          disabled={!pagination.has_previous}
          onClick={() =>
            query.set({ [pageParam]: Math.max(pagination.page - 1, 1) })
          }
          className="rounded-xl border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>

        <button
          type="button"
          disabled={!pagination.has_next}
          onClick={() => query.set({ [pageParam]: pagination.page + 1 })}
          className="rounded-xl border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed px-6 py-10 text-center">
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
}
