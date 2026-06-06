type TextAreaProps = {
  name: string;
  label: string;
  placeholder?: string;
  defaultValue?: string;
};

export default function TextArea({
  name,
  label,
  placeholder,
  defaultValue,
}: TextAreaProps) {
  return (
    <div className="md:col-span-2">
      <label className="mb-2 block text-sm font-medium">{label}</label>

      <textarea
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        rows={4}
        className="w-full rounded-lg border px-4 py-2"
      />
    </div>
  );
}
