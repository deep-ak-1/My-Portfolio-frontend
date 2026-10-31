import GlassCard from '../ui/GlassCard.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';

const SOCIAL_LABELS = { github: 'GitHub', linkedin: 'LinkedIn', twitter: 'X / Twitter', website: 'Website' };

export default function Contact({ profile }) {
  const socials = Object.entries(profile?.socials || {}).filter(([, url]) => Boolean(url));
  return (
    <section id="contact" aria-labelledby="contact-title" className="scroll-mt-24 px-4 pb-20 pt-16">
      <div className="mx-auto max-w-3xl">
        <SectionHeading eyebrow="Contact" title="Let's build something" description="Reach out for projects, roles, or collaboration." />
        <GlassCard className="flex flex-col items-center gap-6 p-8 text-center">
          {profile?.email ? (
            <a href={`mailto:${profile.email}`} className="btn-primary">Email {profile.email}</a>
          ) : (
            <p className="text-slate-400">Add your contact email from the admin dashboard.</p>
          )}
          {profile?.resumeUrl && (
            <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-glass">
              Download resume<span className="sr-only"> (opens in new tab)</span>
            </a>
          )}
          {socials.length > 0 && (
            <ul className="flex flex-wrap justify-center gap-3" aria-label="Social links">
              {socials.map(([key, url]) => (
                <li key={key}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="btn-glass">
                    {SOCIAL_LABELS[key] || key}<span className="sr-only"> (opens in new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </GlassCard>
      </div>
    </section>
  );
}
