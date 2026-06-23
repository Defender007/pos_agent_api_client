import Link from "next/link";

import {
  getBankadminPermissions,
  type BankadminPermission,
} from "@/lib/api/bankadmin-rbac-server";

import SectionErrorCard, {
  type SectionErrorCardProps,
} from "@/components/common/section-error-card";
import {
  ClearFiltersButton,
  EmptyState,
  ListToolbar,
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

const permissionSortOptions = [
  { label: "Newest", value: "created_at" },
  { label: "Name", value: "name" },
];

export default async function PermissionsPage({ searchParams }: Props) {
  const query = getListQuery(await searchParams, {
    defaultSortBy: "created_at",
  });

  let permissions: PaginatedData<BankadminPermission> | null = null;
  let loadError: SectionErrorCardProps | null = null;

  try {
    permissions = await getBankadminPermissions(query);
  } catch (error) {
    loadError = getServerPageError(error, {
      sessionExpiredRedirect: "/backoffice/login?session=expired",
    });
  }

  return (
    <PageContainer>
      <div className="mb-6 flex items-center justify-between">
        <PageTitle title="Permissions" description="Manage RBAC permissions" />

        <Link
          href="/permissions/new"
          className="rounded-xl bg-[#007A3D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#005C2E]"
        >
          Create Permission
        </Link>
      </div>

      {loadError ? (
        <SectionErrorCard {...loadError} />
      ) : permissions ? (
      <div className="rounded-2xl border bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4">
        <ListToolbar>
          <SearchInput placeholder="Search permissions" />
          <div className="flex flex-wrap items-end gap-3">
            <SortControls options={permissionSortOptions} />
            <PageSizeSelect />
            <ClearFiltersButton params={["search", "sort_by", "sort_order"]} />
          </div>
        </ListToolbar>
        </div>

        {permissions.items.length === 0 ? (
          <div className="p-4">
            <EmptyState message="No permissions found." />
          </div>
        ) : (
      <div className="p-4">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {permissions.items.map((permission) => (
          <div
            key={permission.id}
            className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <h2 className="text-lg font-bold text-slate-900">
              {permission.name}
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              {permission.description || "No description"}
            </p>
          </div>
        ))}
      </div>
      </div>
        )}
        <PaginationControls data={permissions} />
      </div>
      ) : null}
    </PageContainer>
  );
}
