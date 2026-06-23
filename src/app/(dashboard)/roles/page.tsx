import {
  getBankadminRoles,
  type BankadminRole,
} from "@/lib/api/bankadmin-rbac-server";
import Link from "next/link";

import SectionErrorCard, {
  type SectionErrorCardProps,
} from "@/components/common/section-error-card";
import {
  ClearFiltersButton,
  EmptyState,
  PageSizeSelect,
  PaginationControls,
  SearchInput,
  SortControls,
} from "@/components/list/list-controls";
import PageContainer from "@/components/layout/page-container";
import PageTitle from "@/components/layout/page-title";
import type { PaginatedData } from "@/lib/api/pagination";
import { getListQuery, type PageSearchParams } from "@/lib/list-query";
import { getServerPageError } from "@/lib/api/server-page-error";

type Props = {
  searchParams: Promise<PageSearchParams>;
};

const roleSortOptions = [
  { label: "Newest", value: "created_at" },
  { label: "Name", value: "name" },
];

export default async function RolesPage({ searchParams }: Props) {
  const query = getListQuery(await searchParams, {
    defaultSortBy: "created_at",
  });

  let roles: PaginatedData<BankadminRole> | null = null;
  let loadError: SectionErrorCardProps | null = null;

  try {
    roles = await getBankadminRoles(query);
  } catch (error) {
    loadError = getServerPageError(error, {
      sessionExpiredRedirect: "/backoffice/login?session=expired",
    });
  }

  return (
    <PageContainer>
      <div className="mb-6 flex items-center justify-between">
        <PageTitle
          title="Roles & Permissions"
          description="Manage RBAC roles and permission assignments"
        />

        <Link
          href="/roles/new"
          className="rounded-xl bg-[#007A3D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#005C2E]"
        >
          Create Role
        </Link>
      </div>

      {loadError ? (
        <SectionErrorCard {...loadError} />
      ) : roles ? (
      <div className="rounded-2xl border bg-white shadow-sm">
        <div className="grid gap-3 border-b border-slate-200 p-4 lg:grid-cols-[minmax(220px,1fr)_auto]">
          <SearchInput placeholder="Search roles" />
          <div className="flex flex-wrap gap-3">
            <SortControls options={roleSortOptions} />
            <PageSizeSelect />
            <ClearFiltersButton params={["search", "sort_by", "sort_order"]} />
          </div>
        </div>

        {roles.items.length === 0 ? (
          <div className="p-4">
            <EmptyState message="No roles found." />
          </div>
        ) : (
      <div className="p-4">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {roles.items.map((role) => (
          <div
            key={role.id}
            className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {role.name}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {role.description || "No description"}
                </p>
              </div>

              <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {role.permissions?.length ?? 0} perms
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {role.permissions?.length ? (
                role.permissions.map((permission) => (
                  <span
                    key={permission}
                    className="rounded-full bg-[#FFF7D6] px-3 py-1 text-xs font-semibold text-[#7A5A00]"
                  >
                    {permission}
                  </span>
                ))
              ) : (
                <span className="text-sm text-slate-400">
                  No permissions assigned
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      </div>
        )}
        <PaginationControls data={roles} />
      </div>
      ) : null}
    </PageContainer>
  );
}
