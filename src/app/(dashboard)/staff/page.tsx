import { getBankadminStaff } from "@/lib/api/bankadmin-rbac-server";
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
import type { BankadminStaff } from "@/lib/api/bankadmin-rbac-server";

type Props = {
  searchParams: Promise<PageSearchParams>;
};

const staffSortOptions = [
  { label: "Newest", value: "created_at" },
  { label: "Email", value: "email" },
  { label: "Status", value: "status" },
  { label: "Role", value: "role" },
];

export default async function StaffPage({ searchParams }: Props) {
  const query = getListQuery(await searchParams, {
    defaultSortBy: "created_at",
    allowedFilters: ["organisation", "role", "status"],
  });

  let staffUsers: PaginatedData<BankadminStaff> | null = null;
  let loadError: SectionErrorCardProps | null = null;

  try {
    staffUsers = await getBankadminStaff(query);
  } catch (error) {
    loadError = getServerPageError(error, {
      sessionExpiredRedirect: "/backoffice/login?session=expired",
    });
  }

  return (
    <PageContainer>
      <div className="mb-6 flex items-center justify-between">
        <PageTitle
          title="Merchant Staff Administration"
          description="View merchant staff profiles, roles, and access"
        />
      </div>

      {loadError ? (
        <SectionErrorCard {...loadError} />
      ) : staffUsers ? (
      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4">
        <ListToolbar>
          <SearchInput placeholder="Search merchant staff" />

          <div className="flex flex-wrap items-end gap-3">
            <FilterSelect
              label="Role"
              paramName="role"
              options={[
                { label: "All roles", value: "" },
                { label: "Admin", value: "admin" },
              ]}
            />
            <FilterSelect
              label="Status"
              paramName="status"
              options={[
                { label: "All statuses", value: "" },
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
                { label: "Suspended", value: "suspended" },
              ]}
            />
            <SearchInput
              label="Organisation"
              placeholder="All organisations"
              paramName="organisation"
              widthClass="sm:w-[220px]"
            />
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <SortControls options={staffSortOptions} />
            <PageSizeSelect />
            <ClearFiltersButton
              params={[
                "search",
                "organisation",
                "role",
                "status",
                "sort_by",
                "sort_order",
              ]}
            />
          </div>
        </ListToolbar>
        </div>

        {staffUsers.items.length === 0 ? (
          <div className="p-4">
            <EmptyState message="No staff records found." />
          </div>
        ) : (
        <div className="overflow-x-auto">
        <table className="w-full min-w-[950px]">
          <thead className="bg-slate-50">
            <tr>
              {[
                "Full Name",
                "Designation",
                "Organisation",
                "Staff ID",
                "Email",
                "Roles",
                "Actions",
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
              {staffUsers.items.map((staff) => {
                const profile = staff.profile;

                const fullName = profile
                  ? `${profile.first_name || ""} ${profile.middle_name || ""} ${
                      profile.last_name || ""
                    }`
                      .replace(/\s+/g, " ")
                      .trim() || "—"
                  : "—";

                const roles = staff.roles?.length
                  ? staff.roles.join(", ")
                  : staff.role || "—";

                return (
                  <tr key={staff.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                      {fullName}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-700">
                      {profile?.designation || "—"}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-700">
                      {profile?.organisation || "—"}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-700">
                      {profile?.staff_id || "—"}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-700">
                      {staff.email}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-700">
                      {roles}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500">—</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        </div>
        )}
        <PaginationControls data={staffUsers} />
      </div>
      ) : null}
    </PageContainer>
  );
}
