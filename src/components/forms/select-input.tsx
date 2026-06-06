type SelectInputProps = {
  name: string;
  label: string;
  options: string[];
  defaultValue?: string;
};

export default function SelectInput({
  name,
  label,
  options,
  defaultValue,
}: SelectInputProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>

      <select
        name={name}
        defaultValue={defaultValue}
        className="w-full rounded-lg border px-4 py-2"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
