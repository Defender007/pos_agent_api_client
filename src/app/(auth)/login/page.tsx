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

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md">
        <PageContainer>
          <PageTitle
            title="SoftPOS Login"
            description="Access the agent management portal"
          />

          <SectionCard>
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
