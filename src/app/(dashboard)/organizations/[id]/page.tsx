import PageContainer from "@/components/layout/page-container";
import PageTitle from "@/components/layout/page-title";
import Link from "next/link";

import SectionErrorCard, {
  type SectionErrorCardProps,
} from "@/components/common/section-error-card";
import {
  getOrganization,
  getOrganizationAgents,
  getOrganizationStaff,
  type OrganizationAgent,
  type OrganizationDetail,
  type OrganizationStaffMember,
} from "@/lib/api/organizations-server";
import { getServerPageError } from "@/lib/api/server-page-error";
import { getBusinessSegmentLabel } from "@/lib/business-segments";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

function statusPillClass(status?: string | null) {
  const normalizedStatus = status?.toLowerCase();

  if (normalizedStatus === "active" || normalizedStatus === "approved") {
    return "bg-[#E6F4EC] text-[#005C2E]";
  }

  if (
    normalizedStatus === "pending" ||
    normalizedStatus === "pending_approval"
  ) {
    return "bg-[#FFF7D6] text-[#7A5A00]";
  }

  if (normalizedStatus === "rejected" || normalizedStatus === "suspended") {
    return "bg-red-100 text-red-700";
  }

  return "bg-slate-100 text-slate-700";
}

function agentTypePillClass(agentType?: string | null) {
  return agentType === "solopreneur"
    ? "bg-[#FFF7D6] text-[#005C2E]"
    : "bg-slate-100 text-slate-700";
}

export default async function OrganizationDetailPage({ params }: Props) {
  const { id } = await params;

  let organization: OrganizationDetail | null = null;
  let staff: OrganizationStaffMember[] = [];
  let agents: OrganizationAgent[] = [];
  let loadError: SectionErrorCardProps | null = null;

  try {
    [organization, staff, agents] = await Promise.all([
      getOrganization(id),
      getOrganizationStaff(id),
      getOrganizationAgents(id),
    ]);
  } catch (error) {
    loadError = getServerPageError(error, {
      sessionExpiredRedirect: "/backoffice/login?session=expired",
    });
  }

  return (
    <PageContainer>
      <PageTitle
        title={organization?.name || "Organization Details"}
        description="Organization Details"
      />

      {loadError || !organization ? (
        <SectionErrorCard
          {...(loadError || {
            title: "Unable to load this section",
            message:
              "The organization details could not be loaded. Please try again.",
          })}
        />
      ) : (
        <>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold">Organization Information</h2>

          <div className="space-y-3 text-sm">
            <p>
              <strong>Code:</strong> {organization.code || "—"}
            </p>

            <p>
              <strong>Registration Number / RC Number:</strong>{" "}
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
              <strong>Organization Type:</strong>{" "}
              {organization.is_system ||
              organization.organization_type === "solopreneur_system"
                ? "Solopreneur System"
                : "Standard"}
            </p>

            <p>
              <strong>Business Segment:</strong>{" "}
              {organization.business_segment === "others"
                ? organization.business_segment_other || "Others"
                : getBusinessSegmentLabel(organization.business_segment)}
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

          {organization.is_system ||
          organization.organization_type === "solopreneur_system" ? (
            <span className="rounded-xl bg-[#FFF7D6] px-4 py-3 text-sm font-semibold text-[#7A5A00]">
              System organization
            </span>
          ) : (
            <Link
              href={`/organizations/${id}/staff/new`}
              className="rounded-xl bg-[#007A3D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#005C2E]"
            >
              Create Merchant Staff
            </Link>
          )}
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
              {staff.map((member: OrganizationStaffMember) => {
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
                        className="font-semibold text-[#007A3D] hover:text-[#005C2E]"
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

      <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-900">Agents</h2>

          <p className="text-sm text-slate-500">
            Agents under this organization
          </p>
        </div>

        {agents.length === 0 ? (
          <div className="rounded-xl border border-dashed px-6 py-10 text-center">
            <p className="text-sm text-slate-500">
              No agents have been created under this organization yet.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  {[
                    "Agent Code",
                    "Name",
                    "Business Name",
                    "Phone",
                    "Email",
                    "Agent Type",
                    "TID",
                    "Status",
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
                {agents.map((agent) => {
                  const fullName =
                    `${agent.first_name} ${agent.last_name}`.trim() || "—";

                  return (
                    <tr key={agent.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                        {agent.agent_code || "—"}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-700">
                        {fullName}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-700">
                        {agent.business_name || "—"}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-700">
                        {agent.phone || "—"}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-700">
                        {agent.email || "—"}
                      </td>

                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${agentTypePillClass(agent.agent_type)}`}
                        >
                          {agent.agent_type === "solopreneur"
                            ? "Solopreneur Agent"
                            : "Standard Agent"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-700">
                        {agent.tid || "—"}
                      </td>

                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusPillClass(agent.status)}`}
                        >
                          {agent.status || "—"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
        </>
      )}
    </PageContainer>
  );
}
