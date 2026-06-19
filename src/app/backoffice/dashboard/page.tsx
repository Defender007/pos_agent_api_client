import Link from "next/link";

import SectionErrorCard, {
  type SectionErrorCardProps,
} from "@/components/common/section-error-card";
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
import { getServerPageError } from "@/lib/api/server-page-error";
import { getOrganizations } from "@/lib/api/organizations-server";
export const dynamic = "force-dynamic";

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

export default async function BackofficeDashboardPage() {
  let organizationsCount = 0;
  let pendingAgentsCount = 0;
  let approvedAgentsCount = 0;
  let rejectedAgentsCount = 0;
  let staffCount = 0;
  let rolesCount = 0;
  let permissionsCount = 0;
  let loadError: SectionErrorCardProps | null = null;

  try {
    const [
      organizations,
      pendingAgents,
      approvedAgents,
      rejectedAgents,
      staff,
      roles,
      permissions,
    ] = await Promise.all([
      getOrganizations(),
      getPendingApprovalAgents(),
      getApprovedAgents(),
      getRejectedAgents(),
      getBankadminStaff(),
      getBankadminRoles(),
      getBankadminPermissions(),
    ]);

    organizationsCount = organizations.length;
    pendingAgentsCount = pendingAgents.length;
    approvedAgentsCount = approvedAgents.length;
    rejectedAgentsCount = rejectedAgents.length;
    staffCount = staff.length;
    rolesCount = roles.length;
    permissionsCount = permissions.length;
  } catch (error) {
    loadError = getServerPageError(error, {
      sessionExpiredRedirect: "/backoffice/login?session=expired",
    });
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1">
        <TopHeader />

        <div className="space-y-6 p-8">
          <div className="rounded-3xl bg-gradient-to-r from-[#005C2E] to-[#007A3D] p-8 text-white shadow-xl">
            <p className="text-sm font-semibold text-[#F9C80E]">
              Bank Staff Backoffice
            </p>

            <h1 className="mt-3 text-4xl font-black">Backoffice Dashboard</h1>

            <p className="mt-3 max-w-2xl text-green-50">
              Monitor organizations, agent approvals, and backoffice access
              administration.
            </p>
          </div>

          {loadError ? (
            <SectionErrorCard {...loadError} />
          ) : (
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
              href="/backoffice/agents/approvals"
              tone="bg-[#F9C80E] text-[#0F172A]"
            />

            <SummaryCard
              title="Approved Agents"
              value={approvedAgentsCount}
              href="/backoffice/agents/approvals"
              tone="bg-[#007A3D] text-white"
            />

            <SummaryCard
              title="Rejected Agents"
              value={rejectedAgentsCount}
              href="/backoffice/agents/approvals"
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
          )}
        </div>
      </main>
    </div>
  );
}
