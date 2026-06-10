import { getStaffUsers } from "@/lib/api/rbac";
import PageContainer from "@/components/layout/page-container";
import PageTitle from "@/components/layout/page-title";
import Link from "next/link";

export default async function StaffPage() {
  const staffUsers = await getStaffUsers();

  return (
    <PageContainer>
      <div className="mb-6 flex items-center justify-between">
        <PageTitle
          title="Staff Administration"
          description="Manage admin staff profiles, roles, and access"
        />

        <Link
          href="/staff/new"
          className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Create Staff
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <table className="w-full">
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
            {staffUsers.map((staff) => {
              const profile = staff.profile;

              const fullName = profile
                ? `${profile.first_name} ${profile.middle_name || ""} ${profile.last_name}`.replace(
                    /\s+/g,
                    " ",
                  )
                : "—";

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
                    {staff.roles.join(", ") || "—"}
                  </td>

                  <td className="px-6 py-4">
                    <Link
                      href={`/staff/${staff.id}/edit`}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
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
    </PageContainer>
  );
}
