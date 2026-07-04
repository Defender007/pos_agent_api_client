"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  fetchBillers,
  type BillerOption,
  type FetchBillersOptions,
} from "@/lib/api/billers";

type BillerSelectProps = {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  authContext?: FetchBillersOptions["authContext"];
};

const PAGE_SIZE = 100;

function billerLabel(biller: BillerOption) {
  return `${biller.biller_name} — ${biller.biller_id}`;
}

export default function BillerSelect({
  value,
  onValueChange,
  disabled = false,
  required = false,
  error,
  authContext = "bank",
}: BillerSelectProps) {
  const [billers, setBillers] = useState<BillerOption[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const selectedBiller = useMemo(
    () => billers.find((biller) => biller.biller_id === value),
    [billers, value],
  );

  async function loadBillers(nextPage = 1, append = false) {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    setLoadError(null);

    try {
      const result = await fetchBillers({
        page: nextPage,
        pageSize: PAGE_SIZE,
        authContext,
      });

      setBillers((current) => {
        const combined = append ? [...current, ...result.items] : result.items;
        const unique = new Map(
          combined.map((biller) => [biller.biller_id, biller]),
        );

        return Array.from(unique.values());
      });
      setPage(result.page);
      setHasMore(result.hasNext);
    } catch (error) {
      setLoadError(
        error instanceof Error
          ? error.message
          : "Unable to load billers. Please try again.",
      );
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadBillers(1);
    }, 0);

    return () => window.clearTimeout(timeoutId);
    // The auth context is stable for each mounted form.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authContext]);

  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        Biller{required ? "" : " (Optional)"}
      </label>

      <Select
        value={value}
        onValueChange={onValueChange}
        disabled={disabled || loading || Boolean(loadError)}
      >
        <SelectTrigger
          className={`h-12 w-full rounded-xl border-slate-300 bg-white px-4 ${
            error ? "border-red-300" : ""
          }`}
        >
          <SelectValue
            placeholder={
              loading
                ? "Loading billers..."
                : selectedBiller
                  ? billerLabel(selectedBiller)
                  : "Select biller"
            }
          />
        </SelectTrigger>
        <SelectContent className="max-h-80 min-w-[var(--radix-select-trigger-width)]">
          {billers.length === 0 && !loading ? (
            <div className="px-3 py-2 text-sm text-slate-500">
              No billers returned.
            </div>
          ) : null}

          {billers.map((biller) => (
            <SelectItem key={biller.biller_id} value={biller.biller_id}>
              {billerLabel(biller)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {loadError ? (
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <p className="text-sm font-medium text-red-600">
            Unable to load billers. Please try again.
          </p>
          <button
            type="button"
            onClick={() => loadBillers(1)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Retry
          </button>
        </div>
      ) : null}

      {!loadError && hasMore ? (
        <button
          type="button"
          onClick={() => loadBillers(page + 1, true)}
          disabled={loadingMore}
          className="mt-2 rounded-lg border border-[#BFDCCB] px-3 py-2 text-sm font-semibold text-[#005C2E] hover:bg-[#E6F4EC] disabled:opacity-50"
        >
          {loadingMore ? "Loading..." : "Load more billers"}
        </button>
      ) : null}

      {error ? (
        <p className="mt-2 text-sm font-medium text-red-600">{error}</p>
      ) : null}
    </div>
  );
}
