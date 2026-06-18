import Link from "next/link";

import { getOrganizations } from "@/lib/api/organizations-server";
import type { Organization } from "@/lib/api/organizations";

import SectionErrorCard, {
  type SectionErrorCardProps,
} from "@/components/common/section-error-card";
import PageContainer from "@/components/layout/page-container";
import PageTitle from "@/components/layout/page-title";
import { getServerPageError } from "@/lib/api/server-page-error";
import { getBusinessSegmentLabel } from "@/lib/business-segments";

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
          className="rounded-xl bg-[#007A3D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#005C2E]"
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
              {[
                "Name",
                "Code",
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
            {organizations.map((org) => (
              <tr key={org.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-semibold">{org.name}</td>

                <td className="px-6 py-4">{org.code || "—"}</td>

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
    </PageContainer>
  );
}
