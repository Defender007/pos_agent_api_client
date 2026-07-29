"use client";

import { Check, ChevronDown, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Input } from "@/components/ui/input";
import {
  fetchBillers,
  type BillerOption,
  type FetchBillersOptions,
} from "@/lib/api/billers";
import { ApiError } from "@/lib/api/api-error";

type BillerSelectProps = {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  authContext?: FetchBillersOptions["authContext"];
};

const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 300;

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
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const requestSequenceRef = useRef(0);
  const [billers, setBillers] = useState<BillerOption[]>([]);
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedOption, setSelectedOption] = useState<BillerOption | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const selectedBiller = useMemo(
    () =>
      selectedOption?.biller_id === value
        ? selectedOption
        : billers.find((biller) => biller.biller_id === value),
    [billers, selectedOption, value],
  );

  const loadBillers = useCallback(
    async (nextPage = 1, append = false, searchTerm = debouncedSearch) => {
      const requestSequence = ++requestSequenceRef.current;

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
          search: searchTerm,
          authContext,
        });

        if (requestSequence !== requestSequenceRef.current) {
          return;
        }

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
        if (error instanceof ApiError && error.message === "SESSION_EXPIRED") {
          router.push(
            authContext === "bank"
              ? "/backoffice/login?session=expired"
              : "/login?session=expired",
          );
          return;
        }

        if (requestSequence !== requestSequenceRef.current) {
          return;
        }

        setLoadError(
          error instanceof Error
            ? error.message
            : "Unable to load billers. Please try again.",
        );
      } finally {
        if (requestSequence === requestSequenceRef.current) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [authContext, debouncedSearch, router],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => setDebouncedSearch(search.trim()),
      SEARCH_DEBOUNCE_MS,
    );

    return () => window.clearTimeout(timeoutId);
  }, [search]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadBillers(1, false, debouncedSearch);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [debouncedSearch, loadBillers]);

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  function selectBiller(biller: BillerOption) {
    setSelectedOption(biller);
    onValueChange(biller.biller_id);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        Biller{required ? "" : " (Optional)"}
      </label>

      <button
        type="button"
        role="combobox"
        aria-controls="biller-options"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-invalid={Boolean(error)}
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setOpen(false);
          }
        }}
        className={`flex h-12 w-full items-center justify-between gap-3 rounded-xl border bg-white px-4 text-left text-sm outline-none transition focus:border-[#007A3D] focus:ring-2 focus:ring-[#007A3D]/20 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-60 ${
          error ? "border-red-300" : "border-slate-300"
        }`}
      >
        <span
          className={`min-w-0 truncate ${
            selectedBiller ? "text-slate-900" : "text-slate-500"
          }`}
        >
          {selectedBiller ? billerLabel(selectedBiller) : "Select biller"}
        </span>
        <ChevronDown
          className={`size-4 shrink-0 text-slate-500 transition ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
          <div className="border-b border-slate-200 p-3">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <Input
                value={search}
                onChange={(event) => {
                  requestSequenceRef.current += 1;
                  setSearch(event.target.value);
                }}
                placeholder="Search by biller name or ID"
                aria-label="Search billers"
                autoFocus
                className="h-10 border-slate-300 bg-white pl-9"
              />
            </div>
          </div>

          <div
            id="biller-options"
            role="listbox"
            aria-label="Billers"
            className="max-h-72 overflow-y-auto p-1.5"
          >
            {loading ? (
              <div className="px-3 py-8 text-center text-sm text-slate-500">
                Loading billers...
              </div>
            ) : null}

            {!loading && loadError ? (
              <div className="px-3 py-6 text-center">
                <p className="text-sm font-medium text-red-600">
                  Unable to load billers. Please try again.
                </p>
                <button
                  type="button"
                  onClick={() => loadBillers(1, false, debouncedSearch)}
                  className="mt-3 h-9 rounded-lg border border-slate-300 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Retry
                </button>
              </div>
            ) : null}

            {!loading && !loadError && billers.length === 0 ? (
              <div className="px-3 py-8 text-center text-sm text-slate-500">
                No billers found.
              </div>
            ) : null}

            {!loading && !loadError
              ? billers.map((biller) => {
                  const selected = biller.biller_id === value;

                  return (
                    <button
                      key={biller.biller_id}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() => selectBiller(biller)}
                      className={`flex w-full items-start justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                        selected
                          ? "bg-[#E6F4EC] text-[#005C2E]"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span className="min-w-0">
                        <span className="block font-medium">
                          {biller.biller_name}
                        </span>
                        <span className="mt-0.5 block text-xs text-slate-500">
                          {biller.biller_id}
                        </span>
                      </span>
                      {selected ? (
                        <Check
                          className="mt-0.5 size-4 shrink-0"
                          aria-hidden="true"
                        />
                      ) : null}
                    </button>
                  );
                })
              : null}

            {!loading && !loadError && hasMore ? (
              <div className="border-t border-slate-200 p-2">
                <button
                  type="button"
                  onClick={() =>
                    loadBillers(page + 1, true, debouncedSearch)
                  }
                  disabled={loadingMore}
                  className="h-9 w-full rounded-lg border border-[#BFDCCB] px-3 text-sm font-semibold text-[#005C2E] hover:bg-[#E6F4EC] disabled:opacity-50"
                >
                  {loadingMore ? "Loading..." : "Load more billers"}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {error ? (
        <p className="mt-2 text-sm font-medium text-red-600">{error}</p>
      ) : null}
    </div>
  );
}
