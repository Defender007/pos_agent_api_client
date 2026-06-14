import { getStaffUser } from "@/lib/api/rbac";

import EditStaffForm from "@/components/staff/edit-staff-form";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditStaffPage({ params }: Props) {
  const { id } = await params;

  const staff = await getStaffUser(id);

  return <EditStaffForm staff={staff} />;
}
