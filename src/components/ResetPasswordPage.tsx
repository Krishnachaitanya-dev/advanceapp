
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Lock, RefreshCw } from 'lucide-react';

const ResetPasswordPage = () => {
  const [tokenError, setTokenError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if this is a password reset link
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const token = hashParams.get('access_token');
    const type = hashParams.get('type');
    const error = hashParams.get('error');
    const errorDescription = hashParams.get('error_description');
    
    console.log('Reset password URL params:', { token: !!token, type, error, errorDescription });
    
    if (error) {
      let errorMessage = 'Password reset link is invalid or has expired';
      if (errorDescription) {
        if (errorDescription.includes('expired')) {
          errorMessage = 'Password reset link has expired. Please request a new one.';
        } else if (errorDescription.includes('invalid')) {
          errorMessage = 'Password reset link is invalid. Please request a new one.';
        }
      }
      setTokenError(errorMessage);
    } else if (!token || type !== 'recovery') {
      setTokenError('This password reset method is no longer supported. Please use the new OTP-based reset from the login page.');
    } else {
      setTokenError('This password reset method is no longer supported. Please use the new OTP-based reset from the login page.');
    }

    toast({
      title: "Password Reset Method Changed",
      description: "We've updated our password reset system. Please use the 'Forgot Password' option on the login page.",
      variant: "destructive"
    });
  }, [toast]);

  const handleRequestNewReset = () => {
    // Navigate to login page with forgot password flag
    navigate('/login?forgot=true');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-primary/80 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold text-destructive">Reset Method Updated</CardTitle>
          <CardDescription className="text-center">
            We've improved our password reset system. Please use the new secure OTP-based reset method from the login page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleRequestNewReset}
            className="w-full"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Use New Password Reset
          </Button>
          
          <Button
            variant="outline"
            onClick={() => navigate('/login')}
            className="w-full"
          >
            Back to Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
