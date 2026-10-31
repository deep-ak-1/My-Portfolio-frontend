export default function Spinner({ label = 'Loading…' }) {
  return (
    <div role="status" className="flex items-center justify-center gap-3 py-10 text-slate-300">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" aria-hidden="true" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
