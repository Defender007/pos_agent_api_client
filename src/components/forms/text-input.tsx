type TextInputProps = {
  label: string;
  placeholder?: string;
  defaultValue?: string;
};

export default function TextInput({
  label,
  placeholder,
  defaultValue,
}: TextInputProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>

      <input
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full rounded-lg border px-4 py-2"
      />
    </div>
  );
}
