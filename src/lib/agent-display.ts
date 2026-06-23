export const AGENT_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  pending_approval: "Pending Approval",
  active: "Active",
  approved: "Active",
  suspended: "Suspended",
  suspended_by_bank: "Suspended",
  rejected: "Rejected",
  deactivated: "Deactivated",
  deactivated_by_bank: "Deactivated",
};

export const AGENT_TYPE_LABELS: Record<string, string> = {
  standard: "Standard Agent",
  solopreneur: "Solopreneur Agent",
};

export function formatAgentStatus(status?: string | null) {
  if (!status) return "—";

  return AGENT_STATUS_LABELS[status.toLowerCase()] || status.replaceAll("_", " ");
}

export function formatAgentType(agentType?: string | null) {
  if (!agentType) return "Standard Agent";

  return AGENT_TYPE_LABELS[agentType.toLowerCase()] || agentType.replaceAll("_", " ");
}

export function agentStatusToneClass(status?: string | null) {
  const normalizedStatus = status?.toLowerCase();

  if (normalizedStatus === "active" || normalizedStatus === "approved") {
    return "bg-[#E6F4EC] text-[#005C2E]";
  }

  if (
    normalizedStatus === "pending" ||
    normalizedStatus === "pending_approval"
  ) {
    return "bg-[#FFF7D6] text-[#7A5A00]";
  }

  if (
    normalizedStatus === "rejected" ||
    normalizedStatus === "suspended" ||
    normalizedStatus === "suspended_by_bank"
  ) {
    return "bg-red-100 text-red-700";
  }

  if (
    normalizedStatus === "deactivated" ||
    normalizedStatus === "deactivated_by_bank"
  ) {
    return "bg-slate-100 text-slate-700";
  }

  return "bg-slate-100 text-slate-700";
}

export function agentTypeToneClass(agentType?: string | null) {
  return agentType === "solopreneur"
    ? "bg-[#FFF7D6] text-[#005C2E]"
    : "bg-slate-100 text-slate-700";
}

