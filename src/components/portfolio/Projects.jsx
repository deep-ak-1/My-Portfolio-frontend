import GlassCard from '../ui/GlassCard.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';

export default function Projects({ projects }) {
  return (
    <section id="projects" aria-labelledby="projects-title" className="scroll-mt-24 px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Projects" title="Selected work" />
        {projects.length === 0 ? (
          <p className="text-center text-slate-400">No projects published yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <GlassCard key={project._id} as="article" className="flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(139,92,246,0.25)]">
                {project.imageUrl && (
                  <img src={project.imageUrl} alt={`Screenshot of ${project.title}`} loading="lazy" className="h-44 w-full object-cover" />
                )}
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                    {project.featured && (
                      <span className="shrink-0 rounded-full bg-purple-500/20 px-2 py-0.5 text-xs text-purple-200">Featured</span>
                    )}
                  </div>
                  {project.description && <p className="text-sm leading-relaxed text-slate-300">{project.description}</p>}
                  {project.technologies?.length > 0 && (
                    <ul className="flex flex-wrap gap-2" aria-label="Technologies">
                      {project.technologies.map((tech) => (
                        <li key={tech} className="tag">{tech}</li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-auto flex flex-wrap gap-3 pt-2">
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-glass">
                        GitHub<span className="sr-only"> for {project.title} (opens in new tab)</span>
                      </a>
                    )}
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                        Live demo<span className="sr-only"> for {project.title} (opens in new tab)</span>
                      </a>
                    )}
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
