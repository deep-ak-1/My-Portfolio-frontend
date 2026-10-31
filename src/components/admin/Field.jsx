export const inputClass =
  'w-full rounded-xl border border-white/15 bg-slate-900/60 px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40';

export default function Field({ label, id, error, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-slate-200">{label}</label>
      {children}
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
      {error && <p role="alert" className="text-xs text-rose-300">{error}</p>}
    </div>
  );
}
