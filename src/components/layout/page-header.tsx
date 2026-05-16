import PageTitle from "@/components/layout/page-title";

type PageHeaderProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export default function PageHeader({
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <PageTitle title={title} description={description} />

      {action && <div>{action}</div>}
    </div>
  );
}
