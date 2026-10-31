import Hero from '../components/portfolio/Hero.jsx';
import About from '../components/portfolio/About.jsx';
import Skills from '../components/portfolio/Skills.jsx';
import Projects from '../components/portfolio/Projects.jsx';
import Experience from '../components/portfolio/Experience.jsx';
import Contact from '../components/portfolio/Contact.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import usePortfolioData from '../hooks/usePortfolioData.js';
import { updateCachedProfile } from '../hooks/useProfile.js';
import { useEffect } from 'react';

export default function Home() {
  const { loading, profile, projects, skills, experience, error } = usePortfolioData();

  useEffect(() => {
    if (profile) updateCachedProfile(profile);
  }, [profile]);

  if (loading) return <Spinner label="Loading portfolio…" />;

  return (
    <>
      {error && (
        <div role="alert" className="mx-auto mt-4 max-w-3xl rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
          {error}
        </div>
      )}
      <Hero profile={profile} />
      <About profile={profile} />
      <Skills skills={skills} />
      <Projects projects={projects} />
      <Experience experience={experience} />
      <Contact profile={profile} />
    </>
  );
}
