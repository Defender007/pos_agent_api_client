type StatusBadgeProps = {
  status: "active" | "suspended" | "pending";
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    active: "bg-green-100 text-green-700",
    suspended: "bg-red-100 text-red-700",
    pending: "bg-yellow-100 text-yellow-700",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-sm ${styles[status]}`}>
      {status}
    </span>
  );
}
