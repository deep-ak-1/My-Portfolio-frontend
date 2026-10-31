import GlassCard from '../ui/GlassCard.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';

export default function Skills({ skills }) {
  const groups = skills.reduce((acc, skill) => {
    (acc[skill.category || 'General'] ||= []).push(skill);
    return acc;
  }, {});

  return (
    <section id="skills" aria-labelledby="skills-title" className="scroll-mt-24 px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Skills" title="What I work with" />
        {skills.length === 0 ? (
          <p className="text-center text-slate-400">No skills published yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(groups).map(([category, items]) => (
              <GlassCard key={category} className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-white">{category}</h3>
                <ul className="space-y-4">
                  {items.map((skill) => (
                    <li key={skill._id}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="text-slate-200">{skill.name}</span>
                        {typeof skill.level === 'number' && <span className="text-slate-400">{skill.level}%</span>}
                      </div>
                      {typeof skill.level === 'number' && (
                        <div
                          className="h-2 overflow-hidden rounded-full bg-white/10"
                          role="progressbar"
                          aria-label={`${skill.name} proficiency`}
                          aria-valuenow={skill.level}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        >
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
