"use client";

export default function AgentsError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="rounded-xl border bg-white p-6">
      <h2 className="text-lg font-semibold">Unable to load agents</h2>

      <p className="mt-2 text-sm text-gray-500">
        Please confirm your session is still active and try again.
      </p>

      <button
        onClick={reset}
        className="mt-4 rounded-lg bg-black px-4 py-2 text-white"
      >
        Retry
      </button>
    </div>
  );
}
