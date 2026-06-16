"use client";

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
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md">
        <PageContainer>
          <PageTitle
            title="SoftPOS Login"
            description="Access the agent management portal"
          />

          <SectionCard>
            {sessionMessage && (
              <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
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
                <label className="mb-2 block text-sm font-medium">Email</label>

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

              <button className="w-full rounded-lg bg-black px-4 py-2 text-white">
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </SectionCard>
        </PageContainer>
      </div>
    </div>
  );
}
