import Sidebar from "@/components/layout/sidebar";
import TopHeader from "@/components/layout/top-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />
      {/* Main Content */}
      <main className="flex-1 bg-gray-50">
        <TopHeader />

        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
