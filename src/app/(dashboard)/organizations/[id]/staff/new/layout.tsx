import { redirect } from "next/navigation";

import SectionErrorCard from "@/components/common/section-error-card";
import { getOrganization } from "@/lib/api/organizations-server";

export default async function NewOrganizationStaffLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let isSystemOrganization = false;

  try {
    const organization = await getOrganization(id);

    isSystemOrganization = Boolean(
      organization.is_system ||
        organization.organization_type === "solopreneur_system",
    );
  } catch (error) {
    if (error instanceof Error && error.message === "SESSION_EXPIRED") {
      redirect("/backoffice/login?session=expired");
    }

    return (
      <SectionErrorCard
        title="Unable to load this section"
        message="The organization could not be verified for staff creation. Please try again."
      />
    );
  }

  if (isSystemOrganization) {
    redirect(`/organizations/${id}`);
  }

  return children;
}
