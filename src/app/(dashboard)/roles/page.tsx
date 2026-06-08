import { getRoles } from "@/lib/api/rbac";
import Link from "next/link";

import PageContainer from "@/components/layout/page-container";
import PageTitle from "@/components/layout/page-title";

export default async function RolesPage() {
  const roles = await getRoles();

  return (
    <PageContainer>
      <div className="mb-6 flex items-center justify-between">
        <PageTitle
          title="Roles & Permissions"
          description="Manage RBAC roles and permission assignments"
        />

        <Link
          href="/roles/new"
          className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Create Role
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {roles.map((role) => (
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
                {role.permissions.length} perms
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {role.permissions.length > 0 ? (
                role.permissions.map((permission) => (
                  <span
                    key={permission}
                    className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700"
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
    </PageContainer>
  );
}
