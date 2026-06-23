import {
  agentStatusToneClass,
  agentTypeToneClass,
  formatAgentStatus,
  formatAgentType,
} from "@/lib/agent-display";

const badgeBaseClass =
  "inline-flex w-fit shrink-0 items-center whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold";

export function AgentTypeBadge({ agentType }: { agentType?: string | null }) {
  return (
    <span className={`${badgeBaseClass} ${agentTypeToneClass(agentType)}`}>
      {formatAgentType(agentType)}
    </span>
  );
}

export function AgentStatusBadge({ status }: { status?: string | null }) {
  return (
    <span className={`${badgeBaseClass} ${agentStatusToneClass(status)}`}>
      {formatAgentStatus(status)}
    </span>
  );
}

