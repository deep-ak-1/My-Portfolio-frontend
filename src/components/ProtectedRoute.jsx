import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Spinner from './ui/Spinner.jsx';

// UX guard only. Every admin API call is also checked by the server.
export default function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Spinner label="Checking your session…" />;
  if (!admin) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}
