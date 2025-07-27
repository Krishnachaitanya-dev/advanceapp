
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import LoginPage from './LoginPage';

interface AuthWrapperProps {
  children: React.ReactNode;
}

// Helper function for development logging
const devLog = (message: string, ...args: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[AuthWrapper] ${message}`, ...args);
  }
};

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading, isAdmin, error } = useUserRole();
  const navigate = useNavigate();

  devLog('User:', !!user, 'Role:', role, 'AuthLoading:', authLoading, 'RoleLoading:', roleLoading);

  useEffect(() => {
    if (!authLoading && !roleLoading && user && role) {
      // Redirect admin users to admin page if they're not already there
      if (isAdmin && window.location.pathname !== '/admin') {
        navigate('/admin', { replace: true });
      } else if (!isAdmin && window.location.pathname === '/admin') {
        // Redirect non-admin users away from admin page
        navigate('/home', { replace: true });
      }
    }
  }, [user, role, authLoading, roleLoading, isAdmin, navigate]);

  const loading = authLoading || roleLoading;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-700 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // Handle profile errors gracefully
  if (error && user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-500 to-red-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Profile Error</h2>
          <p className="text-gray-600 mb-4">
            There was an issue loading your profile. Please try refreshing the page or contact support if the problem persists.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return <>{children}</>;
};

export default AuthWrapper;
