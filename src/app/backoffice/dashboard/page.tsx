import Link from "next/link";
import { redirect } from "next/navigation";

import Sidebar from "@/components/layout/sidebar";
import TopHeader from "@/components/layout/top-header";
import {
  getApprovedAgents,
  getPendingApprovalAgents,
  getRejectedAgents,
} from "@/lib/api/bank-agents-server";
import {
  getBankadminPermissions,
  getBankadminRoles,
  getBankadminStaff,
} from "@/lib/api/bankadmin-rbac-server";
import { getOrganizations } from "@/lib/api/organizations-server";

type SummaryCardProps = {
  title: string;
  value: number;
  href: string;
  tone: string;
};

function SummaryCard({ title, value, href, tone }: SummaryCardProps) {
  return (
    <Link
      href={href}
      className={`rounded-2xl border p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${tone}`}
    >
      <p className="text-sm font-medium opacity-80">{title}</p>
      <h2 className="mt-3 text-4xl font-black">{value}</h2>
    </Link>
  );
}

async function safeCount<T>(loader: () => Promise<T[]>): Promise<number> {
  try {
    const result = await loader();
    return result.length;
  } catch (error) {
    if (error instanceof Error && error.message === "SESSION_EXPIRED") {
      redirect("/backoffice/login?session=expired");
    }

    console.error("Backoffice dashboard summary failed:", error);
    return 0;
  }
}

export default async function BackofficeDashboardPage() {
  const [
    organizationsCount,
    pendingAgentsCount,
    approvedAgentsCount,
    rejectedAgentsCount,
    staffCount,
    rolesCount,
    permissionsCount,
  ] = await Promise.all([
    safeCount(getOrganizations),
    safeCount(getPendingApprovalAgents),
    safeCount(getApprovedAgents),
    safeCount(getRejectedAgents),
    safeCount(getBankadminStaff),
    safeCount(getBankadminRoles),
    safeCount(getBankadminPermissions),
  ]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1">
        <TopHeader />

        <div className="space-y-6 p-8">
          <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-slate-700 p-8 text-white shadow-xl">
            <p className="text-sm font-semibold text-amber-300">
              Bank Staff Backoffice
            </p>

            <h1 className="mt-3 text-4xl font-black">Backoffice Dashboard</h1>

            <p className="mt-3 max-w-2xl text-slate-300">
              Monitor organizations, agent approvals, and backoffice access
              administration.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              title="Organizations"
              value={organizationsCount}
              href="/organizations"
              tone="bg-white text-slate-900"
            />

            <SummaryCard
              title="Pending Approval Agents"
              value={pendingAgentsCount}
              href="/agents/approvals"
              tone="bg-amber-500 text-white"
            />

            <SummaryCard
              title="Approved Agents"
              value={approvedAgentsCount}
              href="/agents/approvals"
              tone="bg-emerald-600 text-white"
            />

            <SummaryCard
              title="Rejected Agents"
              value={rejectedAgentsCount}
              href="/agents/approvals"
              tone="bg-rose-600 text-white"
            />

            <SummaryCard
              title="Staff"
              value={staffCount}
              href="/staff"
              tone="bg-white text-slate-900"
            />

            <SummaryCard
              title="Roles"
              value={rolesCount}
              href="/roles"
              tone="bg-white text-slate-900"
            />

            <SummaryCard
              title="Permissions"
              value={permissionsCount}
              href="/permissions"
              tone="bg-white text-slate-900"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
