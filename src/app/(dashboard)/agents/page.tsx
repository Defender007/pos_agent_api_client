import Link from "next/link";
import { redirect } from "next/navigation";

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
} from "@/components/list/list-controls";
import { getAgents } from "@/lib/api/agents";
import type { PaginatedData } from "@/lib/api/pagination";
import { getListQuery, type PageSearchParams } from "@/lib/list-query";
import { getServerPageError } from "@/lib/api/server-page-error";

import PageContainer from "@/components/layout/page-container";
import PageTitle from "@/components/layout/page-title";

import AgentsTable from "@/components/agents/agents-table";
import type { Agent } from "@/types/agent";

type Props = {
  searchParams: Promise<PageSearchParams>;
};

const agentSortOptions = [
  { label: "Newest", value: "created_at" },
  { label: "Agent Code", value: "agent_code" },
  { label: "Name", value: "first_name" },
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

export default async function AgentsPage({ searchParams }: Props) {
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

  let agents: PaginatedData<Agent> | null = null;
  let loadError: SectionErrorCardProps | null = null;

  try {
    agents = await getAgents(query);
  } catch (error) {
    if (error instanceof Error && error.message === "SESSION_EXPIRED") {
      redirect("/login?session=expired");
    }

    loadError = getServerPageError(error, {
      sessionExpiredRedirect: "/login?session=expired",
    });
  }

  return (
    <PageContainer>
      <div className="mb-6 flex items-center justify-between">
        <PageTitle title="Agents" description="Manage all onboarded agents" />

        <Link
          href="/agents/new"
          className="rounded-lg bg-[#007A3D] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#005C2E]"
        >
          Add Agent
        </Link>
      </div>

      {loadError ? (
        <SectionErrorCard {...loadError} />
      ) : agents ? (
        <div className="rounded-2xl border bg-white shadow-sm">
          <div className="border-b border-slate-200 p-4">
          <ListToolbar>
            <SearchInput placeholder="Search agents" />

            <div className="flex flex-wrap items-end gap-3">
              <FilterSelect
                label="Status"
                paramName="status"
                options={[
                  { label: "All statuses", value: "" },
                  { label: "Active", value: "active" },
                  { label: "Pending", value: "pending" },
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
              <SortControls options={agentSortOptions} />
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
  );
}
