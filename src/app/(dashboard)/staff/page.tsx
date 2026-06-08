import { getStaffUsers } from "@/lib/api/rbac";
import PageContainer from "@/components/layout/page-container";
import PageTitle from "@/components/layout/page-title";

export default async function StaffPage() {
  const staffUsers = await getStaffUsers();

  return (
    <PageContainer>
      <PageTitle
        title="Staff Administration"
        description="Manage admin staff profiles, roles, and access"
      />

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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </PageContainer>
  );
}
