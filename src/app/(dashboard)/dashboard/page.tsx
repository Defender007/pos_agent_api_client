import { redirect } from "next/navigation";

import { getAgents } from "@/lib/api/agents";

import PageContainer from "@/components/layout/page-container";
import PageTitle from "@/components/layout/page-title";

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>

      <h2 className="mt-2 text-3xl font-bold">{value}</h2>
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

  const activeAgents = agents.filter(
    (agent) => agent.status === "active",
  ).length;

  const pendingAgents = agents.filter(
    (agent) => agent.status === "pending",
  ).length;

  const suspendedAgents = agents.filter(
    (agent) => agent.status === "suspended",
  ).length;

  const recentAgents = [...agents].slice(0, 5);

  return (
    <PageContainer>
      <PageTitle
        title="Dashboard"
        description="SoftPOS Agent Operations Overview"
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Agents" value={totalAgents} />

        <StatCard title="Active Agents" value={activeAgents} />

        <StatCard title="Pending Agents" value={pendingAgents} />

        <StatCard title="Suspended Agents" value={suspendedAgents} />
      </div>

      <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Agents</h2>
        </div>

        <div className="overflow-hidden rounded-lg border">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Agent Code
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Name
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Business
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {recentAgents.map((agent) => (
                <tr
                  key={agent.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {agent.agentCode}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700">
                    {agent.fullName}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700">
                    {agent.businessName}
                  </td>

                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold capitalize text-gray-700">
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
