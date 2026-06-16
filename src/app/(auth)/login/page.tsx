"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginStaff } from "@/lib/api/auth";

import PageContainer from "@/components/layout/page-container";
import PageTitle from "@/components/layout/page-title";
import SectionCard from "@/components/ui/custom/section-card";

export default function LoginPage() {
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

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      <div className="flex min-h-[calc(100vh-3rem)] items-center justify-center">
        <div className="w-full max-w-md">
          <PageContainer>
            <PageTitle
              title="SoftPOS Login"
              description="Access the agent management portal"
            />

            <SectionCard>
              {sessionMessage && (
                <div className="mb-6 rounded-lg border border-[#F9C80E]/40 bg-[#FFF7D6] p-4 text-sm text-[#7A5A00]">
                  {sessionMessage}
                </div>
              )}

              <form
                className="space-y-6"
                onSubmit={async (e) => {
                  e.preventDefault();

                  try {
                    setLoading(true);

                    const response = await loginStaff({
                      email,
                      password,
                    });

                    document.cookie = `access_token=${encodeURIComponent(
                      response.data.access_token,
                    )}; path=/; max-age=86400; SameSite=Lax`;
                    document.cookie =
                      "bank_access_token=; path=/; max-age=0; SameSite=Lax";

                    router.push("/dashboard");
                  } catch (error) {
                    alert("Login failed");
                    console.error(error);
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Email
                  </label>

                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full rounded-lg border px-4 py-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Password
                  </label>

                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="w-full rounded-lg border px-4 py-2"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button className="w-full rounded-lg bg-[#007A3D] px-4 py-2 font-semibold text-white transition hover:bg-[#005C2E]">
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
                      href="/backoffice/login"
                      className="rounded-xl bg-[#005C2E] px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#007A3D]"
                    >
                      Bank Staff Login
                    </Link>
                  </div>
                </div>
              </form>
            </SectionCard>
          </PageContainer>
        </div>
      </div>
    </div>
  );
}
