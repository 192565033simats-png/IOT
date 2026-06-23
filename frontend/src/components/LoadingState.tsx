export default function LoadingState() {
  return (
    <div className="space-y-4">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="h-20 rounded-3xl border border-slate-200 bg-slate-100 p-4 animate-pulse" />
      ))}
    </div>
  )
}
