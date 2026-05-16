import StatusBadge from "@/components/ui/custom/status-badge";
import { Agent } from "@/types/agents";
import Link from "next/link";
import SectionCard from "@/components/ui/custom/section-card";
import DataTable from "@/components/ui/custom/data-table";

type AgentsTableProps = {
  agents: Agent[];
};
export default function AgentsTable({ agents }: AgentsTableProps) {
  if (agents.length === 0) {
    return (
      <SectionCard>
        <div className="py-10 text-center">
          <p className="text-gray-500">No agents found.</p>
        </div>
      </SectionCard>
    );
  }
  return (
    <SectionCard>
      <DataTable
        headers={[
          "Agent Code",
          "Full Name",
          "Phone",
          "Business",
          "Status",
          "Actions",
        ]}
      >
        {agents.map((agent) => (
          <tr key={agent.id} className="border-b">
            <td className="py-4">{agent.agentCode}</td>

            <td className="py-4">{agent.fullName}</td>

            <td className="py-4">{agent.phone}</td>

            <td className="py-4">{agent.businessName}</td>

            <td className="py-4">
              <StatusBadge status={agent.status} />
            </td>

            <td className="py-4">
              <div className="flex gap-2">
                <Link
                  href={`/agents/${agent.id}`}
                  className="rounded-md border px-3 py-1 text-sm hover:bg-gray-100"
                >
                  View
                </Link>

                <Link
                  href={`/agents/${agent.id}/edit`}
                  className="rounded-md border px-3 py-1 text-sm hover:bg-gray-100"
                >
                  Edit
                </Link>

                <button className="rounded-md border border-red-200 px-3 py-1 text-sm text-red-600 hover:bg-red-50">
                  Suspend
                </button>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>
    </SectionCard>
  );
}
