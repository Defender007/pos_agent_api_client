type TextInputProps = {
  name: string;
  label: string;
  placeholder?: string;
  defaultValue?: string;
  readOnly?: boolean;
  helperText?: string;
};

export default function TextInput({
  name,
  label,
  placeholder,
  defaultValue,
  readOnly = false,
  helperText,
}: TextInputProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>

      <input
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`w-full rounded-lg border px-4 py-2 ${
          readOnly ? "bg-slate-50 text-slate-600" : ""
        }`}
      />

      {helperText && <p className="mt-2 text-xs text-slate-500">{helperText}</p>}
    </div>
  );
}
