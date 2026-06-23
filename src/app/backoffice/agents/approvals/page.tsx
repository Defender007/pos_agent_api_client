import { redirect } from "next/navigation";
import Link from "next/link";

import SectionErrorCard, {
  type SectionErrorCardProps,
} from "@/components/common/section-error-card";
import {
  ClearFiltersButton,
  FilterSelect,
  ListToolbar,
  PageSizeSelect,
  PaginationControls,
  SearchInput,
  SortControls,
  EmptyState,
} from "@/components/list/list-controls";
import PageContainer from "@/components/layout/page-container";
import PageTitle from "@/components/layout/page-title";
import Sidebar from "@/components/layout/sidebar";
import TopHeader from "@/components/layout/top-header";
import { getBankAdminAgents } from "@/lib/api/bank-agents-server";
import type { PaginatedData } from "@/lib/api/pagination";
import { getListQuery, type PageSearchParams } from "@/lib/list-query";
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

function AgentsTable({
  agents,
}: {
  agents: BankAgent[];
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
    <>
      {agents.length === 0 ? (
        <div className="p-4">
          <EmptyState message="No agents match the current filters." />
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
              {agents.map((agent) => {
                const statusTone = getStatusGroup(agent.status) || "pending";

                return (
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
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

type Props = {
  searchParams: Promise<PageSearchParams>;
};

const bankAgentSortOptions = [
  { label: "Newest", value: "created_at" },
  { label: "Agent Code", value: "agent_code" },
  { label: "Business Name", value: "business_name" },
  { label: "Status", value: "status" },
];

const businessSegmentOptions = [
  { label: "All industries", value: "" },
  { label: "Fast Foods", value: "fast_foods" },
  { label: "Hotels/GuestHouses", value: "hotels_guesthouses" },
  { label: "Fuel Stations", value: "fuel_stations" },
  { label: "Airlines Operations", value: "airlines_operations" },
  { label: "Restaurants", value: "restaurants" },
  { label: "Logistics/Courier", value: "logistics_courier" },
  { label: "Wholesale", value: "wholesale" },
  { label: "Church/NGO", value: "church_ngo" },
  { label: "Stores/Supermarkets", value: "stores_supermarkets" },
  { label: "MDAs", value: "mdas" },
  { label: "Others", value: "others" },
];

export default async function AgentApprovalsPage({ searchParams }: Props) {
  const query = getListQuery(await searchParams, {
    defaultSortBy: "created_at",
    allowedFilters: [
      "status",
      "agent_type",
      "organization_id",
      "business_segment",
      "has_tid",
    ],
  });

  let agents: PaginatedData<BankAgent> | null = null;
  let loadError: SectionErrorCardProps | null = null;

  try {
    agents = await getBankAdminAgents(query);
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
            ) : agents ? (
              <div className="mt-8 min-w-0 overflow-hidden rounded-2xl border bg-white shadow-sm">
                <div className="border-b border-slate-200 p-4">
                <ListToolbar>
                  <SearchInput placeholder="Search agents" />

                  <div className="flex flex-wrap items-end gap-3">
                    <FilterSelect
                      label="Status"
                      paramName="status"
                      options={[
                        { label: "All", value: "" },
                        { label: "Pending", value: "pending" },
                        { label: "Active", value: "active" },
                        { label: "Suspended", value: "suspended" },
                        { label: "Rejected", value: "rejected" },
                        { label: "Deactivated", value: "deactivated" },
                      ]}
                    />
                    <FilterSelect
                      label="Agent type"
                      paramName="agent_type"
                      options={[
                        { label: "All types", value: "" },
                        { label: "Standard", value: "standard" },
                        { label: "Solopreneur", value: "solopreneur" },
                      ]}
                    />
                    <FilterSelect
                      label="Industry"
                      paramName="business_segment"
                      options={businessSegmentOptions}
                    />
                    <SearchInput
                      label="Organisation"
                      placeholder="Organisation ID"
                      paramName="organization_id"
                      widthClass="sm:w-[220px]"
                    />
                    <FilterSelect
                      label="Has TID"
                      paramName="has_tid"
                      options={[
                        { label: "Any", value: "" },
                        { label: "With TID", value: "true" },
                        { label: "Without TID", value: "false" },
                      ]}
                    />
                  </div>

                  <div className="flex flex-wrap items-end gap-3">
                    <SortControls options={bankAgentSortOptions} />
                    <PageSizeSelect />
                    <ClearFiltersButton
                      params={[
                        "search",
                        "status",
                        "agent_type",
                        "organization_id",
                        "business_segment",
                        "has_tid",
                        "sort_by",
                        "sort_order",
                      ]}
                    />
                  </div>
                </ListToolbar>
                </div>

                <AgentsTable agents={agents.items} />
                <PaginationControls data={agents} />
              </div>
            ) : null}
          </PageContainer>
        </div>
      </main>
    </div>
  );
}
