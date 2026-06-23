import { AgentStatusBadge } from "@/components/agents/agent-badges";

type StatusBadgeProps = {
  status?: string | null;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return <AgentStatusBadge status={status} />;
}
