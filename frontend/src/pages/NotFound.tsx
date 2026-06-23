import { Link } from 'react-router-dom'
import { ArrowLeftRight } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="grid min-h-[60vh] place-items-center text-center">
      <div className="max-w-xl rounded-3xl border border-slate-200 bg-white p-12 shadow-sm">
        <ArrowLeftRight className="mx-auto h-10 w-10 text-slate-400" />
        <p className="mt-6 text-sm uppercase tracking-[0.24em] text-slate-500">Page not found</p>
        <h2 className="mt-4 text-3xl font-semibold text-slate-900">Oh no, that route is not valid.</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">Return to the main dashboard to continue monitoring your environment.</p>
        <Link
          to="/"
          className="mt-8 inline-flex rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  )
}
