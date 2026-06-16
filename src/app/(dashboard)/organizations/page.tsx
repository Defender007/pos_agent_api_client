import Link from "next/link";

import { getOrganizations } from "@/lib/api/organizations-server";
import type { Organization } from "@/lib/api/organizations";

import SectionErrorCard, {
  type SectionErrorCardProps,
} from "@/components/common/section-error-card";
import PageContainer from "@/components/layout/page-container";
import PageTitle from "@/components/layout/page-title";
import { getServerPageError } from "@/lib/api/server-page-error";

export default async function OrganizationsPage() {
  let organizations: Organization[] = [];
  let loadError: SectionErrorCardProps | null = null;

  try {
    organizations = await getOrganizations();
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
          className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Create Organization
        </Link>
      </div>

      {loadError ? (
        <SectionErrorCard {...loadError} />
      ) : (
      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              {["Name", "Code", "Email", "Phone", "Status", "Actions"].map(
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
            {organizations.map((org) => (
              <tr key={org.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-semibold">{org.name}</td>

                <td className="px-6 py-4">{org.code || "—"}</td>

                <td className="px-6 py-4">{org.contact_email || "—"}</td>

                <td className="px-6 py-4">{org.contact_phone || "—"}</td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      org.is_active
                        ? "bg-green-100 text-green-700"
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
    </PageContainer>
  );
}
