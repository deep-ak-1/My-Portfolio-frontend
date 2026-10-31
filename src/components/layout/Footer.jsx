import useProfile from '../../hooks/useProfile.js';

export default function Footer() {
  const { profile } = useProfile();
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/10 py-8 text-center text-sm text-slate-400">
      <p>© {year} {profile?.fullName || 'Portfolio'}. Built with React, Express, and MongoDB.</p>
    </footer>
  );
}
