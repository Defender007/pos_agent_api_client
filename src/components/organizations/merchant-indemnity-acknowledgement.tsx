"use client";

export const MERCHANT_INDEMNITY_TEXT =
  "I confirm that this merchant has been duly reviewed and acknowledge that the bank is not responsible for actions performed by the merchant or its authorised staff.";

type MerchantIndemnityAcknowledgementProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  error?: string | null;
  compact?: boolean;
};

export default function MerchantIndemnityAcknowledgement({
  checked,
  onCheckedChange,
  error,
  compact = false,
}: MerchantIndemnityAcknowledgementProps) {
  return (
    <section
      className={`rounded-2xl border border-[#BFDCCB] bg-[#E6F4EC] ${
        compact ? "p-4" : "p-5"
      }`}
    >
      <h2 className="text-lg font-bold text-[#005C2E]">
        Merchant Indemnity Acknowledgement
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-700">
        {MERCHANT_INDEMNITY_TEXT}
      </p>

      <label className="mt-4 flex items-start gap-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onCheckedChange(event.target.checked)}
          className="mt-1 h-4 w-4 rounded border-slate-300 text-[#007A3D] accent-[#007A3D]"
        />

        <span className="text-sm font-semibold text-slate-800">
          I have reviewed and accept the Merchant Indemnity Acknowledgement.
        </span>
      </label>

      {error ? <p className="mt-3 text-sm font-medium text-red-600">{error}</p> : null}
    </section>
  );
}

