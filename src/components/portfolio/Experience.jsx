import GlassCard from '../ui/GlassCard.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';

function Timeline({ items, emptyText }) {
  if (items.length === 0) return <p className="text-slate-400">{emptyText}</p>;
  return (
    <ol className="space-y-4">
      {items.map((item) => (
        <li key={item._id}>
          <GlassCard className="p-5">
            <h3 className="font-semibold text-white">{item.role}</h3>
            <p className="text-sm text-cyan-200">{item.organization}</p>
            {(item.startDate || item.endDate || item.current) && (
              <p className="mt-1 text-xs text-slate-400">
                {item.startDate}
                {(item.endDate || item.current) && ' – '}
                {item.current ? 'Present' : item.endDate}
              </p>
            )}
            {item.description && <p className="mt-3 whitespace-pre-line text-sm text-slate-300">{item.description}</p>}
          </GlassCard>
        </li>
      ))}
    </ol>
  );
}

export default function Experience({ experience }) {
  const work = experience.filter((e) => e.type !== 'education');
  const education = experience.filter((e) => e.type === 'education');
  return (
    <section id="experience" aria-labelledby="experience-title" className="scroll-mt-24 px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Journey" title="Experience and education" />
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Experience</h3>
            <Timeline items={work} emptyText="No experience entries yet." />
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Education</h3>
            <Timeline items={education} emptyText="No education entries yet." />
          </div>
        </div>
      </div>
    </section>
  );
}
