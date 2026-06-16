type StatusBadgeProps = {
  status: "active" | "suspended" | "pending";
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    active: "bg-[#E6F4EC] text-[#005C2E]",
    suspended: "bg-red-100 text-red-700",
    pending: "bg-[#FFF7D6] text-[#7A5A00]",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-sm ${styles[status]}`}>
      {status}
    </span>
  );
}
