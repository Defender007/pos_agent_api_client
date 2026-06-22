import { redirect } from "next/navigation";
import Link from "next/link";

import SectionErrorCard, {
  type SectionErrorCardProps,
} from "@/components/common/section-error-card";
import PageContainer from "@/components/layout/page-container";
import PageTitle from "@/components/layout/page-title";
import Sidebar from "@/components/layout/sidebar";
import TopHeader from "@/components/layout/top-header";
import { getBankAdminAgents } from "@/lib/api/bank-agents-server";
import { getServerPageError } from "@/lib/api/server-page-error";
import type { BankAgent } from "@/types/bank-agent";

type AgentStatusGroup =
  | "pending"
  | "active"
  | "suspended"
  | "rejected"
  | "deactivated";

const statusGroups: Record<AgentStatusGroup, string[]> = {
  pending: ["pending", "pending_approval"],
  active: ["active", "approved"],
  suspended: ["suspended", "suspended_by_bank"],
  rejected: ["rejected"],
  deactivated: ["deactivated", "deactivated_by_bank"],
};

function getAgentName(agent: BankAgent) {
  return `${agent.first_name || ""} ${agent.last_name || ""}`.trim() || "—";
}

function getStatusGroup(status?: string | null): AgentStatusGroup | null {
  const normalizedStatus = status?.toLowerCase() || "";
  const match = Object.entries(statusGroups).find(([, statuses]) =>
    statuses.includes(normalizedStatus),
  );

  return (match?.[0] as AgentStatusGroup | undefined) || null;
}

function formatAgentStatus(status?: string | null) {
  const group = getStatusGroup(status);

  if (group === "pending") return "Pending Approval";
  if (group === "active") return "Active";
  if (group === "suspended") return "Suspended";
  if (group === "rejected") return "Rejected";
  if (group === "deactivated") return "Deactivated";

  return status ? status.replaceAll("_", " ") : "—";
}

function statusPillClass(statusTone: AgentStatusGroup) {
  const styles: Record<AgentStatusGroup, string> = {
    pending: "bg-[#FFF7D6] text-[#7A5A00]",
    active: "bg-[#E6F4EC] text-[#005C2E]",
    suspended: "bg-[#FFF7D6] text-[#7A5A00]",
    rejected: "bg-red-100 text-red-700",
    deactivated: "bg-slate-100 text-slate-700",
  };

  return `rounded-full px-3 py-1 text-xs font-semibold ${styles[statusTone]}`;
}

function AgentTypeBadge({ agentType }: { agentType?: string | null }) {
  const isSolopreneur = agentType === "solopreneur";

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        isSolopreneur
          ? "bg-[#FFF7D6] text-[#005C2E]"
          : "bg-slate-100 text-slate-700"
      }`}
    >
      {isSolopreneur ? "Solopreneur Agent" : "Standard Agent"}
    </span>
  );
}

function AgentsTableSection({
  title,
  description,
  agents,
  emptyMessage,
  statusTone,
}: {
  title: string;
  description: string;
  agents: BankAgent[];
  emptyMessage: string;
  statusTone: AgentStatusGroup;
}) {
  const headers = [
    "Agent Code",
    "Name",
    "Business Name",
    "Agent Type",
    "Status",
    "TID",
    "Actions",
  ];

  return (
    <div className="mt-8 min-w-0 rounded-2xl border bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>

        <p className="text-sm text-slate-500">{description}</p>
      </div>

      {agents.length === 0 ? (
        <div className="rounded-xl border border-dashed px-6 py-10 text-center">
          <p className="text-sm text-slate-500">{emptyMessage}</p>
        </div>
      ) : (
        <div className="max-w-full overflow-x-auto rounded-xl border">
          <table className="w-full min-w-[900px]">
            <thead className="bg-slate-50">
              <tr>
                {headers.map((header) => (
                  <th
                    key={header}
                    className="px-6 py-4 text-left text-sm font-semibold text-slate-600"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {agents.map((agent) => (
                <tr key={agent.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                    {agent.agent_code || "—"}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-700">
                    {getAgentName(agent)}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-700">
                    {agent.business_name || "—"}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    <AgentTypeBadge agentType={agent.agent_type} />
                  </td>

                  <td className="px-6 py-4 text-sm">
                    <span className={statusPillClass(statusTone)}>
                      {formatAgentStatus(agent.status)}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-700">
                    {agent.tid || "—"}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    <Link
                      href={`/backoffice/agents/approvals/${agent.id}`}
                      className="inline-flex rounded-lg border border-[#BFDCCB] px-3 py-2 font-semibold text-[#005C2E] transition hover:bg-[#E6F4EC]"
                    >
                      {statusTone === "pending" ? "Review" : "View Details"}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default async function AgentApprovalsPage() {
  let agents: BankAgent[] = [];
  let pendingAgents: BankAgent[] = [];
  let activeAgents: BankAgent[] = [];
  let suspendedAgents: BankAgent[] = [];
  let rejectedAgents: BankAgent[] = [];
  let deactivatedAgents: BankAgent[] = [];
  let loadError: SectionErrorCardProps | null = null;

  try {
    agents = await getBankAdminAgents();
    pendingAgents = agents.filter(
      (agent) => getStatusGroup(agent.status) === "pending",
    );
    activeAgents = agents.filter(
      (agent) => getStatusGroup(agent.status) === "active",
    );
    suspendedAgents = agents.filter(
      (agent) => getStatusGroup(agent.status) === "suspended",
    );
    rejectedAgents = agents.filter(
      (agent) => getStatusGroup(agent.status) === "rejected",
    );
    deactivatedAgents = agents.filter(
      (agent) => getStatusGroup(agent.status) === "deactivated",
    );
  } catch (error) {
    if (error instanceof Error && error.message === "SESSION_EXPIRED") {
      redirect("/backoffice/login?session=expired");
    }

    loadError = getServerPageError(error, {
      sessionExpiredRedirect: "/backoffice/login?session=expired",
    });
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="min-w-0 flex-1">
        <TopHeader />

        <div className="p-8">
          <PageContainer>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <PageTitle
                title="Agent Approvals"
                description="Review agents pending bank approval"
              />

              <Link
                href="/backoffice/agents/solopreneur/new"
                className="rounded-xl bg-[#007A3D] px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#005C2E]"
              >
                Create Solopreneur Agent
              </Link>
            </div>

            {loadError ? (
              <SectionErrorCard {...loadError} />
            ) : (
              <>
                <AgentsTableSection
                  title="Pending Approval Agents"
                  description="Agents awaiting backoffice review"
                  agents={pendingAgents}
                  emptyMessage="No agents are currently pending approval."
                  statusTone="pending"
                />

                <AgentsTableSection
                  title="Active Agents"
                  description="Approved agents currently active"
                  agents={activeAgents}
                  emptyMessage="No active agents found."
                  statusTone="active"
                />

                <AgentsTableSection
                  title="Suspended Agents"
                  description="Agents suspended by bank review"
                  agents={suspendedAgents}
                  emptyMessage="No suspended agents found."
                  statusTone="suspended"
                />

                <AgentsTableSection
                  title="Rejected Agents"
                  description="Agents rejected by backoffice"
                  agents={rejectedAgents}
                  emptyMessage="No rejected agents found."
                  statusTone="rejected"
                />

                <AgentsTableSection
                  title="Deactivated Agents"
                  description="Agents deactivated by bank review"
                  agents={deactivatedAgents}
                  emptyMessage="No deactivated agents found."
                  statusTone="deactivated"
                />
              </>
            )}
          </PageContainer>
        </div>
      </main>
    </div>
  );
}
