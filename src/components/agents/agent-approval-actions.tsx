"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/api/api-error";
import { bankReviewAgent } from "@/lib/api/bank-agents-client";
import { Toaster } from "@/components/ui/sonner";

type AgentApprovalActionsProps = {
  agentId: string;
};

export default function AgentApprovalActions({
  agentId,
}: AgentApprovalActionsProps) {
  const router = useRouter();
  const [rejectionNotes, setRejectionNotes] = useState("");
  const [loadingAction, setLoadingAction] = useState<
    "approved" | "rejected" | null
  >(null);

  async function reviewAgent(decision: "approved" | "rejected") {
    const notes =
      decision === "approved" ? "KYC accepted" : rejectionNotes.trim();

    if (decision === "rejected" && !notes) {
      toast.error("Rejection notes are required.");
      return;
    }

    setLoadingAction(decision);

    try {
      await bankReviewAgent(agentId, {
        decision,
        notes,
      });

      toast.success(
        decision === "approved"
          ? "Agent approved successfully."
          : "Agent rejected successfully.",
      );

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
          : decision === "approved"
            ? "Unable to approve agent."
            : "Unable to reject agent.",
      );
    } finally {
      setLoadingAction(null);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900">Bank Review</h2>
      <p className="mt-1 text-sm text-slate-500">
        Approve the agent after reviewing the profile, or provide a reason for
        rejection.
      </p>

      <div className="mt-5">
        <label
          htmlFor="rejection-notes"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Rejection Notes
        </label>
        <textarea
          id="rejection-notes"
          value={rejectionNotes}
          onChange={(event) => setRejectionNotes(event.target.value)}
          rows={4}
          placeholder="Enter the reason if rejecting this agent"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#007A3D] focus:ring-2 focus:ring-[#007A3D]/20"
        />
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          disabled={loadingAction !== null}
          onClick={() => void reviewAgent("approved")}
          className="rounded-xl bg-[#007A3D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#005C2E] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loadingAction === "approved" ? "Approving..." : "Approve Agent"}
        </button>

        <button
          type="button"
          disabled={loadingAction !== null}
          onClick={() => void reviewAgent("rejected")}
          className="rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loadingAction === "rejected" ? "Rejecting..." : "Reject Agent"}
        </button>
      </div>

      <Toaster richColors />
    </div>
  );
}
