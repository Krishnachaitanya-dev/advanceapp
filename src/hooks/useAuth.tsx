import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: { name: string; phone: string }) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  sendPasswordResetOTP: (email: string) => Promise<{ success: boolean; error?: string }>;
  verifyPasswordResetOTP: (email: string, token: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function for development logging
const devLog = (message: string, ...args: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[AuthProvider] ${message}`, ...args);
  }
};

// Get the current domain for redirect URLs
const getCurrentDomain = () => {
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    // Force production domain if we detect Lovable project URL
    if (origin.includes('lovableproject.com')) {
      return 'https://app.advancewashing.com';
    }
    return origin;
  }
  // Fallback for production
  return 'https://app.advancewashing.com';
};

// Helper function to validate email format
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper function to validate password strength
const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

// Helper function to validate phone number format (improved)
const isValidPhoneNumber = (phone: string): boolean => {
  const cleanPhone = phone.replace(/[^\d+]/g, '');
  const phoneRegex = /^(\+\d{1,3})?\d{10,}$/;
  return phoneRegex.test(cleanPhone) && cleanPhone.replace(/\+/, '').length >= 10;
};

// Helper function to get user-friendly error messages
const getAuthErrorMessage = (error: any, email: string, password: string, phone?: string, isSignUp: boolean = false): string => {
  const errorMessage = error?.message || '';
  const errorCode = error?.code || '';

  devLog('Auth error details:', { errorMessage, errorCode, email, isSignUp });

  if (errorCode === 'invalid_credentials' || errorMessage.includes('Invalid login credentials')) {
    if (!isValidEmail(email)) {
      return 'Please enter a valid email address';
    }
    if (!isValidPassword(password)) {
      return 'Password must be at least 6 characters long';
    }
    return 'Invalid email or password. Please check your credentials and try again';
  }

  if (errorCode === 'signup_disabled') {
    return 'New user registration is currently disabled';
  }

  if (errorCode === 'email_not_confirmed') {
    return 'Please check your email and click the verification link before signing in';
  }

  if (errorCode === 'weak_password') {
    return 'Password is too weak. Please choose a stronger password with at least 6 characters';
  }

  if (errorCode === 'user_not_found') {
    return 'No account found with this email address. Please sign up first';
  }

  if (errorMessage.includes('Email rate limit exceeded')) {
    return 'Too many requests. Please wait a moment before trying again';
  }

  if (errorMessage.includes('Password should be at least')) {
    return 'Password must be at least 6 characters long';
  }

  if (errorMessage.includes('Unable to validate email address')) {
    return 'Please enter a valid email address';
  }

  if (errorMessage.includes('User already registered') || errorMessage.includes('email address is already registered')) {
    return 'Email already registered. Please sign in instead or use a different email address';
  }

  if (isSignUp) {
    if (!isValidEmail(email)) {
      return 'Please enter a valid email address';
    }
    if (!isValidPassword(password)) {
      return 'Password must be at least 6 characters long';
    }
    if (phone && !isValidPhoneNumber(phone)) {
      return 'Please enter a valid phone number';
    }
  }

  return errorMessage || 'An unexpected error occurred. Please try again';
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    devLog('Setting up auth state listener');
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      devLog('Initial session:', !!session, 'Error:', error?.message);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        devLog('Auth state change:', event, !!session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData: { name: string; phone: string }) => {
    try {
      devLog('Attempting sign up for:', email);
      setLoading(true);

      const trimmedEmail = email.trim();
      const trimmedName = userData.name.trim();
      const trimmedPhone = userData.phone.trim();

      if (!trimmedEmail) {
        const error = 'Email address is required';
        devLog('Validation error:', error);
        toast({
          title: "Sign up failed",
          description: error,
          variant: "destructive"
        });
        return { success: false, error };
      }

      if (!isValidEmail(trimmedEmail)) {
        const error = 'Please enter a valid email address';
        devLog('Validation error:', error);
        toast({
          title: "Sign up failed",
          description: error,
          variant: "destructive"
        });
        return { success: false, error };
      }

      if (!password.trim()) {
        const error = 'Password is required';
        devLog('Validation error:', error);
        toast({
          title: "Sign up failed",
          description: error,
          variant: "destructive"
        });
        return { success: false, error };
      }

      if (!isValidPassword(password)) {
        const error = 'Password must be at least 6 characters long';
        devLog('Validation error:', error);
        toast({
          title: "Sign up failed",
          description: error,
          variant: "destructive"
        });
        return { success: false, error };
      }

      if (!trimmedName) {
        const error = 'Full name is required';
        devLog('Validation error:', error);
        toast({
          title: "Sign up failed",
          description: error,
          variant: "destructive"
        });
        return { success: false, error };
      }

      if (!trimmedPhone) {
        const error = 'Phone number is required';
        devLog('Validation error:', error);
        toast({
          title: "Sign up failed",
          description: error,
          variant: "destructive"
        });
        return { success: false, error };
      }

      if (!isValidPhoneNumber(trimmedPhone)) {
        const error = 'Please enter a valid phone number (minimum 10 digits)';
        devLog('Validation error:', error, 'Phone:', trimmedPhone);
        toast({
          title: "Sign up failed",
          description: error,
          variant: "destructive"
        });
        return { success: false, error };
      }

      devLog('All validations passed, attempting Supabase signup');
      
      const currentDomain = getCurrentDomain();
      devLog('Using domain for email confirmation:', currentDomain);
      
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            full_name: trimmedName,
            name: trimmedName,
            phone: trimmedPhone
          },
          emailRedirectTo: `${currentDomain}/welcome`
        }
      });

      devLog('Supabase signup result:', { 
        hasData: !!data, 
        hasUser: !!data?.user, 
        hasError: !!error,
        errorMessage: error?.message,
        errorCode: error?.code
      });

      if (error) {
        const errorMessage = getAuthErrorMessage(error, trimmedEmail, password, trimmedPhone, true);
        devLog('Sign up error:', errorMessage);
        toast({
          title: "Sign up failed",
          description: errorMessage,
          variant: "destructive"
        });
        return { success: false, error: errorMessage };
      }

      if (!data?.user) {
        const error = 'Failed to create account. Please try again';
        devLog('No user data returned from signup');
        toast({
          title: "Sign up failed",
          description: error,
          variant: "destructive"
        });
        return { success: false, error };
      }

      devLog('Signup successful for user:', data.user.id);
      toast({
        title: "Success! 🎉",
        description: `Please check your email to verify your account. The confirmation link will redirect you to ${currentDomain}.`
      });
      return { success: true };
    } catch (error: any) {
      const errorMessage = getAuthErrorMessage(error, email, password, userData.phone, true);
      devLog('Sign up exception:', errorMessage, error);
      toast({
        title: "Sign up failed",
        description: errorMessage,
        variant: "destructive"
      });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      devLog('Attempting sign in for:', email);
      setLoading(true);

      if (!email.trim()) {
        const error = 'Email address is required';
        toast({
          title: "Sign in failed",
          description: error,
          variant: "destructive"
        });
        return { success: false, error };
      }

      if (!isValidEmail(email)) {
        const error = 'Please enter a valid email address';
        toast({
          title: "Sign in failed",
          description: error,
          variant: "destructive"
        });
        return { success: false, error };
      }

      if (!password.trim()) {
        const error = 'Password is required';
        toast({
          title: "Sign in failed",
          description: error,
          variant: "destructive"
        });
        return { success: false, error };
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      devLog('Sign in result:', !!data, !!error);

      if (error) {
        const errorMessage = getAuthErrorMessage(error, email, password, undefined, false);
        devLog('Sign in error:', errorMessage);
        toast({
          title: "Sign in failed",
          description: errorMessage,
          variant: "destructive"
        });
        return { success: false, error: errorMessage };
      }

      toast({
        title: "Welcome back! 👋",
        description: "You have successfully signed in"
      });
      return { success: true };
    } catch (error: any) {
      const errorMessage = getAuthErrorMessage(error, email, password, undefined, false);
      devLog('Sign in exception:', errorMessage);
      toast({
        title: "Sign in failed",
        description: errorMessage,
        variant: "destructive"
      });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      devLog('Attempting sign out');
      setLoading(true);
      
      // Clear local state first
      setUser(null);
      setSession(null);
      
      // Clear any cached data
      localStorage.clear();
      sessionStorage.clear();
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        devLog('Supabase signout error:', error.message);
      }
      
      // Force reload to clear any remaining state
      window.location.href = '/login';
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out"
      });
    } catch (error: any) {
      devLog('Sign out error:', error.message);
      setUser(null);
      setSession(null);
      
      toast({
        title: "Signed out",
        description: "Session cleared successfully"
      });
      
      window.location.href = '/login';
    } finally {
      setLoading(false);
    }
  };

  const sendPasswordResetOTP = async (email: string) => {
    try {
      devLog('Sending password reset OTP for:', email);
      setLoading(true);

      if (!email.trim()) {
        const error = 'Email address is required';
        toast({
          title: "Reset failed",
          description: error,
          variant: "destructive"
        });
        return { success: false, error };
      }

      if (!isValidEmail(email)) {
        const error = 'Please enter a valid email address';
        toast({
          title: "Reset failed",
          description: error,
          variant: "destructive"
        });
        return { success: false, error };
      }

      // Use signInWithOtp for recovery type to send OTP token
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          shouldCreateUser: false, // Don't create user if they don't exist
        }
      });

      if (error) {
        devLog('Password reset OTP error:', error.message);
        const errorMessage = error.message || 'Failed to send reset code';
        toast({
          title: "Reset failed",
          description: errorMessage,
          variant: "destructive"
        });
        return { success: false, error: errorMessage };
      }

      devLog('Password reset OTP sent successfully');
      toast({
        title: "Reset code sent! 📧",
        description: "Please check your email for the 6-digit verification code"
      });
      return { success: true };
    } catch (error: any) {
      devLog('Password reset OTP exception:', error.message);
      const errorMessage = error.message || 'An unexpected error occurred';
      toast({
        title: "Reset failed",
        description: errorMessage,
        variant: "destructive"
      });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const verifyPasswordResetOTP = async (email: string, token: string, newPassword: string) => {
    try {
      devLog('Verifying password reset OTP for:', email);
      setLoading(true);

      if (!email.trim() || !token.trim() || !newPassword.trim()) {
        const error = 'All fields are required';
        toast({
          title: "Reset failed",
          description: error,
          variant: "destructive"
        });
        return { success: false, error };
      }

      if (!isValidPassword(newPassword)) {
        const error = 'Password must be at least 6 characters long';
        toast({
          title: "Reset failed",
          description: error,
          variant: "destructive"
        });
        return { success: false, error };
      }

      // Verify the OTP and update password
      const { error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: token.trim(),
        type: 'recovery'
      });

      if (error) {
        devLog('OTP verification error:', error.message);
        let errorMessage = 'Invalid or expired verification code';
        if (error.message.includes('expired')) {
          errorMessage = 'Verification code has expired. Please request a new one.';
        } else if (error.message.includes('invalid')) {
          errorMessage = 'Invalid verification code. Please check and try again.';
        }
        toast({
          title: "Reset failed",
          description: errorMessage,
          variant: "destructive"
        });
        return { success: false, error: errorMessage };
      }

      // Update the password
      const { error: passwordError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (passwordError) {
        devLog('Password update error:', passwordError.message);
        const errorMessage = passwordError.message || 'Failed to update password';
        toast({
          title: "Reset failed",
          description: errorMessage,
          variant: "destructive"
        });
        return { success: false, error: errorMessage };
      }

      devLog('Password reset successful');
      
      // Clear session to ensure clean login
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);

      toast({
        title: "Password reset successful! ✅",
        description: "You can now sign in with your new password"
      });
      return { success: true };
    } catch (error: any) {
      devLog('Password reset verification exception:', error.message);
      const errorMessage = error.message || 'An unexpected error occurred';
      toast({
        title: "Reset failed",
        description: errorMessage,
        variant: "destructive"
      });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        sendPasswordResetOTP,
        verifyPasswordResetOTP
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
