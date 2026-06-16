import Link from "next/link";

import {
  getBankadminPermissions,
  type BankadminPermission,
} from "@/lib/api/bankadmin-rbac-server";

import SectionErrorCard, {
  type SectionErrorCardProps,
} from "@/components/common/section-error-card";
import PageContainer from "@/components/layout/page-container";
import PageTitle from "@/components/layout/page-title";
import { getServerPageError } from "@/lib/api/server-page-error";

export default async function PermissionsPage() {
  let permissions: BankadminPermission[] = [];
  let loadError: SectionErrorCardProps | null = null;

  try {
    permissions = await getBankadminPermissions();
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
          className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Create Permission
        </Link>
      </div>

      {loadError ? (
        <SectionErrorCard {...loadError} />
      ) : (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {permissions.map((permission) => (
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
      )}
    </PageContainer>
  );
}
