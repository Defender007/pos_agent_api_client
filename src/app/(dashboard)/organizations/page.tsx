import Link from "next/link";

import { getOrganizations } from "@/lib/api/organizations-server";
import type { Organization } from "@/lib/api/organizations";

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
import type { PaginatedData } from "@/lib/api/pagination";
import { getListQuery, type PageSearchParams } from "@/lib/list-query";
import { getServerPageError } from "@/lib/api/server-page-error";
import { getBusinessSegmentLabel } from "@/lib/business-segments";
import { displayMerchantId } from "@/lib/merchant-id";
import { displayBillerId, displayBillerName } from "@/lib/biller-display";

type Props = {
  searchParams: Promise<PageSearchParams>;
};

const organizationSortOptions = [
  { label: "Newest", value: "created_at" },
  { label: "Name", value: "name" },
  { label: "Code", value: "code" },
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

export default async function OrganizationsPage({ searchParams }: Props) {
  const query = getListQuery(await searchParams, {
    defaultSortBy: "created_at",
    allowedFilters: [
      "organization_type",
      "business_segment",
      "is_system",
      "has_registration_number",
      "has_code",
    ],
  });

  let organizations: PaginatedData<Organization> | null = null;
  let loadError: SectionErrorCardProps | null = null;

  try {
    organizations = await getOrganizations(query);
  } catch (error) {
    loadError = getServerPageError(error, {
      sessionExpiredRedirect: "/backoffice/login?session=expired",
    });
  }

  return (
    <PageContainer>
      <div className="mb-6 flex items-center justify-between">
        <PageTitle
          title="Organizations"
          description="Manage merchant organizations"
        />

        <Link
          href="/organizations/new"
          className="rounded-xl bg-[#007A3D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#005C2E]"
        >
          Create Organization
        </Link>
      </div>

      {loadError ? (
        <SectionErrorCard {...loadError} />
      ) : organizations ? (
      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4">
        <ListToolbar>
          <SearchInput placeholder="Search organizations" />

          <div className="flex flex-wrap items-end gap-3">
            <FilterSelect
              label="Type"
              paramName="organization_type"
              options={[
                { label: "All types", value: "" },
                { label: "Standard", value: "standard" },
                { label: "System", value: "solopreneur_system" },
              ]}
            />
            <FilterSelect
              label="Industry"
              paramName="business_segment"
              options={businessSegmentOptions}
              widthClass="sm:w-[190px]"
            />
            <FilterSelect
              label="System"
              paramName="is_system"
              options={[
                { label: "Any", value: "" },
                { label: "System only", value: "true" },
                { label: "Non-system", value: "false" },
              ]}
            />
            <FilterSelect
              label="Has RC"
              paramName="has_registration_number"
              options={[
                { label: "Any", value: "" },
                { label: "With RC", value: "true" },
                { label: "Without RC", value: "false" },
              ]}
            />
            <FilterSelect
              label="Has code"
              paramName="has_code"
              options={[
                { label: "Any", value: "" },
                { label: "With code", value: "true" },
                { label: "Without code", value: "false" },
              ]}
            />
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <SortControls options={organizationSortOptions} />
            <PageSizeSelect />
            <ClearFiltersButton
              params={[
                "search",
                "organization_type",
                "business_segment",
                "is_system",
                "has_registration_number",
                "has_code",
                "sort_by",
                "sort_order",
              ]}
            />
          </div>
        </ListToolbar>
        </div>

        {organizations.items.length === 0 ? (
          <div className="p-4">
            <EmptyState message="No organizations found." />
          </div>
        ) : (
        <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px]">
          <thead className="bg-slate-50">
            <tr>
              {[
                "Name",
                "Code",
                "Merchant ID",
                "Biller",
                "Type",
                "Business Segment",
                "Email",
                "Phone",
                "Status",
                "Actions",
              ].map((h) => (
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
            {organizations.items.map((org) => (
              <tr key={org.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-semibold">{org.name}</td>

                <td className="px-6 py-4">{org.code || "—"}</td>

                <td className="whitespace-nowrap px-6 py-4">
                  {displayMerchantId(org.merchant_id)}
                </td>

                <td className="min-w-[220px] px-6 py-4">
                  {org.biller_id || org.biller_name ? (
                    <div>
                      <p className="font-medium text-slate-900">
                        {displayBillerName(org.biller_name)}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {displayBillerId(org.biller_id)}
                      </p>
                    </div>
                  ) : (
                    "—"
                  )}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      org.is_system ||
                      org.organization_type === "solopreneur_system"
                        ? "bg-[#FFF7D6] text-[#7A5A00]"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {org.is_system ||
                    org.organization_type === "solopreneur_system"
                      ? "System"
                      : "Standard"}
                  </span>
                </td>

                <td className="px-6 py-4">
                  {org.business_segment === "others"
                    ? org.business_segment_other || "Others"
                    : getBusinessSegmentLabel(org.business_segment)}
                </td>

                <td className="px-6 py-4">{org.contact_email || "—"}</td>

                <td className="px-6 py-4">{org.contact_phone || "—"}</td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      org.is_active
                        ? "bg-[#E6F4EC] text-[#005C2E]"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {org.status}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <Link
                    href={`/organizations/${org.id}`}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        )}
        <PaginationControls data={organizations} />
      </div>
      ) : null}
    </PageContainer>
  );
}
