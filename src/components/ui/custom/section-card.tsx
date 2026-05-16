type SectionCardProps = {
  children: React.ReactNode;
};

export default function SectionCard({ children }: SectionCardProps) {
  return <div className="rounded-xl border bg-white p-6">{children}</div>;
}
