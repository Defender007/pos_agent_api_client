import PageContainer from "@/components/layout/page-container";
import PageTitle from "@/components/layout/page-title";
import { getOrganizationStaff } from "@/lib/api/organizations-server";
import Link from "next/link";

import { getOrganization } from "@/lib/api/organizations-server";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OrganizationDetailPage({ params }: Props) {
  const { id } = await params;

  const organization = await getOrganization(id);
  const staff = await getOrganizationStaff(id);

  return (
    <PageContainer>
      <PageTitle title={organization.name} description="Organization Details" />

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold">Organization Information</h2>

          <div className="space-y-3 text-sm">
            <p>
              <strong>Code:</strong> {organization.code || "—"}
            </p>

            <p>
              <strong>Registration Number:</strong>{" "}
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

          <Link
            href={`/organizations/${id}/staff/new`}
            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Create Merchant Staff
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl border">
          <table className="w-full">
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
              {staff.map((member: any) => {
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
                        className="font-semibold text-blue-600 hover:text-blue-800"
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
      </div>
    </PageContainer>
  );
}
