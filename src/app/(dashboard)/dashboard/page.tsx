import { redirect } from "next/navigation";
import SectionErrorCard, {
  type SectionErrorCardProps,
} from "@/components/common/section-error-card";
import { getAgents } from "@/lib/api/agents";
import PageContainer from "@/components/layout/page-container";
import { getServerPageError } from "@/lib/api/server-page-error";
import { displayMerchantId } from "@/lib/merchant-id";
import { displayBillerId, displayBillerName } from "@/lib/biller-display";
import type { Agent } from "@/types/agent";

function StatCard({
  title,
  value,
  tone,
}: {
  title: string;
  value: number;
  tone: string;
}) {
  return (
    <div
      className={`rounded-2xl border p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${tone}`}
    >
      <p className="text-sm font-medium opacity-80">{title}</p>
      <h2 className="mt-3 text-4xl font-black">{value}</h2>
    </div>
  );
}

function agentStatusClass(status: Agent["status"]) {
  if (status === "active") {
    return "bg-[#E6F4EC] text-[#005C2E]";
  }

  if (status === "pending") {
    return "bg-[#FFF7D6] text-[#7A5A00]";
  }

  if (status === "suspended") {
    return "bg-red-100 text-red-700";
  }

  return "bg-slate-100 text-slate-700";
}

export default async function DashboardPage() {
  let agents: Agent[] = [];
  let totalAgents = 0;
  let activeAgents = 0;
  let pendingAgents = 0;
  let suspendedAgents = 0;
  let loadError: SectionErrorCardProps | null = null;

  try {
    const [recent, active, pending, suspended] = await Promise.all([
      getAgents({ page: 1, page_size: 5, sort_by: "created_at", sort_order: "desc" }),
      getAgents({ page: 1, page_size: 1, status: "active" }),
      getAgents({ page: 1, page_size: 1, status: "pending" }),
      getAgents({ page: 1, page_size: 1, status: "suspended" }),
    ]);

    agents = recent.items;
    totalAgents = recent.pagination.total_items;
    activeAgents = active.pagination.total_items;
    pendingAgents = pending.pagination.total_items;
    suspendedAgents = suspended.pagination.total_items;
  } catch (error) {
    if (error instanceof Error && error.message === "SESSION_EXPIRED") {
      redirect("/login?session=expired");
    }
    loadError = getServerPageError(error, {
      sessionExpiredRedirect: "/login?session=expired",
    });
  }

  const recentAgents = agents;

  return (
    <PageContainer>
      <div className="rounded-3xl bg-gradient-to-r from-[#005C2E] to-[#007A3D] p-8 text-white shadow-xl">
        <p className="text-sm font-semibold text-[#F9C80E]">
          SoftPOS Operations
        </p>
        <h1 className="mt-3 text-4xl font-black">Agent Management Dashboard</h1>
        <p className="mt-3 max-w-2xl text-green-50">
          Monitor onboarding, KYC compliance, indemnity acceptance, and agent
          operational status.
        </p>
      </div>

      {loadError ? (
        <SectionErrorCard {...loadError} />
      ) : (
        <>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Agents"
          value={totalAgents}
          tone="bg-white text-slate-900"
        />
        <StatCard
          title="Active Agents"
          value={activeAgents}
          tone="bg-[#007A3D] text-white"
        />
        <StatCard
          title="Pending Agents"
          value={pendingAgents}
          tone="bg-[#F9C80E] text-[#0F172A]"
        />
        <StatCard
          title="Suspended Agents"
          value={suspendedAgents}
          tone="bg-rose-600 text-white"
        />
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Recent Agents</h2>
            <p className="text-sm text-slate-500">
              Latest onboarded agent profiles
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full min-w-[900px] table-auto">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Agent Code
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Merchant ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Biller
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Business
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 bg-white">
              {recentAgents.map((agent) => (
                <tr key={agent.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                    {agent.agentCode}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                    {displayMerchantId(agent.merchantId)}
                  </td>
                  <td className="min-w-[220px] px-6 py-4 text-sm text-slate-700">
                    {agent.billerId || agent.billerName ? (
                      <div>
                        <p className="font-medium text-slate-900">
                          {displayBillerName(agent.billerName)}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {displayBillerId(agent.billerId)}
                        </p>
                      </div>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">
                    {agent.fullName}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">
                    {agent.businessName}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${agentStatusClass(agent.status)}`}
                    >
                      {agent.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
        </>
      )}
    </PageContainer>
  );
}
