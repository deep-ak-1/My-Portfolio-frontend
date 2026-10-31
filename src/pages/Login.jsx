import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getErrorMessage } from '../services/api.js';
import GlassCard from '../components/ui/GlassCard.jsx';
import Field, { inputClass } from '../components/admin/Field.jsx';

export default function Login() {
  const { admin, login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && admin) return <Navigate to="/admin" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate(location.state?.from || '/admin', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Login failed. Check your credentials.'));
    } finally {
      setSubmitting(false);
      setPassword('');
    }
  };

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-16">
      <GlassCard className="w-full p-8">
        <h1 className="text-2xl font-bold text-white">Administrator login</h1>
        <p className="mt-2 text-sm text-slate-400">Only the portfolio owner can edit content.</p>

        <form onSubmit={submit} noValidate className="mt-6 space-y-5" aria-describedby={error ? 'login-error' : undefined}>
          <Field label="Email" id="login-email">
            <input id="login-email" type="email" autoComplete="username" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field label="Password" id="login-password">
            <input id="login-password" type="password" autoComplete="current-password" className={inputClass} value={password} onChange={(e) => setPassword(e.target.value)} />
          </Field>

          {error && (
            <p id="login-error" role="alert" className="rounded-lg border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
              {error}
            </p>
          )}

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </GlassCard>
    </section>
  );
}
