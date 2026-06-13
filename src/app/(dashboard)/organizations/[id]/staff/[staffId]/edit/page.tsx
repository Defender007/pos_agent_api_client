import { getOrganizationStaffMember } from "@/lib/api/organizations-server";
import EditOrganizationStaffForm from "@/components/organizations/edit-organization-staff-form";

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

  const staff = await getOrganizationStaffMember(id, staffId);

  return (
    <EditOrganizationStaffForm
      organizationId={id}
      staff={staff}
    />
  );
}
