type PageTitleProps = {
  title: string;
  description?: string;
};

export default function PageTitle({ title, description }: PageTitleProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold">{title}</h1>

      {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>
  );
}
