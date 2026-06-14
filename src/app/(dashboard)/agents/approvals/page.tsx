import { redirect } from "next/navigation";

import AgentApprovalActions from "@/components/agents/agent-approval-actions";
import PageContainer from "@/components/layout/page-container";
import PageTitle from "@/components/layout/page-title";
import {
  getApprovedAgents,
  getPendingApprovalAgents,
  getRejectedAgents,
} from "@/lib/api/bank-agents-server";
import type { BankAgent } from "@/types/bank-agent";

function getAgentName(agent: BankAgent) {
  return `${agent.first_name || ""} ${agent.last_name || ""}`.trim() || "—";
}

function getOrganizationName(agent: BankAgent) {
  if (agent.organization_name) {
    return agent.organization_name;
  }

  if (typeof agent.organization === "string") {
    return agent.organization;
  }

  if (agent.organization) {
    return (
      agent.organization.name ||
      agent.organization.code ||
      agent.organization_id ||
      "—"
    );
  }

  return agent.organization_id || "—";
}

function statusPillClass(statusTone: "pending" | "approved" | "rejected") {
  const styles = {
    pending: "bg-amber-100 text-amber-700",
    approved: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-700",
  };

  return `rounded-full px-3 py-1 text-xs font-semibold ${styles[statusTone]}`;
}

function AgentsTableSection({
  title,
  description,
  agents,
  emptyMessage,
  showActions = false,
  statusTone,
}: {
  title: string;
  description: string;
  agents: BankAgent[];
  emptyMessage: string;
  showActions?: boolean;
  statusTone: "pending" | "approved" | "rejected";
}) {
  const headers = [
    "Agent Code",
    "Name",
    "Business Name",
    "Phone",
    "Email",
    "Organization",
    "Status",
    ...(showActions ? ["Actions"] : []),
  ];

  return (
    <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>

        <p className="text-sm text-slate-500">{description}</p>
      </div>

      {agents.length === 0 ? (
        <div className="rounded-xl border border-dashed px-6 py-10 text-center">
          <p className="text-sm text-slate-500">{emptyMessage}</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border">
          <table className="w-full">
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

                  <td className="px-6 py-4 text-sm text-slate-700">
                    {agent.phone || "—"}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-700">
                    {agent.email || "—"}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-700">
                    {getOrganizationName(agent)}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    <span className={statusPillClass(statusTone)}>
                      {agent.status || "—"}
                    </span>
                  </td>

                  {showActions && (
                    <td className="px-6 py-4 text-sm">
                      <AgentApprovalActions agentId={agent.id} />
                    </td>
                  )}
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
  let pendingAgents: BankAgent[] = [];
  let approvedAgents: BankAgent[] = [];
  let rejectedAgents: BankAgent[] = [];

  try {
    [pendingAgents, approvedAgents, rejectedAgents] = await Promise.all([
      getPendingApprovalAgents(),
      getApprovedAgents(),
      getRejectedAgents(),
    ]);
  } catch (error) {
    if (error instanceof Error && error.message === "SESSION_EXPIRED") {
      redirect("/backoffice/login?session=expired");
    }

    throw error;
  }

  return (
    <PageContainer>
      <PageTitle
        title="Agent Approvals"
        description="Review agents pending bank approval"
      />

      <AgentsTableSection
        title="Pending Approval Agents"
        description="Agents awaiting backoffice review"
        agents={pendingAgents}
        emptyMessage="No agents are currently pending approval."
        showActions
        statusTone="pending"
      />

      <AgentsTableSection
        title="Approved Agents"
        description="Agents approved by backoffice"
        agents={approvedAgents}
        emptyMessage="No approved agents found."
        statusTone="approved"
      />

      <AgentsTableSection
        title="Rejected Agents"
        description="Agents rejected by backoffice"
        agents={rejectedAgents}
        emptyMessage="No rejected agents found."
        statusTone="rejected"
      />
    </PageContainer>
  );
}
