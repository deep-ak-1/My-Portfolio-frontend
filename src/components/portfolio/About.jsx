import GlassCard from '../ui/GlassCard.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';

export default function About({ profile }) {
  const bio = profile?.bio?.trim();
  return (
    <section id="about" aria-labelledby="about-title" className="scroll-mt-24 px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <SectionHeading eyebrow="About" title="Who I am" />
        <GlassCard className="p-6 sm:p-8">
          <p className="whitespace-pre-line leading-relaxed text-slate-200">
            {bio || 'Add your biography from the admin dashboard, under Profile.'}
          </p>
        </GlassCard>
      </div>
    </section>
  );
}
