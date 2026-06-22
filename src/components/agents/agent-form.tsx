"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Agent, CreateAgentPayload, UpdateAgentPayload } from "@/types/agent";

import { createAgentClient, updateAgentClient } from "@/lib/api/agents-client";
import { Toaster } from "@/components/ui/sonner";

import TextInput from "@/components/forms/text-input";
import SelectInput from "@/components/forms/select-input";
import TextArea from "@/components/forms/text-area";

type AgentFormProps = {
  mode: "create" | "edit";
  agentId?: string;
  agent?: Agent;
  statusOnly?: boolean;
  businessName?: string | null;
};

export default function AgentForm({
  mode,
  agentId,
  agent,
  statusOnly = false,
  businessName,
}: AgentFormProps) {
  const router = useRouter();
  const isEdit = mode === "edit";
  const resolvedBusinessName = isEdit ? agent?.businessName : businessName;
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const hasCapturedLocation = latitude !== null && longitude !== null;
  const canCreateAgent =
    mode !== "create" || (Boolean(resolvedBusinessName) && hasCapturedLocation);
  const statusOptions =
    agent?.status === "active"
      ? ["suspended", "rejected", "deactivated"]
      : ["active", "pending", "suspended"];

  const [indemnityAccepted, setIndemnityAccepted] = useState(false);

  function captureCurrentLocation() {
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError(
        "Your browser does not support location capture. Please use a browser with geolocation support.",
      );
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setLocationLoading(false);
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError(
            "Location permission was denied. Please allow location access to create this agent.",
          );
        } else {
          setLocationError(
            "Unable to capture your current location. Please try again.",
          );
        }

        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
      },
    );
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        if (mode === "create" && !resolvedBusinessName) {
          toast.error("Business name could not be resolved for your organization.");
          return;
        }

        if (mode === "create" && !indemnityAccepted) {
          toast.error("Please accept the indemnity before creating the agent.");
          return;
        }

        if (mode === "create" && !hasCapturedLocation) {
          toast.error(
            "Please capture the agent operating location before creating the agent.",
          );
          return;
        }

        const selectedStatus = String(formData.get("status"));

        if (
          agent?.status === "active" &&
          (selectedStatus === "pending" ||
            selectedStatus === "pending_approval")
        ) {
          toast.error("Active agents cannot be changed back to pending.");
          return;
        }

        const payload: CreateAgentPayload | UpdateAgentPayload = statusOnly
          ? {
              status: selectedStatus as CreateAgentPayload["status"],
            }
          : {
              agent_code: String(formData.get("agent_code")),
              first_name: String(formData.get("first_name")),
              last_name: String(formData.get("last_name")),
              phone: String(formData.get("phone")),
              email: String(formData.get("email")),
              business_name: String(formData.get("business_name")),
              status: selectedStatus as CreateAgentPayload["status"],
              kyc: {
                bvn: String(formData.get("bvn")),
                nin: String(formData.get("nin")),
                imei: String(formData.get("imei")),
                notes: String(formData.get("notes")),
              },
              ...(mode === "create"
                ? {
                    location: {
                      address: String(formData.get("location_address") || ""),
                      latitude: latitude as number,
                      longitude: longitude as number,
                      capture_method: "browser_geolocation",
                    },
                    indemnity: {
                      accepted: true,
                      version: "softpos-agent-profile-indemnity-v1",
                    },
                  }
                : {}),
            };

        try {
          if (mode === "edit") {
            if (!agentId) {
              throw new Error("Agent ID is required for update");
            }

            await updateAgentClient(agentId, payload);
          } else {
            await createAgentClient(payload as CreateAgentPayload);
          }

          router.push("/agents");
        } catch (error) {
          console.error(error);
          toast.error(
            error instanceof Error
              ? error.message
              : mode === "edit"
                ? "Failed to update agent"
                : "Failed to create agent",
          );
        }
      }}
      className="grid gap-6 md:grid-cols-2"
    >
      {statusOnly ? (
        <SelectInput
          name="status"
          label="Status"
          options={statusOptions}
          defaultValue={agent?.status}
        />
      ) : (
        <>
          <TextInput
            name="agent_code"
            label="Agent Code"
            placeholder="Enter agent code"
            defaultValue={isEdit ? agent?.agentCode : undefined}
          />

          <TextInput
            name="first_name"
            label="First Name"
            placeholder="Enter first name"
            defaultValue={isEdit ? agent?.firstName : undefined}
          />

          <TextInput
            name="last_name"
            label="Last Name"
            placeholder="Enter last name"
            defaultValue={isEdit ? agent?.lastName : undefined}
          />

          <TextInput
            name="phone"
            label="Phone Number"
            placeholder="Enter phone number"
            defaultValue={isEdit ? agent?.phone : undefined}
          />

          <TextInput
            name="email"
            label="Email"
            placeholder="Enter email address"
            defaultValue={isEdit ? agent?.email : undefined}
          />

          <TextInput
            name="business_name"
            label="Business Name"
            placeholder="Enter business name"
            defaultValue={resolvedBusinessName || undefined}
            readOnly={mode === "create"}
            helperText={
              mode === "create"
                ? "Sourced from your staff profile organization."
                : undefined
            }
          />

          {mode === "create" && !resolvedBusinessName && (
            <div className="md:col-span-2 rounded-lg border border-[#F9C80E]/40 bg-[#FFF7D6] p-4 text-sm text-[#7A5A00]">
              Business name could not be resolved from your staff profile.
              Please contact an administrator before creating an agent.
            </div>
          )}

          <TextInput
            name="bvn"
            label="BVN"
            placeholder="Enter BVN"
            defaultValue={isEdit ? agent?.kyc?.bvn : undefined}
          />

          <TextInput
            name="nin"
            label="NIN"
            placeholder="Enter NIN"
            defaultValue={isEdit ? agent?.kyc?.nin : undefined}
          />

          <TextInput
            name="imei"
            label="IMEI"
            placeholder="Enter device IMEI"
            defaultValue={isEdit ? agent?.kyc?.imei : undefined}
          />
          <SelectInput
            name="status"
            label="Status"
            options={statusOptions}
            defaultValue={isEdit ? agent?.status : undefined}
          />
          <TextArea
            name="notes"
            label="KYC Notes"
            placeholder="Enter onboarding notes"
            defaultValue={isEdit ? agent?.kyc?.notes : undefined}
          />

          {mode === "create" && (
            <div className="md:col-span-2 rounded-lg border bg-slate-50 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Agent Operating Location
                  </h3>
                  <p className="text-sm text-slate-500">
                    Capture the agent location from this browser before creating
                    the agent.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={captureCurrentLocation}
                  disabled={locationLoading}
                  className="rounded-lg bg-[#007A3D] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#005C2E] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {locationLoading ? "Getting location..." : "Use Current Location"}
                </button>
              </div>

              {locationError && (
                <p className="mt-3 text-sm font-medium text-red-600">
                  {locationError}
                </p>
              )}

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium">
                    Address
                  </label>
                  <input
                    name="location_address"
                    placeholder="Enter operating location address"
                    className="w-full rounded-lg border bg-white px-4 py-2"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Latitude
                  </label>
                  <input
                    name="latitude"
                    value={latitude ?? ""}
                    readOnly
                    placeholder="Capture current location"
                    className="w-full rounded-lg border bg-white px-4 py-2 text-slate-600"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Longitude
                  </label>
                  <input
                    name="longitude"
                    value={longitude ?? ""}
                    readOnly
                    placeholder="Capture current location"
                    className="w-full rounded-lg border bg-white px-4 py-2 text-slate-600"
                  />
                </div>
              </div>
            </div>
          )}

          {mode === "create" && (
            <div className="md:col-span-2 rounded-lg border bg-gray-50 p-4">
              <label className="flex items-center space-x-3 text-sm leading-relaxed">
                <input
                  type="checkbox"
                  checked={indemnityAccepted}
                  onChange={(e) => setIndemnityAccepted(e.target.checked)}
                  className="h-4 w-4 shrink-0"
                />

                <span style={{ marginLeft: "10px" }}>
                  I confirm that I have reviewed and accepted the{" "}
                  <Link
                    href="/indemnity"
                    target="_blank"
                    className="font-medium underline"
                  >
                    SoftPOS Agent Digital Indemnity
                  </Link>{" "}
                  for this onboarding.
                </span>
              </label>
            </div>
          )}
        </>
      )}

      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={mode === "create" && (!indemnityAccepted || !canCreateAgent)}
          className="rounded-lg bg-[#007A3D] px-6 py-2 font-semibold text-white transition hover:bg-[#005C2E] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
        >
          {statusOnly
            ? "Update Status"
            : isEdit
              ? "Save Changes"
              : "Create Agent"}
        </button>
      </div>

      <Toaster richColors />
    </form>
  );
}
