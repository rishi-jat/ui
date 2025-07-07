import { Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import LoadingFallback from './LoadingFallback';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { data, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0f1c]">
        <LoadingFallback message="Verifying your session..." size="small" />
      </div>
    );
  }

  if (!data?.isAuthenticated) {
    const errorMessage =
      location.state?.errorMessage ||
      new URLSearchParams(window.location.search).get('errorMessage') ||
      'Please sign in to continue';
    return (
      <Navigate
        to="/login"
        state={{
          errorMessage,
          from: location.pathname,
        }}
        replace
      />
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="protected-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default ProtectedRoute;
