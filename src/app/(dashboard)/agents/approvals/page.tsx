import { redirect } from "next/navigation";
import Link from "next/link";

import AgentApprovalActions from "@/components/agents/agent-approval-actions";
import SectionErrorCard, {
  type SectionErrorCardProps,
} from "@/components/common/section-error-card";
import PageContainer from "@/components/layout/page-container";
import PageTitle from "@/components/layout/page-title";
import {
  getApprovedAgents,
  getPendingApprovalAgents,
  getRejectedAgents,
} from "@/lib/api/bank-agents-server";
import { getServerPageError } from "@/lib/api/server-page-error";
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
    pending: "bg-[#FFF7D6] text-[#7A5A00]",
    approved: "bg-[#E6F4EC] text-[#005C2E]",
    rejected: "bg-red-100 text-red-700",
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
    "Agent Type",
    "TID",
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
                    <AgentTypeBadge agentType={agent.agent_type} />
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-700">
                    {agent.tid || "—"}
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
  let loadError: SectionErrorCardProps | null = null;

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

    loadError = getServerPageError(error, {
      sessionExpiredRedirect: "/backoffice/login?session=expired",
    });
  }

  return (
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
        </>
      )}
    </PageContainer>
  );
}
