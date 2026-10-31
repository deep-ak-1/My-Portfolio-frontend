import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">404</p>
      <h1 className="text-3xl font-bold text-white">Page not found</h1>
      <Link to="/" className="btn-primary">Back to homepage</Link>
    </section>
  );
}
