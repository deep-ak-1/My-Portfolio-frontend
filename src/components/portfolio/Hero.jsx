import ProfilePhoto from '../ui/ProfilePhoto.jsx';

export default function Hero({ profile }) {
  const name = profile?.fullName || 'Your Name';
  const label = profile?.title || 'MERN STACK DEVELOPER';

  return (
    <section aria-labelledby="hero-name" className="relative overflow-hidden px-4 pb-16 pt-14 text-center sm:pt-20">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6">
        <div className="relative animate-float">
          <div
            className="absolute -inset-1 rounded-full bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-600 opacity-70 blur-md"
            aria-hidden="true"
          />
          <div className="relative h-40 w-40 overflow-hidden rounded-full border-2 border-white/25 bg-slate-800 sm:h-56 sm:w-56">
            <ProfilePhoto
              src={profile?.photoUrl}
              name={name}
              alt={`Portrait of ${name}`}
              className="h-full w-full"
            />
          </div>
        </div>

        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">{label}</p>
        <h1 id="hero-name" className="text-4xl font-bold text-white sm:text-6xl">{name}</h1>
        <p className="max-w-xl text-lg text-slate-300">
          {profile?.introduction || 'Add your introduction from the admin dashboard.'}
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <a href="#projects" className="btn-primary">View My Projects</a>
          <a href="#contact" className="btn-glass">Contact Me</a>
        </div>
      </div>
    </section>
  );
}
