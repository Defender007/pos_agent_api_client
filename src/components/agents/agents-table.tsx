import StatusBadge from "@/components/ui/custom/status-badge";
import { Agent } from "@/types/agent";
import Link from "next/link";
import { EmptyState } from "@/components/list/list-controls";
import { displayMerchantId } from "@/lib/merchant-id";
import { displayBillerId, displayBillerName } from "@/lib/biller-display";

type AgentsTableProps = {
  agents: Agent[];
};
export default function AgentsTable({ agents }: AgentsTableProps) {
  if (agents.length === 0) {
    return <EmptyState message="No agents found." />;
  }
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[1100px] table-auto">
        <thead>
          <tr className="border-b bg-slate-50 text-left">
            <th className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-slate-600 align-middle">
              Agent Code
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-slate-600 align-middle">
              Merchant ID
            </th>
            <th className="min-w-[220px] px-4 py-3 text-sm font-semibold text-slate-600 align-middle">
              Biller
            </th>
            <th className="min-w-[150px] px-4 py-3 text-sm font-semibold text-slate-600 align-middle">
              Full Name
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-slate-600 align-middle">
              Phone
            </th>
            <th className="min-w-[150px] px-4 py-3 text-sm font-semibold text-slate-600 align-middle">
              Business
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-slate-600 align-middle">
              Status
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-right text-sm font-semibold text-slate-600 align-middle">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
        {agents.map((agent) => (
          <tr key={agent.id} className="border-b">
            <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-slate-900 align-middle">
              {agent.agentCode}
            </td>

            <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-700 align-middle">
              {displayMerchantId(agent.merchantId)}
            </td>

            <td className="min-w-[220px] px-4 py-4 text-sm text-slate-700 align-middle">
              {agent.billerId || agent.billerName ? (
                <div>
                  <p className="font-medium text-slate-900">
                    {displayBillerName(agent.billerName)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {displayBillerId(agent.billerId)}
                  </p>
                </div>
              ) : (
                "—"
              )}
            </td>

            <td className="min-w-[150px] px-4 py-4 text-sm text-slate-700 align-middle">
              {agent.fullName}
            </td>

            <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-700 align-middle">
              {agent.phone}
            </td>

            <td className="min-w-[150px] px-4 py-4 text-sm text-slate-700 align-middle">
              {agent.businessName}
            </td>

            <td className="whitespace-nowrap px-4 py-4 text-sm align-middle">
              <StatusBadge status={agent.status} />
            </td>

            <td className="whitespace-nowrap px-4 py-4 text-right text-sm align-middle">
              <div className="flex justify-end gap-2 whitespace-nowrap">
                <Link
                  href={`/agents/${agent.id}`}
                  className="rounded-md border border-[#BFDCCB] px-3 py-1 text-sm font-medium text-[#005C2E] hover:bg-[#E6F4EC]"
                >
                  View
                </Link>

                <Link
                  href={`/agents/${agent.id}/edit`}
                  className="rounded-md border border-[#BFDCCB] px-3 py-1 text-sm font-medium text-[#005C2E] hover:bg-[#E6F4EC]"
                >
                  Edit
                </Link>
                <Link
                  href={`/agents/${agent.id}/status`}
                  className="rounded-md border border-red-200 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                >
                  Suspend
                </Link>
              </div>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}
