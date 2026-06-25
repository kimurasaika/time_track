export default function StatCard({ label, value, emoji }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-pink-100 p-5 flex flex-col items-center gap-1">
      <span className="text-2xl">{emoji}</span>
      <span className="text-xs font-600 uppercase tracking-wider text-pink-300">{label}</span>
      <span className="text-3xl font-800 text-pink-500">{value}</span>
    </div>
  )
}
