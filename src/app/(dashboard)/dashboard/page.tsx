import Link from "next/link";
import PageContainer from "@/components/layout/page-container";

export default function DashboardPage() {
  return (
    <PageContainer>
      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border bg-white p-6">
          <h3 className="text-sm text-gray-500">Total Agents</h3>
          <p className="mt-2 text-3xl font-bold">245</p>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <h3 className="text-sm text-gray-500">Active Agents</h3>
          <p className="mt-2 text-3xl font-bold">210</p>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <h3 className="text-sm text-gray-500">Suspended Agents</h3>
          <p className="mt-2 text-3xl font-bold">12</p>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <h3 className="text-sm text-gray-500">Total Users</h3>
          <p className="mt-2 text-3xl font-bold">18</p>
        </div>
      </div>

      {/* Recent Agents */}
      <div className="rounded-xl border bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Agents</h2>

          <Link
            href="/agents/new"
            className="rounded-lg bg-black px-4 py-2 text-sm text-white"
          >
            Add Agent
          </Link>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b text-left">
              <th className="py-3">Agent Code</th>
              <th className="py-3">Name</th>
              <th className="py-3">Phone</th>
              <th className="py-3">Status</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-b">
              <td className="py-4">AGT-001</td>
              <td className="py-4">John Doe</td>
              <td className="py-4">08012345678</td>
              <td className="py-4">
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                  Active
                </span>
              </td>
            </tr>

            <tr className="border-b">
              <td className="py-4">AGT-002</td>
              <td className="py-4">Mary Johnson</td>
              <td className="py-4">08087654321</td>
              <td className="py-4">
                <span className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-700">
                  Suspended
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </PageContainer>
  );
}
