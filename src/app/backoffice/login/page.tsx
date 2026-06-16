"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { loginBankStaff } from "@/lib/api/bank-auth";
import { Toaster } from "@/components/ui/sonner";

export default function BackofficeLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionMessage] = useState(() => {
    if (typeof window === "undefined") {
      return null;
    }

    return new URLSearchParams(window.location.search).get("session") ===
      "conflict"
      ? "Another session type was detected. Please sign in again."
      : null;
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await loginBankStaff({
        email,
        password,
      });

      document.cookie = `bank_access_token=${encodeURIComponent(
        response.data.access_token,
      )}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = "access_token=; path=/; max-age=0; SameSite=Lax";

      router.push("/backoffice/dashboard");
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Invalid credentials",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      <div className="flex min-h-[calc(100vh-3rem)] items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">
            Bank Staff Login
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Backoffice Administration Portal
          </p>

          {sessionMessage && (
            <div className="mt-6 rounded-xl border border-[#F9C80E]/40 bg-[#FFF7D6] p-4 text-sm text-[#7A5A00]">
              {sessionMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">Email</label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border px-4 py-3"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border px-4 py-3"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#007A3D] px-4 py-3 font-semibold text-white transition hover:bg-[#005C2E]"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

            <div className="border-t border-slate-200 pt-5">
              <p className="text-center text-sm text-slate-500">
                Need another access point?
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Link
                  href="/"
                  className="rounded-xl border border-[#BFDCCB] px-4 py-3 text-center text-sm font-semibold text-[#005C2E] transition hover:bg-[#E6F4EC]"
                >
                  Home
                </Link>

                <Link
                  href="/login"
                  className="rounded-xl bg-[#005C2E] px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#007A3D]"
                >
                  Merchant Staff Login
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Toaster richColors />
    </div>
  );
}
