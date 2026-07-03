"use client";

import { MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import BillerSelect from "@/components/billers/biller-select";
import { ApiError } from "@/lib/api/api-error";
import { createSolopreneurAgent } from "@/lib/api/solopreneur-agents-client";
import {
  BUSINESS_SEGMENTS,
  type BusinessSegment,
} from "@/lib/business-segments";
import { Toaster } from "@/components/ui/sonner";

export default function SolopreneurAgentForm() {
  const router = useRouter();
  const [businessSegment, setBusinessSegment] = useState<
    BusinessSegment | ""
  >("");
  const [billerId, setBillerId] = useState("");
  const [billerError, setBillerError] = useState<string | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const hasCapturedLocation = latitude !== null && longitude !== null;

  function captureCurrentLocation() {
    setLocationError(null);

    if (!navigator.geolocation) {
      const message =
        "Your browser does not support location capture. Please use a browser with geolocation support.";
      setLocationError(message);
      toast.error(message);
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setLocationLoading(false);
        toast.success("Current location captured");
      },
      (error) => {
        const message =
          error.code === error.PERMISSION_DENIED
            ? "Location permission was denied. Please allow location access to create this agent."
            : "Unable to capture your current location. Please try again.";

        setLocationError(message);
        setLocationLoading(false);
        toast.error(message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
      },
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!hasCapturedLocation) {
      toast.error("Please capture the agent operating location.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const businessSegmentOther = String(
      formData.get("business_segment_other") || "",
    ).trim();

    if (!businessSegment) {
      toast.error("Please select a business segment.");
      return;
    }

    if (businessSegment === "others" && !businessSegmentOther) {
      toast.error("Please specify the other business industry.");
      return;
    }

    if (!billerId) {
      const message = "Please select a biller";
      setBillerError(message);
      toast.error(message);
      return;
    }

    setSubmitting(true);

    try {
      const middleName = String(formData.get("middle_name") || "").trim();
      const registrationNumber = String(
        formData.get("registration_number") || "",
      ).trim();

      await createSolopreneurAgent({
        first_name: String(formData.get("first_name")).trim(),
        middle_name: middleName || null,
        last_name: String(formData.get("last_name")).trim(),
        phone: String(formData.get("phone")).trim(),
        email: String(formData.get("email")).trim(),
        business_name: String(formData.get("business_name")).trim(),
        registration_number: registrationNumber || null,
        business_segment: businessSegment,
        business_segment_other:
          businessSegment === "others" ? businessSegmentOther : null,
        biller_id: billerId,
        kyc: {
          bvn: String(formData.get("bvn")).trim(),
          nin: String(formData.get("nin")).trim(),
          imei: String(formData.get("imei")).trim(),
          notes: String(formData.get("notes") || "").trim(),
        },
        location: {
          address: String(formData.get("address")).trim(),
          latitude: latitude as number,
          longitude: longitude as number,
          capture_method: "browser_geolocation",
        },
      });

      toast.success("Solopreneur agent created successfully");
      setTimeout(() => {
        router.push("/backoffice/agents/approvals");
      }, 700);
    } catch (error) {
      if (error instanceof ApiError && error.message === "SESSION_EXPIRED") {
        router.push("/backoffice/login?session=expired");
        return;
      }

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to create Solopreneur agent.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <FormSection
        title="Agent Information"
        description="Personal and trading details for the Solopreneur agent"
      >
        <FormField
          name="first_name"
          label="First Name"
          placeholder="e.g. Bright"
          required
        />
        <FormField
          name="middle_name"
          label="Middle Name"
          placeholder="e.g. Chidinma"
        />
        <FormField
          name="last_name"
          label="Last Name"
          placeholder="e.g. Nkiruka"
          required
        />
        <FormField
          name="phone"
          label="Phone"
          type="tel"
          placeholder="e.g. 2347054837911"
          required
        />
        <FormField
          name="email"
          label="Email"
          type="email"
          placeholder="e.g. bright@example.com"
          required
        />
      </FormSection>

      <FormSection
        title="Business Details"
        description="Select the industry that best describes the business"
      >
        <FormField
          name="business_name"
          label="Business Name"
          placeholder="e.g. Brinka Ventures"
          required
        />
        <FormField
          name="registration_number"
          label="Registration Number / RC Number"
          placeholder="e.g. RC1234567"
        />

        <div className="md:col-span-2">
          <BillerSelect
            value={billerId}
            onValueChange={(value) => {
              setBillerId(value);
              if (value) setBillerError(null);
            }}
            required
            error={billerError || undefined}
            authContext="bank"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Business Segment/Industry
          </label>

          <select
            name="business_segment"
            value={businessSegment}
            onChange={(event) =>
              setBusinessSegment(event.target.value as BusinessSegment | "")
            }
            required
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
          >
            <option value="" disabled>
              Select business segment
            </option>
            {BUSINESS_SEGMENTS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {businessSegment === "others" && (
          <FormField
            name="business_segment_other"
            label="Specify Other Industry"
            placeholder="Specify business segment"
            required
            className="md:col-span-2"
          />
        )}
      </FormSection>

      <FormSection
        title="KYC Information"
        description="Identity and device verification details"
      >
        <FormField
          name="bvn"
          label="BVN"
          placeholder="e.g. 12345678901"
          required
        />
        <FormField
          name="nin"
          label="NIN"
          placeholder="e.g. 12345678901"
          required
        />
        <FormField
          name="imei"
          label="IMEI"
          placeholder="e.g. 356789123456789"
          required
        />

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Notes
          </label>
          <textarea
            name="notes"
            rows={4}
            placeholder="Additional onboarding notes"
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />
        </div>
      </FormSection>

      <FormSection
        title="Operating Location"
        description="Capture the physical location where the agent operates"
      >
        <FormField
          name="address"
          label="Address"
          placeholder="e.g. 15 Ojuolape Street, Abuja"
          required
          className="md:col-span-2"
        />

        <FormField
          name="latitude"
          label="Latitude"
          value={latitude ?? ""}
          readOnly
          placeholder="Capture current location"
        />
        <FormField
          name="longitude"
          label="Longitude"
          value={longitude ?? ""}
          readOnly
          placeholder="Capture current location"
        />

        <div className="md:col-span-2">
          <button
            type="button"
            onClick={captureCurrentLocation}
            disabled={locationLoading}
            className="inline-flex items-center gap-2 rounded-xl border border-[#BFDCCB] bg-[#E6F4EC] px-5 py-3 text-sm font-semibold text-[#005C2E] transition hover:bg-[#D6EBDD] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <MapPin size={17} />
            {locationLoading ? "Getting Location..." : "Use Current Location"}
          </button>

          {locationError && (
            <p className="mt-3 text-sm font-medium text-red-600">
              {locationError}
            </p>
          )}
        </div>
      </FormSection>

      <div className="flex justify-end border-t border-slate-200 pt-6">
        <button
          type="submit"
          disabled={submitting || !hasCapturedLocation || !billerId}
          className="rounded-xl bg-[#007A3D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#005C2E] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Creating Agent..." : "Create Solopreneur Agent"}
        </button>
      </div>

      <Toaster richColors />
    </form>
  );
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2">{children}</div>
    </section>
  );
}

function FormField({
  name,
  label,
  type = "text",
  required = false,
  readOnly = false,
  value,
  placeholder,
  className = "",
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  readOnly?: boolean;
  value?: string | number;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        readOnly={readOnly}
        value={value}
        placeholder={placeholder}
        className={`w-full rounded-xl border border-slate-300 px-4 py-3 ${
          readOnly ? "bg-slate-50 text-slate-600" : "bg-white"
        }`}
      />
    </div>
  );
}
