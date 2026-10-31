import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import useProfile from '../../hooks/useProfile.js';
import ProfilePhoto from '../ui/ProfilePhoto.jsx';

const SECTION_LINKS = [
  ['About', 'about'],
  ['Skills', 'skills'],
  ['Projects', 'projects'],
  ['Experience', 'experience'],
  ['Contact', 'contact'],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { admin, logout } = useAuth();
  const { profile } = useProfile();
  const location = useLocation();
  const onHome = location.pathname === '/';
  const brand = profile?.fullName || 'Portfolio';

  // On other pages, section links jump back to the homepage first.
  const hrefFor = (id) => (onHome ? `#${id}` : `/#${id}`);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/60 backdrop-blur-xl">
      <nav aria-label="Main navigation" className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link
          to="/"
          aria-label={`${brand} – go to homepage`}
          className="flex min-w-0 items-center gap-3 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        >
          <span className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-cyan-400/60 shadow-[0_0_12px_rgba(34,211,238,0.35)]">
            <ProfilePhoto src={profile?.photoUrl} name={profile?.fullName} className="h-full w-full" alt="" />
          </span>
          <span className="truncate font-semibold text-white">{brand}</span>
        </Link>

        <ul className="hidden items-center gap-6 md:flex">
          {SECTION_LINKS.map(([label, id]) => (
            <li key={id}>
              <a href={hrefFor(id)} className="rounded text-sm text-slate-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {admin ? (
            <>
              <Link to="/admin" className="btn-glass hidden sm:inline-flex">Dashboard</Link>
              <button type="button" onClick={() => logout()} className="btn-glass">Logout</button>
            </>
          ) : (
            <Link to="/login" className="btn-glass">Admin Login</Link>
          )}
          <button
            type="button"
            className="btn-glass md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </nav>

      {open && (
        <ul id="mobile-menu" className="border-t border-white/10 bg-slate-900/90 px-4 py-3 md:hidden">
          {SECTION_LINKS.map(([label, id]) => (
            <li key={id}>
              <a href={hrefFor(id)} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-slate-200 hover:bg-white/10">
                {label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
