import { getAgentById } from "@/lib/api/agents";
import SectionErrorCard, {
  type SectionErrorCardProps,
} from "@/components/common/section-error-card";
import PageContainer from "@/components/layout/page-container";
import PageTitle from "@/components/layout/page-title";
import SectionCard from "@/components/ui/custom/section-card";
import StatusBadge from "@/components/ui/custom/status-badge";
import { getServerPageError } from "@/lib/api/server-page-error";
import type { Agent } from "@/types/agent";

type AgentDetailsPageProps = {
  params: Promise<{ id: string }>;
};

function DetailItem({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium">{value ?? "—"}</p>
    </div>
  );
}

export default async function AgentDetailsPage({
  params,
}: AgentDetailsPageProps) {
  const { id } = await params;
  let agent: Agent | null = null;
  let loadError: SectionErrorCardProps | null = null;

  try {
    agent = await getAgentById(id);
  } catch (error) {
    loadError = getServerPageError(error, {
      sessionExpiredRedirect: "/login?session=expired",
    });
  }

  if (loadError || !agent) {
    return (
      <PageContainer>
        <PageTitle
          title="Agent Details"
          description="Complete agent and KYC profile"
        />
        <SectionErrorCard
          {...(loadError || {
            title: "Unable to load this section",
            message: "The agent details could not be loaded. Please try again.",
          })}
        />
      </PageContainer>
    );
  }

  const address = agent.address ?? agent.location?.address;
  const latitude = agent.latitude ?? agent.location?.latitude;
  const longitude = agent.longitude ?? agent.location?.longitude;

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <PageTitle
          title="Agent Details"
          description="Complete agent and KYC profile"
        />

        <StatusBadge status={agent.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard>
          <h2 className="mb-4 text-lg font-semibold">Agent Information</h2>

          <div className="grid gap-4 md:grid-cols-2">
            {/*<DetailItem label="Agent ID" value={agent.id} />*/}
            <DetailItem label="Agent Code" value={agent.agentCode} />
            <DetailItem label="First Name" value={agent.firstName} />
            <DetailItem label="Last Name" value={agent.lastName} />
            <DetailItem label="Phone" value={agent.phone} />
            <DetailItem label="Email" value={agent.email} />
            <DetailItem label="Business Name" value={agent.businessName} />
            <DetailItem label="TID" value={agent.tid} />
            {/*<DetailItem label="Created At" value={agent.createdAt} />*/}
            {/*<DetailItem label="Updated At" value={agent.updatedAt} />*/}
          </div>
        </SectionCard>

        <SectionCard>
          <h2 className="mb-4 text-lg font-semibold">KYC Information</h2>

          <div className="grid gap-4 md:grid-cols-2">
            {/*<DetailItem label="KYC ID" value={agent.kyc?.id} />*/}
            {/*<DetailItem label="Agent ID" value={agent.kyc?.agentId} />*/}
            <DetailItem label="BVN" value={agent.kyc?.bvn} />
            <DetailItem label="NIN" value={agent.kyc?.nin} />
            <DetailItem label="IMEI" value={agent.kyc?.imei} />
            <DetailItem
              label="Verification Status"
              value={agent.kyc?.verificationStatus}
            />
            <DetailItem label="Notes" value={agent.kyc?.notes} />
            {/*<DetailItem label="Created At" value={agent.kyc?.createdAt} />*/}
            {/*<DetailItem label="Updated At" value={agent.kyc?.updatedAt} />*/}
          </div>
        </SectionCard>

        <SectionCard>
          <h2 className="mb-4 text-lg font-semibold">Operating Location</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <DetailItem label="Address" value={address} />
            </div>

            <DetailItem label="Latitude" value={latitude} />
            <DetailItem label="Longitude" value={longitude} />
          </div>
        </SectionCard>
      </div>
    </PageContainer>
  );
}
