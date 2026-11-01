'use client'

export default function AppError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-6">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 text-center shadow-sm">
        <div className="text-xl font-semibold">This view needs another try</div>
        <div className="mt-2 text-sm text-zinc-600">Please retry. If authentication is not configured yet, you can continue browsing as a guest.</div>
        <button className="mt-6 rounded-lg bg-[#FFC400] px-4 py-2 text-sm font-semibold text-[#17140A]" onClick={reset}>Retry</button>
      </div>
    </div>
  )
}
