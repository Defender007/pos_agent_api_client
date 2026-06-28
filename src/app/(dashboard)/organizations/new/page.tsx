"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import MerchantIndemnityAcknowledgement from "@/components/organizations/merchant-indemnity-acknowledgement";
import { createOrganization } from "@/lib/api/organizations";
import {
  BUSINESS_SEGMENTS,
  type BusinessSegment,
} from "@/lib/business-segments";
import { Toaster } from "@/components/ui/sonner";

export default function NewOrganizationPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [businessSegment, setBusinessSegment] =
    useState<BusinessSegment>("fast_foods");
  const [indemnityAccepted, setIndemnityAccepted] = useState(false);
  const [indemnityError, setIndemnityError] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-black text-slate-900">
        Create Organization
      </h1>

      <p className="mt-2 text-sm text-slate-500">
        Register a new merchant organization
      </p>

      <form
        className="mt-8 grid gap-6 md:grid-cols-2"
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);

          const formData = new FormData(e.currentTarget);
          const businessSegmentOther = String(
            formData.get("business_segment_other") || "",
          ).trim();
          const registrationNumber = String(
            formData.get("registration_number") || "",
          ).trim();
          const organizationCode = String(formData.get("code") || "").trim();

          if (businessSegment === "others" && !businessSegmentOther) {
            toast.error("Please specify the other business industry.");
            setLoading(false);
            return;
          }

          if (!indemnityAccepted) {
            const message = "Merchant indemnity acknowledgement is required";
            setIndemnityError(message);
            toast.error(message);
            setLoading(false);
            return;
          }

          try {
            await createOrganization({
              name: String(formData.get("name")),
              code: organizationCode || null,
              registration_number: registrationNumber || null,
              contact_email: String(formData.get("contact_email") || ""),
              contact_phone: String(formData.get("contact_phone") || ""),
              address: String(formData.get("address") || ""),
              organization_type: "standard",
              business_segment: businessSegment,
              business_segment_other:
                businessSegment === "others" ? businessSegmentOther : null,
              is_active: formData.get("is_active") === "on",
              indemnity_accepted: true,
            });

            router.push("/organizations");
          } catch (error) {
            console.error(error);
            toast.error(
              error instanceof Error
                ? error.message
                : "Failed to create organization",
            );
          } finally {
            setLoading(false);
          }
        }}
      >
        {[
          ["name", "Organization Name", "Enter organization name"],
          [
            "code",
            "Organization Code",
            "Enter organization code, if applicable",
          ],
          [
            "registration_number",
            "Registration Number / RC Number",
            "Enter registration or RC number, if applicable",
          ],
          ["contact_email", "Contact Email", "Enter contact email"],
          ["contact_phone", "Contact Phone", "Enter contact phone"],
        ].map(([name, label, placeholder]) => (
          <div key={name}>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              {label}
            </label>

            <input
              name={name}
              placeholder={placeholder}
              required={name === "name"}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>
        ))}

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Business Segment/Industry
          </label>

          <select
            name="business_segment"
            value={businessSegment}
            onChange={(event) =>
              setBusinessSegment(event.target.value as BusinessSegment)
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
          >
            {BUSINESS_SEGMENTS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {businessSegment === "others" && (
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Specify Other Industry
            </label>
            <input
              name="business_segment_other"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>
        )}

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Address
          </label>

          <textarea
            name="address"
            rows={4}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center gap-3">
            <input type="checkbox" name="is_active" defaultChecked />

            <span className="text-sm font-medium">Active Organization</span>
          </label>
        </div>

        <div className="md:col-span-2">
          <MerchantIndemnityAcknowledgement
            checked={indemnityAccepted}
            onCheckedChange={(checked) => {
              setIndemnityAccepted(checked);
              if (checked) setIndemnityError(null);
            }}
            error={indemnityError}
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading || !indemnityAccepted}
            className="rounded-xl bg-[#007A3D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#005C2E] disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Organization"}
          </button>
        </div>
      </form>

      <Toaster richColors />
    </div>
  );
}
