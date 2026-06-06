"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Agent, CreateAgentPayload, UpdateAgentPayload } from "@/types/agent";

import { createAgentClient, updateAgentClient } from "@/lib/api/agents-client";

import TextInput from "@/components/forms/text-input";
import SelectInput from "@/components/forms/select-input";
import TextArea from "@/components/forms/text-area";

type AgentFormProps = {
  mode: "create" | "edit";
  agentId?: string;
  agent?: Agent;
  statusOnly?: boolean;
};

export default function AgentForm({
  mode,
  agentId,
  agent,
  statusOnly = false,
}: AgentFormProps) {
  const router = useRouter();
  const isEdit = mode === "edit";

  const [indemnityAccepted, setIndemnityAccepted] = useState(false);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        if (mode === "create" && !indemnityAccepted) {
          alert("Please accept the indemnity before creating the agent.");
          return;
        }

        const payload: CreateAgentPayload | UpdateAgentPayload = statusOnly
          ? {
              status: String(
                formData.get("status"),
              ) as CreateAgentPayload["status"],
            }
          : {
              agent_code: String(formData.get("agent_code")),
              first_name: String(formData.get("first_name")),
              last_name: String(formData.get("last_name")),
              phone: String(formData.get("phone")),
              email: String(formData.get("email")),
              business_name: String(formData.get("business_name")),
              status: String(
                formData.get("status"),
              ) as CreateAgentPayload["status"],
              kyc: {
                bvn: String(formData.get("bvn")),
                nin: String(formData.get("nin")),
                imei: String(formData.get("imei")),
                notes: String(formData.get("notes")),
              },
              ...(mode === "create"
                ? {
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

          alert(
            mode === "edit"
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
          options={["active", "pending", "suspended"]}
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
            defaultValue={isEdit ? agent?.businessName : undefined}
          />

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
            options={["active", "pending", "suspended"]}
            defaultValue={isEdit ? agent?.status : undefined}
          />
          <TextArea
            name="notes"
            label="KYC Notes"
            placeholder="Enter onboarding notes"
            defaultValue={isEdit ? agent?.kyc?.notes : undefined}
          />

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
          disabled={mode === "create" && !indemnityAccepted}
          className="rounded-lg bg-black px-6 py-2 text-white disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
        >
          {statusOnly
            ? "Update Status"
            : isEdit
              ? "Save Changes"
              : "Create Agent"}
        </button>
      </div>
    </form>
  );
}
