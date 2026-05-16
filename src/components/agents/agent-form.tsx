import TextInput from "@/components/forms/text-input";
import SelectInput from "@/components/forms/select-input";

type AgentFormProps = {
  mode: "create" | "edit";
};

export default function AgentForm({ mode }: AgentFormProps) {
  const isEdit = mode === "edit";

  return (
    <form className="grid gap-6 md:grid-cols-2">
      <TextInput
        label="Full Name"
        placeholder="Enter full name"
        defaultValue={isEdit ? "John Doe" : undefined}
      />

      <TextInput
        label="Phone Number"
        placeholder="Enter phone number"
        defaultValue={isEdit ? "08012345678" : undefined}
      />

      <TextInput
        label="Business Name"
        placeholder="Enter business name"
        defaultValue={isEdit ? "Doe Ventures" : undefined}
      />

      <SelectInput
        label="Status"
        defaultValue={isEdit ? "Active" : undefined}
        options={["Active", "Pending", "Suspended"]}
      />

      <div className="md:col-span-2">
        <button className="rounded-lg bg-black px-6 py-2 text-white">
          {isEdit ? "Save Changes" : "Create Agent"}
        </button>
      </div>
    </form>
  );
}
