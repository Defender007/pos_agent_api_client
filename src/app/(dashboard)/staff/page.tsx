import { getBankadminStaff } from "@/lib/api/bankadmin-rbac-server";
import SectionErrorCard, {
  type SectionErrorCardProps,
} from "@/components/common/section-error-card";
import PageContainer from "@/components/layout/page-container";
import PageTitle from "@/components/layout/page-title";
import { getServerPageError } from "@/lib/api/server-page-error";
import type { BankadminStaff } from "@/lib/api/bankadmin-rbac-server";

export default async function StaffPage() {
  let staffUsers: BankadminStaff[] = [];
  let loadError: SectionErrorCardProps | null = null;

  try {
    staffUsers = await getBankadminStaff();
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
      ) : (
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
            {staffUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-10 text-center text-sm text-slate-500"
                >
                  No staff records found.
                </td>
              </tr>
            ) : (
              staffUsers.map((staff) => {
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
              })
            )}
          </tbody>
        </table>
      </div>
      )}
    </PageContainer>
  );
}
