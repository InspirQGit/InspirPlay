'use client'

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-zinc-50 p-6 text-zinc-950">
        <div className="w-full max-w-md rounded-2xl border bg-white p-8 text-center shadow-sm">
          <div className="text-xl font-semibold">InspirQ could not load this view</div>
          <div className="mt-2 text-sm text-zinc-600">Your session and data are safe. Try loading the view again.</div>
          <button className="mt-6 rounded-lg bg-[#FFC400] px-4 py-2 text-sm font-semibold text-[#17140A]" onClick={reset}>Try again</button>
        </div>
      </body>
    </html>
  )
}
