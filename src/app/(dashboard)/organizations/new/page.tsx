"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

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

          if (businessSegment === "others" && !businessSegmentOther) {
            toast.error("Please specify the other business industry.");
            setLoading(false);
            return;
          }

          try {
            await createOrganization({
              name: String(formData.get("name")),
              code: String(formData.get("code") || ""),
              registration_number: String(
                formData.get("registration_number") || "",
              ),
              contact_email: String(formData.get("contact_email") || ""),
              contact_phone: String(formData.get("contact_phone") || ""),
              address: String(formData.get("address") || ""),
              organization_type: "standard",
              business_segment: businessSegment,
              business_segment_other:
                businessSegment === "others" ? businessSegmentOther : null,
              is_active: formData.get("is_active") === "on",
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
          ["name", "Organization Name"],
          ["code", "Organization Code"],
          ["registration_number", "Registration Number"],
          ["contact_email", "Contact Email"],
          ["contact_phone", "Contact Phone"],
        ].map(([name, label]) => (
          <div key={name}>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              {label}
            </label>

            <input
              name={name}
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
          <button
            type="submit"
            disabled={loading}
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
