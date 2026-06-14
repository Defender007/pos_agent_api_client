"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { bankReviewAgent } from "@/lib/api/bank-agents-client";

type AgentApprovalActionsProps = {
  agentId: string;
};

export default function AgentApprovalActions({
  agentId,
}: AgentApprovalActionsProps) {
  const router = useRouter();
  const [loadingAction, setLoadingAction] = useState<
    "approved" | "rejected" | null
  >(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function reviewAgent(decision: "approved" | "rejected", notes: string) {
    setLoadingAction(decision);
    setMessage(null);
    setError(null);

    try {
      await bankReviewAgent(agentId, {
        decision,
        notes,
      });

      setMessage(
        decision === "approved"
          ? "Agent approved successfully."
          : "Agent rejected successfully.",
      );
      router.refresh();
    } catch (reviewError) {
      const fallback =
        decision === "approved"
          ? "Unable to approve agent."
          : "Unable to reject agent.";

      setError(reviewError instanceof Error ? reviewError.message : fallback);
    } finally {
      setLoadingAction(null);
    }
  }

  function handleReject() {
    const notes = window.prompt("Enter rejection notes");

    if (notes === null) {
      return;
    }

    const trimmedNotes = notes.trim();

    if (!trimmedNotes) {
      setMessage(null);
      setError("Rejection notes are required.");
      return;
    }

    void reviewAgent("rejected", trimmedNotes);
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <button
          type="button"
          disabled={loadingAction !== null}
          onClick={() => void reviewAgent("approved", "KYC accepted")}
          className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loadingAction === "approved" ? "Approving..." : "Approve"}
        </button>

        <button
          type="button"
          disabled={loadingAction !== null}
          onClick={handleReject}
          className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loadingAction === "rejected" ? "Rejecting..." : "Reject"}
        </button>
      </div>

      {message && <p className="text-xs font-medium text-emerald-700">{message}</p>}
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
