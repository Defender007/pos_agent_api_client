import PageContainer from "@/components/layout/page-container";
import PageTitle from "@/components/layout/page-title";
import Link from "next/link";

import SectionErrorCard, {
  type SectionErrorCardProps,
} from "@/components/common/section-error-card";
import {
  ClearFiltersButton,
  FilterSelect,
  PageSizeSelect,
  PaginationControls,
  SearchInput,
  SortControls,
  EmptyState,
} from "@/components/list/list-controls";
import {
  getOrganization,
  getOrganizationAgents,
  getOrganizationStaff,
  type OrganizationAgent,
  type OrganizationDetail,
  type OrganizationStaffMember,
} from "@/lib/api/organizations-server";
import type { PaginatedData } from "@/lib/api/pagination";
import { getListQuery, type PageSearchParams } from "@/lib/list-query";
import { getServerPageError } from "@/lib/api/server-page-error";
import { getBusinessSegmentLabel } from "@/lib/business-segments";

type Props = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<PageSearchParams>;
};

function statusPillClass(status?: string | null) {
  const normalizedStatus = status?.toLowerCase();

  if (normalizedStatus === "active" || normalizedStatus === "approved") {
    return "bg-[#E6F4EC] text-[#005C2E]";
  }

  if (
    normalizedStatus === "pending" ||
    normalizedStatus === "pending_approval"
  ) {
    return "bg-[#FFF7D6] text-[#7A5A00]";
  }

  if (normalizedStatus === "rejected" || normalizedStatus === "suspended") {
    return "bg-red-100 text-red-700";
  }

  return "bg-slate-100 text-slate-700";
}

function agentTypePillClass(agentType?: string | null) {
  return agentType === "solopreneur"
    ? "bg-[#FFF7D6] text-[#005C2E]"
    : "bg-slate-100 text-slate-700";
}

const staffSortOptions = [
  { label: "Newest", value: "created_at" },
  { label: "Email", value: "email" },
  { label: "Role", value: "role" },
  { label: "Status", value: "status" },
];

const organizationAgentSortOptions = [
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

export default async function OrganizationDetailPage({
  params,
  searchParams,
}: Props) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const staffQuery = getListQuery(resolvedSearchParams, {
    prefix: "staff_",
    defaultSortBy: "created_at",
    allowedFilters: ["role", "status"],
  });
  const agentsQuery = getListQuery(resolvedSearchParams, {
    prefix: "agents_",
    defaultSortBy: "created_at",
    allowedFilters: ["status", "agent_type", "business_segment", "has_tid"],
  });

  let organization: OrganizationDetail | null = null;
  let staff: PaginatedData<OrganizationStaffMember> | null = null;
  let agents: PaginatedData<OrganizationAgent> | null = null;
  let loadError: SectionErrorCardProps | null = null;

  try {
    [organization, staff, agents] = await Promise.all([
      getOrganization(id),
      getOrganizationStaff(id, staffQuery),
      getOrganizationAgents(id, agentsQuery),
    ]);
  } catch (error) {
    loadError = getServerPageError(error, {
      sessionExpiredRedirect: "/backoffice/login?session=expired",
    });
  }

  return (
    <PageContainer>
      <PageTitle
        title={organization?.name || "Organization Details"}
        description="Organization Details"
      />

      {loadError || !organization ? (
        <SectionErrorCard
          {...(loadError || {
            title: "Unable to load this section",
            message:
              "The organization details could not be loaded. Please try again.",
          })}
        />
      ) : (
        <>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold">Organization Information</h2>

          <div className="space-y-3 text-sm">
            <p>
              <strong>Code:</strong> {organization.code || "—"}
            </p>

            <p>
              <strong>Registration Number / RC Number:</strong>{" "}
              {organization.registration_number || "—"}
            </p>

            <p>
              <strong>Email:</strong> {organization.contact_email || "—"}
            </p>

            <p>
              <strong>Phone:</strong> {organization.contact_phone || "—"}
            </p>

            <p>
              <strong>Address:</strong> {organization.address || "—"}
            </p>

            <p>
              <strong>Organization Type:</strong>{" "}
              {organization.is_system ||
              organization.organization_type === "solopreneur_system"
                ? "Solopreneur System"
                : "Standard"}
            </p>

            <p>
              <strong>Business Segment:</strong>{" "}
              {organization.business_segment === "others"
                ? organization.business_segment_other || "Others"
                : getBusinessSegmentLabel(organization.business_segment)}
            </p>

            <p>
              <strong>Status:</strong> {organization.status}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold">Statistics</h2>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-500">Merchant Staff</p>

              <p className="text-3xl font-black">
                {organization.merchant_staff_count}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Agents</p>

              <p className="text-3xl font-black">{organization.agent_count}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Merchant Staff</h2>

            <p className="text-sm text-slate-500">
              Staff users under this organization
            </p>
          </div>

          {organization.is_system ||
          organization.organization_type === "solopreneur_system" ? (
            <span className="rounded-xl bg-[#FFF7D6] px-4 py-3 text-sm font-semibold text-[#7A5A00]">
              System organization
            </span>
          ) : (
            <Link
              href={`/organizations/${id}/staff/new`}
              className="rounded-xl bg-[#007A3D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#005C2E]"
            >
              Create Merchant Staff
            </Link>
          )}
        </div>

        {staff ? (
          <>
        <div className="grid gap-3 border-y border-slate-200 py-4 lg:grid-cols-[minmax(220px,1fr)_auto_auto]">
          <SearchInput
            placeholder="Search staff"
            paramName="staff_search"
            pageParam="staff_page"
          />
          <div className="flex flex-wrap gap-3">
            <FilterSelect
              label="Role"
              paramName="staff_role"
              pageParam="staff_page"
              options={[
                { label: "All roles", value: "" },
                { label: "Admin", value: "admin" },
              ]}
            />
            <FilterSelect
              label="Status"
              paramName="staff_status"
              pageParam="staff_page"
              options={[
                { label: "All statuses", value: "" },
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
                { label: "Suspended", value: "suspended" },
              ]}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <SortControls
              options={staffSortOptions}
              sortByParam="staff_sort_by"
              sortOrderParam="staff_sort_order"
              pageParam="staff_page"
            />
            <PageSizeSelect paramName="staff_page_size" pageParam="staff_page" />
            <ClearFiltersButton
              pageParam="staff_page"
              params={[
                "staff_search",
                "staff_role",
                "staff_status",
                "staff_sort_by",
                "staff_sort_order",
              ]}
            />
          </div>
        </div>

        {staff.items.length === 0 ? (
          <div className="mt-4">
            <EmptyState message="No merchant staff found." />
          </div>
        ) : (
        <div className="mt-4 overflow-x-auto rounded-xl border">
          <table className="w-full min-w-[900px]">
            <thead className="bg-slate-50">
              <tr>
                {["Name", "Email", "Role", "Status", "Phone", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-left text-sm font-semibold text-slate-600"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {staff.items.map((member: OrganizationStaffMember) => {
                const profile = member.profile;

                const fullName = profile
                  ? `${profile.first_name} ${profile.middle_name || ""} ${profile.last_name}`.replace(
                      /\s+/g,
                      " ",
                    )
                  : "—";

                return (
                  <tr key={member.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                      {fullName}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-700">
                      {member.email}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-700">
                      {member.role || "—"}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-700">
                      {member.status || "—"}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-700">
                      {profile?.phone || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Link
                        href={`/organizations/${id}/staff/${member.id}/edit`}
                        className="font-semibold text-[#007A3D] hover:text-[#005C2E]"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        )}
        <PaginationControls data={staff} pageParam="staff_page" />
          </>
        ) : null}
      </div>

      <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-900">Agents</h2>

          <p className="text-sm text-slate-500">
            Agents under this organization
          </p>
        </div>

        {agents ? (
          <>
        <div className="grid gap-3 border-y border-slate-200 py-4 lg:grid-cols-[minmax(220px,1fr)_auto_auto]">
          <SearchInput
            placeholder="Search agents"
            paramName="agents_search"
            pageParam="agents_page"
          />
          <div className="flex flex-wrap gap-3">
            <FilterSelect
              label="Status"
              paramName="agents_status"
              pageParam="agents_page"
              options={[
                { label: "All statuses", value: "" },
                { label: "Pending", value: "pending" },
                { label: "Active", value: "active" },
                { label: "Suspended", value: "suspended" },
                { label: "Rejected", value: "rejected" },
                { label: "Deactivated", value: "deactivated" },
              ]}
            />
            <FilterSelect
              label="Agent type"
              paramName="agents_agent_type"
              pageParam="agents_page"
              options={[
                { label: "All types", value: "" },
                { label: "Standard", value: "standard" },
                { label: "Solopreneur", value: "solopreneur" },
              ]}
            />
            <FilterSelect
              label="Industry"
              paramName="agents_business_segment"
              pageParam="agents_page"
              options={businessSegmentOptions}
            />
            <FilterSelect
              label="Has TID"
              paramName="agents_has_tid"
              pageParam="agents_page"
              options={[
                { label: "Any", value: "" },
                { label: "With TID", value: "true" },
                { label: "Without TID", value: "false" },
              ]}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <SortControls
              options={organizationAgentSortOptions}
              sortByParam="agents_sort_by"
              sortOrderParam="agents_sort_order"
              pageParam="agents_page"
            />
            <PageSizeSelect
              paramName="agents_page_size"
              pageParam="agents_page"
            />
            <ClearFiltersButton
              pageParam="agents_page"
              params={[
                "agents_search",
                "agents_status",
                "agents_agent_type",
                "agents_business_segment",
                "agents_has_tid",
                "agents_sort_by",
                "agents_sort_order",
              ]}
            />
          </div>
        </div>

        {agents.items.length === 0 ? (
          <div className="mt-4">
            <EmptyState message="No agents have been created under this organization yet." />
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-xl border">
            <table className="w-full min-w-[1100px]">
              <thead className="bg-slate-50">
                <tr>
                  {[
                    "Agent Code",
                    "Name",
                    "Business Name",
                    "Phone",
                    "Email",
                    "Agent Type",
                    "TID",
                    "Status",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-left text-sm font-semibold text-slate-600"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {agents.items.map((agent) => {
                  const fullName =
                    `${agent.first_name} ${agent.last_name}`.trim() || "—";

                  return (
                    <tr key={agent.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                        {agent.agent_code || "—"}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-700">
                        {fullName}
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

                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${agentTypePillClass(agent.agent_type)}`}
                        >
                          {agent.agent_type === "solopreneur"
                            ? "Solopreneur Agent"
                            : "Standard Agent"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-700">
                        {agent.tid || "—"}
                      </td>

                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusPillClass(agent.status)}`}
                        >
                          {agent.status || "—"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <PaginationControls data={agents} pageParam="agents_page" />
          </>
        ) : null}
      </div>
        </>
      )}
    </PageContainer>
  );
}
