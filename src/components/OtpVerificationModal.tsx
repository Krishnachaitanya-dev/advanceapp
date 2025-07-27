
import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

interface OtpVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onVerify: (otp: string, newPassword: string) => void;
  onResendOTP: () => void;
  isLoading: boolean;
  step: 'email' | 'otp' | 'password';
  onStepChange: (step: 'email' | 'otp' | 'password') => void;
  onEmailChange: (email: string) => void;
  onSendOTP: () => void;
}

const OtpVerificationModal: React.FC<OtpVerificationModalProps> = ({
  isOpen,
  onClose,
  email,
  onVerify,
  onResendOTP,
  isLoading,
  step,
  onStepChange,
  onEmailChange,
  onSendOTP
}) => {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [countdown, setCountdown] = useState(0);

  // Countdown timer for resend OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  const handleSendOTP = () => {
    onSendOTP();
    setCountdown(60); // 60 second cooldown
  };

  const handleResendOTP = () => {
    onResendOTP();
    setCountdown(60);
  };

  const handleVerify = () => {
    if (newPassword !== confirmPassword) {
      return;
    }
    onVerify(otp, newPassword);
  };

  const handleClose = () => {
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setCountdown(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            {step === 'email' && <Mail className="w-6 h-6 text-blue-600 mr-3" />}
            {step === 'otp' && <Timer className="w-6 h-6 text-green-600 mr-3" />}
            {step === 'password' && <Lock className="w-6 h-6 text-purple-600 mr-3" />}
            <h2 className="text-xl font-bold text-slate-800">
              {step === 'email' && 'Reset Password'}
              {step === 'otp' && 'Enter Verification Code'}
              {step === 'password' && 'Set New Password'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {step === 'email' && (
            <>
              <p className="text-slate-600 text-sm">
                Enter your email address and we'll send you a verification code to reset your password.
              </p>
              <div className="space-y-2">
                <label className="text-slate-700 text-sm font-medium">Email Address</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => onEmailChange(e.target.value)}
                  placeholder="Enter your email"
                  className="h-12"
                  required
                />
              </div>
            </>
          )}

          {step === 'otp' && (
            <>
              <p className="text-slate-600 text-sm">
                We've sent a 6-digit verification code to <strong>{email}</strong>. 
                Please enter it below.
              </p>
              <div className="space-y-4">
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={setOtp}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <div className="text-center">
                  {countdown > 0 ? (
                    <p className="text-slate-500 text-sm">
                      Resend code in {countdown} seconds
                    </p>
                  ) : (
                    <button
                      onClick={handleResendOTP}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium underline"
                    >
                      Resend verification code
                    </button>
                  )}
                </div>
              </div>
            </>
          )}

          {step === 'password' && (
            <>
              <p className="text-slate-600 text-sm">
                Code verified! Now set your new password.
              </p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-slate-700 text-sm font-medium">New Password</label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="h-12"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-slate-700 text-sm font-medium">Confirm New Password</label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="h-12"
                    required
                  />
                  {newPassword && confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-red-500 text-xs">Passwords do not match</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3">
          <Button
            variant="outline"
            onClick={step === 'email' ? handleClose : () => onStepChange(step === 'otp' ? 'email' : 'otp')}
            className="flex-1"
          >
            {step === 'email' ? 'Cancel' : 'Back'}
          </Button>
          <Button
            onClick={
              step === 'email' ? handleSendOTP :
              step === 'otp' ? () => onStepChange('password') :
              handleVerify
            }
            disabled={
              isLoading || 
              (step === 'email' && !email) ||
              (step === 'otp' && otp.length !== 6) ||
              (step === 'password' && (!newPassword || !confirmPassword || newPassword !== confirmPassword))
            }
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                {step === 'email' && 'Sending...'}
                {step === 'otp' && 'Verifying...'}
                {step === 'password' && 'Updating...'}
              </div>
            ) : (
              <>
                {step === 'email' && 'Send Code'}
                {step === 'otp' && 'Verify Code'}
                {step === 'password' && 'Update Password'}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OtpVerificationModal;
