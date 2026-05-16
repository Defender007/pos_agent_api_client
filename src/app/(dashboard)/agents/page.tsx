import PageHeader from "@/components/layout/page-header";
import { Agent } from "@/types/agents";
import AgentsTable from "@/components/agents/agents-table";
import Link from "next/link";
import PageContainer from "@/components/layout/page-container";

const agents: Agent[] = [
  {
    id: "1",
    agentCode: "AGT-001",
    fullName: "John Doe",
    phone: "08012345678",
    businessName: "Doe Ventures",
    status: "active",
  },
  {
    id: "2",
    agentCode: "AGT-002",
    fullName: "Mary Johnson",
    phone: "08087654321",
    businessName: "MJ Stores",
    status: "suspended",
  },
];

// const agents: Agent[] = [];
export default function AgentsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Agents"
        description="Manage SoftPOS agents"
        action={
          <Link
            href="/agents/new"
            className="rounded-lg bg-black px-4 py-2 text-white"
          >
            Add Agent
          </Link>
        }
      />
      <AgentsTable agents={agents} />
    </PageContainer>
  );
}
