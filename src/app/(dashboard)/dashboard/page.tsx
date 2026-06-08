import { redirect } from "next/navigation";
import { getAgents } from "@/lib/api/agents";
import PageContainer from "@/components/layout/page-container";

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

export default async function DashboardPage() {
  let agents = [];

  try {
    agents = await getAgents();
  } catch (error) {
    if (error instanceof Error && error.message === "SESSION_EXPIRED") {
      redirect("/login?session=expired");
    }
    throw error;
  }

  const totalAgents = agents.length;
  const activeAgents = agents.filter((a) => a.status === "active").length;
  const pendingAgents = agents.filter((a) => a.status === "pending").length;
  const suspendedAgents = agents.filter((a) => a.status === "suspended").length;
  const recentAgents = agents.slice(0, 5);

  return (
    <PageContainer>
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-slate-700 p-8 text-white shadow-xl">
        <p className="text-sm font-semibold text-amber-300">
          SoftPOS Operations
        </p>
        <h1 className="mt-3 text-4xl font-black">Agent Management Dashboard</h1>
        <p className="mt-3 max-w-2xl text-slate-300">
          Monitor onboarding, KYC compliance, indemnity acceptance, and agent
          operational status.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Agents"
          value={totalAgents}
          tone="bg-white text-slate-900"
        />
        <StatCard
          title="Active Agents"
          value={activeAgents}
          tone="bg-emerald-600 text-white"
        />
        <StatCard
          title="Pending Agents"
          value={pendingAgents}
          tone="bg-amber-500 text-white"
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

        <div className="overflow-hidden rounded-xl border">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Agent Code
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
                  <td className="px-6 py-4 text-sm text-slate-700">
                    {agent.fullName}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">
                    {agent.businessName}
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold capitalize text-slate-700">
                      {agent.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageContainer>
  );
}
