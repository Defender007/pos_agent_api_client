import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <section className="mx-auto grid min-h-[90vh] max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div>
          <div
            className="mb-6 inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-amber-300"
            style={{ color: "#7dd10f" }}
          >
            Fidelity Bank PLC • SoftPOS Merchant Portal
          </div>

          <h1 className="text-5xl font-black leading-tight tracking-tight md:text-7xl">
            Agent operations,
            <br />
            KYC & compliance
            <br />
            <span className="text-amber-400">in one portal.</span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
            A secure management platform for onboarding SoftPOS agents,
            capturing KYC, enforcing digital indemnity acceptance, and managing
            operational status with RBAC-ready administration.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/login"
              className="rounded-xl bg-amber-400 px-7 py-4 text-sm font-bold text-slate-950 shadow-lg hover:bg-amber-300"
            >
              Staff Login
            </Link>

            <Link
              href="/indemnity"
              className="rounded-xl border border-white/20 bg-white/10 px-7 py-4 text-sm font-bold text-white hover:bg-white/20"
            >
              View Indemnity
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex gap-2">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-amber-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
            </div>

            <p className="text-sm font-semibold text-slate-300">
              Operations Dashboard
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Total Agents", "128"],
              ["Pending KYC", "24"],
              ["Active Agents", "97"],
              ["Suspended", "7"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl bg-white p-5 text-slate-900"
              >
                <p className="text-sm font-semibold text-slate-500">{label}</p>
                <p className="mt-2 text-3xl font-black">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl bg-white p-5 text-slate-900">
            {["FMC-2224456", "AGT-009812", "AGT-001245"].map((code) => (
              <div
                key={code}
                className="flex items-center justify-between border-b border-slate-200 py-3 last:border-0"
              >
                <span className="font-medium">{code}</span>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                  Pending
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
