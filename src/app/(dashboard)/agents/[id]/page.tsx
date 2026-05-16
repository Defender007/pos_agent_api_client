import StatusBadge from "@/components/ui/custom/status-badge";
import SectionCard from "@/components/ui/custom/section-card";
import PageContainer from "@/components/layout/page-container";
import PageTitle from "@/components/layout/page-title";

type AgentDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AgentDetailsPage({
  params,
}: AgentDetailsPageProps) {
  const { id } = await params;

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <PageTitle
          title="Agent Details"
          description="View agent profile information"
        />

        <StatusBadge status="active" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile Information */}
        <SectionCard>
          <h2 className="mb-4 text-lg font-semibold">Profile Information</h2>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Agent ID</p>

              <p className="font-medium">{id}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Full Name</p>

              <p className="font-medium">John Doe</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Phone Number</p>

              <p className="font-medium">08012345678</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Business Name</p>

              <p className="font-medium">Doe Ventures</p>
            </div>
          </div>
        </SectionCard>

        {/* KYC Information */}
        <SectionCard>
          <h2 className="mb-4 text-lg font-semibold">KYC Information</h2>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">BVN</p>

              <p className="font-medium">22334455667</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">NIN</p>

              <p className="font-medium">55667788990</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Address</p>

              <p className="font-medium">15 Admiralty Way, Lagos</p>
            </div>
          </div>
        </SectionCard>
      </div>
    </PageContainer>
  );
}
