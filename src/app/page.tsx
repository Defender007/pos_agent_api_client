import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#005C2E] via-[#007A3D] to-[#003F20] px-6 py-10 text-white">
      <section className="mx-auto grid min-h-[90vh] max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div>
          <div className="mb-6 inline-flex rounded-full border border-[#F9C80E]/40 bg-white/10 px-4 py-2 text-sm font-semibold text-[#F9C80E]">
            Fidelity Bank PLC • SoftPOS Merchant Portal
          </div>

          <h1 className="text-5xl font-black leading-tight tracking-tight md:text-7xl">
            Agent operations,
            <br />
            KYC & compliance
            <br />
            <span className="text-[#F9C80E]">in one portal.</span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-green-50">
            A secure management platform for onboarding SoftPOS agents,
            capturing KYC, enforcing digital indemnity acceptance, and managing
            operational status with RBAC-ready administration.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/login"
              className="rounded-xl bg-[#F9C80E] px-7 py-4 text-sm font-bold text-[#0F172A] shadow-lg transition hover:bg-[#FFE16A]"
            >
              Merchant Staff Login
            </Link>

            <Link
              href="/backoffice/login"
              className="rounded-xl border border-white/25 bg-white/10 px-7 py-4 text-sm font-bold text-white transition hover:bg-white/20"
            >
              Bank Staff Login
            </Link>

            <Link
              href="/indemnity"
              className="rounded-xl border border-white/25 bg-white/10 px-7 py-4 text-sm font-bold text-white transition hover:bg-white/20"
            >
              View Indemnity
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex gap-2">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-[#F9C80E]" />
              <span className="h-3 w-3 rounded-full bg-[#007A3D]" />
            </div>

            <p className="text-sm font-semibold text-green-50">
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
                <p className="mt-2 text-3xl font-black text-[#005C2E]">
                  {value}
                </p>
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
                <span className="rounded-full bg-[#FFF7D6] px-3 py-1 text-xs font-bold text-[#7A5A00]">
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
