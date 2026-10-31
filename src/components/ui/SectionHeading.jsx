export default function SectionHeading({ eyebrow, title, description }) {
  return (
    <header className="mb-10 text-center">
      {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">{eyebrow}</p>}
      <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">{title}</h2>
      {description && <p className="mx-auto mt-3 max-w-2xl text-slate-300">{description}</p>}
    </header>
  );
}
