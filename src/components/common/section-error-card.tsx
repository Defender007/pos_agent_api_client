type SectionErrorCardProps = {
  title: string;
  message: string;
};

export default function SectionErrorCard({
  title,
  message,
}: SectionErrorCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
        {message}
      </p>
    </div>
  );
}

export type { SectionErrorCardProps };
