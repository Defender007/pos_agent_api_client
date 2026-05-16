type DataTableProps = {
  headers: string[];
  children: React.ReactNode;
};

export default function DataTable({ headers, children }: DataTableProps) {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b text-left">
          {headers.map((header) => (
            <th key={header} className="py-3">
              {header}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>{children}</tbody>
    </table>
  );
}
