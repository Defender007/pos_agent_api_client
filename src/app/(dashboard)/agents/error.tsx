"use client";

import Link from "next/link";
import { useEffect } from "react";

type DashboardErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  useEffect(() => {
    console.error("Dashboard route error:", error);
  }, [error]);

  const isSessionExpired = error.message === "SESSION_EXPIRED";
  const isApiUnavailable =
    error.message === "API_UNAVAILABLE" ||
    error.message === "fetch failed" ||
    error.name === "TypeError";

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-xl rounded-3xl border bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF7D6] text-2xl">
          ⚠️
        </div>

        <h1 className="mt-6 text-2xl font-black text-slate-900">
          {isSessionExpired
            ? "Session expired"
            : isApiUnavailable
              ? "Service temporarily unavailable"
              : "Something went wrong"}
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          {isSessionExpired
            ? "Your session has expired. Please sign in again."
            : isApiUnavailable
              ? "We could not reach the backend service right now. Please retry."
              : "This section could not be loaded. Please retry or return to the dashboard."}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={reset}
            className="rounded-xl bg-[#007A3D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#005C2E]"
          >
            Retry
          </button>

          {isSessionExpired ? (
            <>
              <Link
                href="/backoffice/login"
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Backoffice Login
              </Link>

              <Link
                href="/login"
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Merchant Login
              </Link>
            </>
          ) : (
            <Link
              href="/backoffice/dashboard"
              className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Backoffice Dashboard
            </Link>
          )}
        </div>

        {error.digest && (
          <p className="mt-6 text-xs text-slate-400">
            Error reference: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
