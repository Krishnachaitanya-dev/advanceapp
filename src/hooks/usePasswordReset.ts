
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const usePasswordReset = () => {
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    // Set flag to indicate coming from password reset
    sessionStorage.setItem('fromPasswordReset', 'true');
    navigate('/login?forgot=true', { replace: true });
  };

  const clearPasswordResetState = () => {
    sessionStorage.removeItem('fromPasswordReset');
  };

  return {
    handleBackToLogin,
    clearPasswordResetState
  };
};
