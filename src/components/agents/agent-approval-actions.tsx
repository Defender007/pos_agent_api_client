"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/api/api-error";
import {
  bankReviewAgent,
  bankUpdateAgentStatus,
} from "@/lib/api/bank-agents-client";
import { Toaster } from "@/components/ui/sonner";
import type { BankAgentStatusValue } from "@/types/bank-agent";

type AgentApprovalActionsProps = {
  agentId: string;
  status: string;
  tid?: string | null;
};

type AgentAction =
  | {
      kind: "approval";
      decision: "approved" | "rejected";
      label: string;
      confirmLabel: string;
      successMessage: string;
      requiresNotes: boolean;
      className: string;
    }
  | {
      kind: "status";
      status: BankAgentStatusValue;
      label: string;
      confirmLabel: string;
      successMessage: string;
      requiresNotes: true;
      className: string;
    };

const actionStyles = {
  approve:
    "rounded-xl bg-[#007A3D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#005C2E]",
  reactivate:
    "rounded-xl bg-[#007A3D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#005C2E]",
  suspend:
    "rounded-xl border border-[#F9C80E] px-5 py-3 text-sm font-semibold text-[#7A5A00] transition hover:bg-[#FFF7D6]",
  reject:
    "rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50",
  deactivate:
    "rounded-xl bg-red-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-800",
  restore:
    "rounded-xl border border-[#F9C80E] px-5 py-3 text-sm font-semibold text-[#7A5A00] transition hover:bg-[#FFF7D6]",
};

function getAvailableActions(status: string, tid?: string | null): AgentAction[] {
  if (status === "pending" || status === "pending_approval") {
    return [
      {
        kind: "approval",
        decision: "approved",
        label: "Approve",
        confirmLabel: "Confirm Approval",
        successMessage: "Agent approved successfully.",
        requiresNotes: false,
        className: actionStyles.approve,
      },
      {
        kind: "approval",
        decision: "rejected",
        label: "Reject",
        confirmLabel: "Confirm Rejection",
        successMessage: "Agent rejected successfully.",
        requiresNotes: true,
        className: actionStyles.reject,
      },
    ];
  }

  if (status === "active") {
    return [
      {
        kind: "status",
        status: "suspended",
        label: "Suspend",
        confirmLabel: "Confirm Suspension",
        successMessage: "Agent suspended successfully.",
        requiresNotes: true,
        className: actionStyles.suspend,
      },
      {
        kind: "status",
        status: "rejected",
        label: "Reject",
        confirmLabel: "Confirm Rejection",
        successMessage: "Agent rejected successfully.",
        requiresNotes: true,
        className: actionStyles.reject,
      },
      {
        kind: "status",
        status: "deactivated",
        label: "Deactivate",
        confirmLabel: "Confirm Deactivation",
        successMessage: "Agent deactivated successfully.",
        requiresNotes: true,
        className: actionStyles.deactivate,
      },
    ];
  }

  if (status === "suspended_by_bank") {
    return [
      {
        kind: "status",
        status: "active",
        label: "Reactivate",
        confirmLabel: "Confirm Reactivation",
        successMessage: "Agent reactivated successfully",
        requiresNotes: true,
        className: actionStyles.reactivate,
      },
      {
        kind: "status",
        status: "deactivated",
        label: "Deactivate",
        confirmLabel: "Confirm Deactivation",
        successMessage: "Agent deactivated successfully.",
        requiresNotes: true,
        className: actionStyles.deactivate,
      },
    ];
  }

  if (status === "deactivated_by_bank") {
    return [
      {
        kind: "status",
        status: "active",
        label: "Reactivate",
        confirmLabel: "Confirm Reactivation",
        successMessage: "Agent reactivated successfully",
        requiresNotes: true,
        className: actionStyles.reactivate,
      },
      {
        kind: "status",
        status: "suspended",
        label: "Suspend",
        confirmLabel: "Confirm Suspension",
        successMessage: "Agent suspended successfully",
        requiresNotes: true,
        className: actionStyles.suspend,
      },
    ];
  }

  if (status === "rejected") {
    if (tid) {
      return [
        {
          kind: "status",
          status: "active",
          label: "Reactivate",
          confirmLabel: "Confirm Reactivation",
          successMessage: "Agent reactivated successfully",
          requiresNotes: true,
          className: actionStyles.reactivate,
        },
      ];
    }

    return [
      {
        kind: "status",
        status: "pending_approval",
        label: "Restore for Approval",
        confirmLabel: "Confirm Restore for Approval",
        successMessage: "Agent restored to pending approval successfully",
        requiresNotes: true,
        className: actionStyles.restore,
      },
    ];
  }

  return [];
}

function getInformationalMessage(status: string) {
  if (status === "suspended") {
    return "This agent was suspended by Merchant Staff and cannot be reactivated or overridden by Bank Staff.";
  }

  if (status === "deactivated") {
    return "This agent was deactivated by Merchant Staff and cannot be reactivated or overridden by Bank Staff.";
  }

  return null;
}

function getActionKey(action: AgentAction) {
  return action.kind === "approval" ? action.decision : action.status;
}

export default function AgentApprovalActions({
  agentId,
  status,
  tid,
}: AgentApprovalActionsProps) {
  const router = useRouter();
  const actions = useMemo(() => getAvailableActions(status, tid), [status, tid]);
  const informationalMessage = getInformationalMessage(status);
  const [selectedAction, setSelectedAction] = useState<AgentAction | null>(
    null,
  );
  const [notes, setNotes] = useState("");
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  if (actions.length === 0 && !informationalMessage) {
    return null;
  }

  async function submitAction() {
    if (!selectedAction) {
      return;
    }

    const trimmedNotes = notes.trim();

    if (selectedAction.requiresNotes && !trimmedNotes) {
      toast.error("Notes are required for this action.");
      return;
    }

    const actionKey = getActionKey(selectedAction);
    setLoadingAction(actionKey);

    try {
      if (selectedAction.kind === "approval") {
        await bankReviewAgent(agentId, {
          decision: selectedAction.decision,
          notes:
            selectedAction.decision === "approved"
              ? "KYC accepted"
              : trimmedNotes,
        });
      } else {
        await bankUpdateAgentStatus(agentId, {
          status: selectedAction.status,
          notes: trimmedNotes,
        });
      }

      toast.success(selectedAction.successMessage);

      setTimeout(() => {
        router.push("/backoffice/agents/approvals");
      }, 700);
    } catch (error) {
      if (error instanceof ApiError && error.message === "SESSION_EXPIRED") {
        router.push("/backoffice/login?session=expired");
        return;
      }

      if (
        error instanceof ApiError &&
        error.status === 409 &&
        error.message === "No available TID for agent approval"
      ) {
        toast.error(
          "No available TID. Please preload TIDs before approving this agent.",
        );
        return;
      }

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update agent status.",
      );
    } finally {
      setLoadingAction(null);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900">Agent Actions</h2>
      <p className="mt-1 text-sm text-slate-500">
        Review available actions for this agent status before confirming.
      </p>

      {informationalMessage && (
        <div className="mt-5 rounded-xl border border-[#F9C80E]/40 bg-[#FFF7D6] p-4 text-sm font-semibold text-[#7A5A00]">
          {informationalMessage}
        </div>
      )}

      {actions.length > 0 && (
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {actions.map((action) => {
            const actionKey = getActionKey(action);

            return (
              <button
                key={actionKey}
                type="button"
                disabled={loadingAction !== null}
                onClick={() => {
                  setSelectedAction(action);
                  setNotes("");
                }}
                className={`${action.className} disabled:cursor-not-allowed disabled:opacity-50`}
              >
                {action.label}
              </button>
            );
          })}
        </div>
      )}

      {selectedAction && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-sm font-bold text-slate-900">
            {selectedAction.confirmLabel}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {selectedAction.kind === "approval" &&
            selectedAction.decision === "approved"
              ? "This will approve the agent with the existing bank-review payload."
              : "Enter notes and confirm this status change."}
          </p>

          {selectedAction.requiresNotes && (
            <div className="mt-4">
              <label
                htmlFor="agent-action-notes"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Notes
              </label>
              <textarea
                id="agent-action-notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={4}
                placeholder="Enter action notes"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#007A3D] focus:ring-2 focus:ring-[#007A3D]/20"
              />
            </div>
          )}

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              disabled={loadingAction !== null}
              onClick={() => void submitAction()}
              className="rounded-xl bg-[#007A3D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#005C2E] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loadingAction === getActionKey(selectedAction)
                ? "Submitting..."
                : selectedAction.confirmLabel}
            </button>

            <button
              type="button"
              disabled={loadingAction !== null}
              onClick={() => {
                setSelectedAction(null);
                setNotes("");
              }}
              className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <Toaster richColors />
    </div>
  );
}
