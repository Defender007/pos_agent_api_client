import type { AgentStatus } from "@/types/agent";

type StatusBadgeProps = {
  status: AgentStatus;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const styles: Record<AgentStatus, string> = {
    active: "bg-[#E6F4EC] text-[#005C2E]",
    suspended: "bg-red-100 text-red-700",
    rejected: "bg-red-100 text-red-700",
    deactivated: "bg-slate-100 text-slate-700",
    pending: "bg-[#FFF7D6] text-[#7A5A00]",
    pending_approval: "bg-[#FFF7D6] text-[#7A5A00]",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-sm ${styles[status]}`}>
      {status.replaceAll("_", " ")}
    </span>
  );
}
