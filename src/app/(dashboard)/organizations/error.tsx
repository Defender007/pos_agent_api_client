"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function OrganizationsError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const isSessionExpired = error.message === "SESSION_EXPIRED";

  return (
    <div className="rounded-2xl border bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-black text-slate-900">
        {isSessionExpired ? "Session expired" : "Unable to load organizations"}
      </h1>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        {isSessionExpired
          ? "Your backoffice session has expired. Please sign in again."
          : "We could not load this section right now. Please retry or contact support if the issue continues."}
      </p>

      <div className="mt-6 flex gap-3">
        {isSessionExpired ? (
          <Link
            href="/backoffice/login"
            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
          >
            Backoffice Login
          </Link>
        ) : (
          <button
            onClick={() => reset()}
            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
          >
            Retry
          </button>
        )}

        <Link
          href="/"
          className="rounded-xl border px-5 py-3 text-sm font-semibold text-slate-700"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
