"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import MerchantIndemnityAcknowledgement from "@/components/organizations/merchant-indemnity-acknowledgement";
import { Toaster } from "@/components/ui/sonner";
import { recordOrganizationMerchantIndemnity } from "@/lib/api/organizations";

type RecordMerchantIndemnityButtonProps = {
  organizationId: string;
};

const REQUIRED_MESSAGE = "Merchant indemnity acknowledgement is required";

export default function RecordMerchantIndemnityButton({
  organizationId,
}: RecordMerchantIndemnityButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    if (!accepted) {
      setError(REQUIRED_MESSAGE);
      toast.error(REQUIRED_MESSAGE);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await recordOrganizationMerchantIndemnity(organizationId, {
        indemnity_accepted: true,
      });
      toast.success("Merchant indemnity recorded successfully");
      setOpen(false);
      setAccepted(false);
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to record merchant indemnity";

      if (message === "SESSION_EXPIRED") {
        router.push("/backoffice/login?session=expired");
        return;
      }

      toast.error(message);

      if (message === "Merchant indemnity has already been recorded") {
        router.refresh();
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setError(null);
        }}
        className="rounded-xl bg-[#007A3D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#005C2E]"
      >
        Record Indemnity
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Record Merchant Indemnity
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Confirm the acknowledgement before recording this legacy
                  organisation.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Close
              </button>
            </div>

            <MerchantIndemnityAcknowledgement
              checked={accepted}
              onCheckedChange={(checked) => {
                setAccepted(checked);
                if (checked) setError(null);
              }}
              error={error}
              compact
            />

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={!accepted || submitting}
                onClick={submit}
                className="rounded-xl bg-[#007A3D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#005C2E] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Recording..." : "Record Indemnity"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <Toaster richColors />
    </>
  );
}

