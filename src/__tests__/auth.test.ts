
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth, AuthProvider } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import React from 'react';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } }
      })),
      updateUser: vi.fn(),
      setSession: vi.fn(),
      resetPasswordForEmail: vi.fn()
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn()
        }))
      }))
    }))
  }
}));

// Mock toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

// Mock React Router
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn()
}));

describe('Authentication System', () => {
  const mockSupabase = supabase as any;
  
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock successful session check
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Sign Up Validation', () => {
    it('should successfully sign up with valid data', async () => {
      // Mock successful signup
      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: { id: '123', email: 'test@example.com' } },
        error: null
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => 
        React.createElement(AuthProvider, null, children);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        const response = await result.current.signUp(
          'test@example.com',
          'password123',
          { name: 'John Doe', phone: '+1234567890' }
        );
        expect(response.success).toBe(true);
      });
    });

    it('should fail with empty email', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => 
        React.createElement(AuthProvider, null, children);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        const response = await result.current.signUp(
          '',
          'password123',
          { name: 'John Doe', phone: '+1234567890' }
        );
        expect(response.success).toBe(false);
        expect(response.error).toBe('Email address is required');
      });
    });

    it('should fail with invalid email format', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => 
        React.createElement(AuthProvider, null, children);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        const response = await result.current.signUp(
          'invalid-email',
          'password123',
          { name: 'John Doe', phone: '+1234567890' }
        );
        expect(response.success).toBe(false);
        expect(response.error).toBe('Please enter a valid email address');
      });
    });

    it('should fail with empty password', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => 
        React.createElement(AuthProvider, null, children);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        const response = await result.current.signUp(
          'test@example.com',
          '',
          { name: 'John Doe', phone: '+1234567890' }
        );
        expect(response.success).toBe(false);
        expect(response.error).toBe('Password is required');
      });
    });

    it('should fail with weak password', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => 
        React.createElement(AuthProvider, null, children);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        const response = await result.current.signUp(
          'test@example.com',
          '123',
          { name: 'John Doe', phone: '+1234567890' }
        );
        expect(response.success).toBe(false);
        expect(response.error).toBe('Password must be at least 6 characters long');
      });
    });

    it('should fail with empty name', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => 
        React.createElement(AuthProvider, null, children);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        const response = await result.current.signUp(
          'test@example.com',
          'password123',
          { name: '', phone: '+1234567890' }
        );
        expect(response.success).toBe(false);
        expect(response.error).toBe('Full name is required');
      });
    });

    it('should fail with empty phone number (now mandatory)', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => 
        React.createElement(AuthProvider, null, children);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        const response = await result.current.signUp(
          'test@example.com',
          'password123',
          { name: 'John Doe', phone: '' }
        );
        expect(response.success).toBe(false);
        expect(response.error).toBe('Phone number is required');
      });
    });

    it('should fail with invalid phone number format', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => 
        React.createElement(AuthProvider, null, children);

      const { result } = renderHook(() => useAuth(), { wrapper });

      const invalidPhones = ['123', 'abc', '123-456'];

      for (const phone of invalidPhones) {
        await act(async () => {
          const response = await result.current.signUp(
            'test@example.com',
            'password123',
            { name: 'John Doe', phone }
          );
          expect(response.success).toBe(false);
          expect(response.error).toBe('Please enter a valid phone number (minimum 10 digits)');
        });
      }
    });

    it('should accept valid phone number formats', async () => {
      // Mock successful signup
      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: { id: '123', email: 'test@example.com' } },
        error: null
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => 
        React.createElement(AuthProvider, null, children);

      const { result } = renderHook(() => useAuth(), { wrapper });

      const validPhones = ['+1234567890', '1234567890', '+91-9876543210', '(123) 456-7890'];

      for (const phone of validPhones) {
        await act(async () => {
          const response = await result.current.signUp(
            'test@example.com',
            'password123',
            { name: 'John Doe', phone }
          );
          expect(response.success).toBe(true);
        });
      }
    });

    it('should handle Supabase signup errors for existing email', async () => {
      // Mock Supabase error for existing user
      mockSupabase.auth.signUp.mockResolvedValue({
        data: null,
        error: { 
          message: 'User already registered',
          code: 'user_already_exists'
        }
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => 
        React.createElement(AuthProvider, null, children);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        const response = await result.current.signUp(
          'existing@example.com',
          'password123',
          { name: 'John Doe', phone: '+1234567890' }
        );
        expect(response.success).toBe(false);
        expect(response.error).toBe('Email already registered. Please sign in instead or use a different email address');
      });
    });

    it('should trim whitespace from inputs', async () => {
      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: { id: '123', email: 'test@example.com' } },
        error: null
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => 
        React.createElement(AuthProvider, null, children);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        const response = await result.current.signUp(
          '  test@example.com  ',
          'password123',
          { name: '  John Doe  ', phone: '  +1234567890  ' }
        );
        expect(response.success).toBe(true);
      });

      // Verify trimmed email was used
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'test@example.com'
        })
      );
    });
  });

  describe('Sign In Validation', () => {
    it('should successfully sign in with valid credentials', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: { id: '123', email: 'test@example.com' } },
        error: null
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => 
        React.createElement(AuthProvider, null, children);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        const response = await result.current.signIn('test@example.com', 'password123');
        expect(response.success).toBe(true);
      });
    });

    it('should fail with empty email', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => 
        React.createElement(AuthProvider, null, children);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        const response = await result.current.signIn('', 'password123');
        expect(response.success).toBe(false);
        expect(response.error).toBe('Email address is required');
      });
    });

    it('should fail with invalid email format', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => 
        React.createElement(AuthProvider, null, children);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        const response = await result.current.signIn('invalid-email', 'password123');
        expect(response.success).toBe(false);
        expect(response.error).toBe('Please enter a valid email address');
      });
    });

    it('should fail with empty password', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => 
        React.createElement(AuthProvider, null, children);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        const response = await result.current.signIn('test@example.com', '');
        expect(response.success).toBe(false);
        expect(response.error).toBe('Password is required');
      });
    });

    it('should fail with invalid credentials', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: { 
          message: 'Invalid login credentials',
          code: 'invalid_credentials'
        }
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => 
        React.createElement(AuthProvider, null, children);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        const response = await result.current.signIn('test@example.com', 'wrongpassword');
        expect(response.success).toBe(false);
        expect(response.error).toBe('Invalid email or password. Please check your credentials and try again');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle network errors gracefully', async () => {
      mockSupabase.auth.signUp.mockRejectedValue(new Error('Network error'));

      const wrapper = ({ children }: { children: React.ReactNode }) => 
        React.createElement(AuthProvider, null, children);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        const response = await result.current.signUp(
          'test@example.com',
          'password123',
          { name: 'John Doe', phone: '+1234567890' }
        );
        expect(response.success).toBe(false);
        expect(response.error).toBe('Network error');
      });
    });

    it('should handle signup with no user data returned', async () => {
      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: null },
        error: null
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => 
        React.createElement(AuthProvider, null, children);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        const response = await result.current.signUp(
          'test@example.com',
          'password123',
          { name: 'John Doe', phone: '+1234567890' }
        );
        expect(response.success).toBe(false);
        expect(response.error).toBe('Failed to create account. Please try again');
      });
    });
  });
});
