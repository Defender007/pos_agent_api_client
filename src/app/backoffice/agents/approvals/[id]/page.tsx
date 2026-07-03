import Link from "next/link";
import { redirect } from "next/navigation";

import {
  AgentStatusBadge,
  AgentTypeBadge,
} from "@/components/agents/agent-badges";
import AgentApprovalActions from "@/components/agents/agent-approval-actions";
import SectionErrorCard, {
  type SectionErrorCardProps,
} from "@/components/common/section-error-card";
import PageContainer from "@/components/layout/page-container";
import PageTitle from "@/components/layout/page-title";
import Sidebar from "@/components/layout/sidebar";
import TopHeader from "@/components/layout/top-header";
import SectionCard from "@/components/ui/custom/section-card";
import { getBankAgentById } from "@/lib/api/bank-agents-server";
import { getServerPageError } from "@/lib/api/server-page-error";
import { formatAgentStatus, formatAgentType } from "@/lib/agent-display";
import { getBusinessSegmentLabel } from "@/lib/business-segments";
import { displayMerchantId } from "@/lib/merchant-id";
import { displayBillerId, displayBillerName } from "@/lib/biller-display";
import type { BankAgent } from "@/types/bank-agent";

type BankAgentReviewPageProps = {
  params: Promise<{ id: string }>;
};

function DetailItem({
  label,
  value,
  className = "",
}: {
  label: string;
  value?: string | number | null;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 break-words font-medium text-slate-900">
        {value ?? "—"}
      </p>
    </div>
  );
}

function getOrganizationName(agent: BankAgent) {
  if (agent.organization_name) {
    return agent.organization_name;
  }

  if (typeof agent.organization === "string") {
    return agent.organization;
  }

  if (agent.organization) {
    return (
      agent.organization.name ||
      agent.organization.code ||
      agent.organization_id ||
      "—"
    );
  }

  return agent.organization_id || "—";
}

export default async function BankAgentReviewPage({
  params,
}: BankAgentReviewPageProps) {
  const { id } = await params;
  let agent: BankAgent | null = null;
  let loadError: SectionErrorCardProps | null = null;

  try {
    agent = await getBankAgentById(id);
  } catch (error) {
    if (error instanceof Error && error.message === "SESSION_EXPIRED") {
      redirect("/backoffice/login?session=expired");
    }

    loadError = getServerPageError(error, {
      sessionExpiredRedirect: "/backoffice/login?session=expired",
    });
  }

  if (loadError || !agent) {
    return (
      <BackofficeShell>
        <PageContainer>
          <PageTitle
            title="Agent Review"
            description="Review the complete agent profile"
          />
          <SectionErrorCard
            {...(loadError || {
              title: "Unable to load this section",
              message:
                "The agent details could not be loaded. Please try again.",
            })}
          />
        </PageContainer>
      </BackofficeShell>
    );
  }

  const address = agent.address ?? agent.location?.address;
  const latitude = agent.latitude ?? agent.location?.latitude;
  const longitude = agent.longitude ?? agent.location?.longitude;
  const businessSegment =
    agent.business_segment === "others"
      ? "Others"
      : getBusinessSegmentLabel(agent.business_segment);

  return (
    <BackofficeShell>
      <PageContainer>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link
              href="/backoffice/agents/approvals"
              className="text-sm font-semibold text-[#007A3D] hover:text-[#005C2E]"
            >
              Back to Agent Approvals
            </Link>
            <div className="mt-3">
              <PageTitle
                title="Agent Review"
                description="Review the complete profile before taking action"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <AgentTypeBadge agentType={agent.agent_type} />
            <AgentStatusBadge status={agent.status} />
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <SectionCard>
            <h2 className="mb-5 text-lg font-bold text-slate-900">
              Agent Information
            </h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <DetailItem label="Agent Code" value={agent.agent_code} />
              <DetailItem
                label="Merchant ID"
                value={displayMerchantId(agent.merchant_id)}
              />
              <DetailItem
                label="Biller Name"
                value={displayBillerName(agent.biller_name)}
              />
              <DetailItem
                label="Biller ID"
                value={displayBillerId(agent.biller_id)}
              />
              <DetailItem
                label="Agent Type"
                value={formatAgentType(agent.agent_type)}
              />
              <DetailItem label="First Name" value={agent.first_name} />
              <DetailItem label="Middle Name" value={agent.middle_name} />
              <DetailItem label="Last Name" value={agent.last_name} />
              <DetailItem label="Phone" value={agent.phone} />
              <DetailItem label="Email" value={agent.email} />
              <DetailItem
                label="Organization"
                value={getOrganizationName(agent)}
              />
              <DetailItem label="TID" value={agent.tid} />
              <DetailItem
                label="Status"
                value={formatAgentStatus(agent.status)}
              />
            </div>
          </SectionCard>

          <SectionCard>
            <h2 className="mb-5 text-lg font-bold text-slate-900">
              Business Information
            </h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <DetailItem label="Business Name" value={agent.business_name} />
              <DetailItem
                label="Registration Number / RC Number"
                value={agent.registration_number}
              />
              <DetailItem label="Business Segment" value={businessSegment} />
              <DetailItem
                label="Other Business Segment"
                value={agent.business_segment_other}
              />
            </div>
          </SectionCard>

          <SectionCard>
            <h2 className="mb-5 text-lg font-bold text-slate-900">
              KYC Information
            </h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <DetailItem label="BVN" value={agent.kyc?.bvn} />
              <DetailItem label="NIN" value={agent.kyc?.nin} />
              <DetailItem label="IMEI" value={agent.kyc?.imei} />
              <DetailItem
                label="Verification Status"
                value={agent.kyc?.verification_status}
              />
              <DetailItem
                label="Notes"
                value={agent.kyc?.notes ?? agent.notes}
                className="sm:col-span-2"
              />
            </div>
          </SectionCard>

          <SectionCard>
            <h2 className="mb-5 text-lg font-bold text-slate-900">
              Operating Location
            </h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <DetailItem
                label="Address"
                value={address}
                className="sm:col-span-2"
              />
              <DetailItem label="Latitude" value={latitude} />
              <DetailItem label="Longitude" value={longitude} />
            </div>
          </SectionCard>
        </div>

        <AgentApprovalActions
          agentId={agent.id}
          status={agent.status}
          tid={agent.tid}
        />
      </PageContainer>
    </BackofficeShell>
  );
}

function BackofficeShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="min-w-0 flex-1">
        <TopHeader />
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
