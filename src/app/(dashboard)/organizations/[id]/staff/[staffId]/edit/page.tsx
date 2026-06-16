import { getOrganizationStaffMember } from "@/lib/api/organizations-server";
import EditOrganizationStaffForm from "@/components/organizations/edit-organization-staff-form";
import SectionErrorCard, {
  type SectionErrorCardProps,
} from "@/components/common/section-error-card";
import PageContainer from "@/components/layout/page-container";
import PageTitle from "@/components/layout/page-title";
import { getServerPageError } from "@/lib/api/server-page-error";

type Props = {
  params: Promise<{
    id: string;
    staffId: string;
  }>;
};

export default async function EditOrganizationStaffPage({
  params,
}: Props) {
  const { id, staffId } = await params;

  let staff = null;
  let loadError: SectionErrorCardProps | null = null;

  try {
    staff = await getOrganizationStaffMember(id, staffId);
  } catch (error) {
    loadError = getServerPageError(error, {
      sessionExpiredRedirect: "/backoffice/login?session=expired",
    });
  }

  if (loadError || !staff) {
    return (
      <PageContainer>
        <PageTitle
          title="Edit Merchant Staff"
          description="Update merchant staff account and profile details"
        />
        <SectionErrorCard
          {...(loadError || {
            title: "Unable to load this section",
            message:
              "The merchant staff details could not be loaded. Please try again.",
          })}
        />
      </PageContainer>
    );
  }

  return (
    <EditOrganizationStaffForm
      organizationId={id}
      staff={staff}
    />
  );
}
