import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Sparkles, Shield, Heart, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import OtpVerificationModal from './OtpVerificationModal';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpStep, setOtpStep] = useState<'email' | 'otp' | 'password'>('email');
  const [isOtpLoading, setIsOtpLoading] = useState(false);

  // Consent checkboxes state
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [readPrivacyPolicy, setReadPrivacyPolicy] = useState(false);
  const [confirmedAge, setConfirmedAge] = useState(false);

  // Modal states
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    user,
    signIn,
    signUp,
    sendPasswordResetOTP,
    verifyPasswordResetOTP
  } = useAuth();
  const {
    toast
  } = useToast();

  // Check if all consent boxes are checked
  const allConsentGiven = agreedToTerms && readPrivacyPolicy && confirmedAge;

  // Handle URL parameters for forgot password
  useEffect(() => {
    const forgotParam = searchParams.get('forgot');
    if (forgotParam === 'true') {
      setShowOtpModal(true);
      setOtpStep('email');
      console.log('Opening OTP modal from URL parameter');
    }
  }, [searchParams]);

  // Handle user redirect
  useEffect(() => {
    if (user && !showOtpModal) {
      console.log('User already logged in, redirecting to home');
      navigate('/home', {
        replace: true
      });
    }
  }, [user, navigate, showOtpModal]);

  const handleSendOTP = async () => {
    setIsOtpLoading(true);
    try {
      const result = await sendPasswordResetOTP(otpEmail);
      if (result.success) {
        setOtpStep('otp');
      }
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsOtpLoading(true);
    try {
      await sendPasswordResetOTP(otpEmail);
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleVerifyOTP = async (otp: string, newPassword: string) => {
    setIsOtpLoading(true);
    try {
      const result = await verifyPasswordResetOTP(otpEmail, otp, newPassword);
      if (result.success) {
        setShowOtpModal(false);
        setOtpEmail('');
        setOtpStep('email');
        // Optionally prefill the email in login form
        setEmail(otpEmail);
      }
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleCloseOtpModal = () => {
    setShowOtpModal(false);
    setOtpEmail('');
    setOtpStep('email');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isSignUp) {
        const result = await signUp(email, password, {
          name,
          phone
        });
        if (result.success) {
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } else {
        const result = await signIn(email, password);
        if (result.success) {
          navigate('/home', {
            replace: true
          });
        } else {
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setName('');
    setPhone('');
    // Reset consent checkboxes when switching modes
    setAgreedToTerms(false);
    setReadPrivacyPolicy(false);
    setConfirmedAge(false);
  };

  const TermsModal = () => <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <FileText className="w-6 h-6 text-slate-600 mr-3" />
            <h2 className="text-xl font-bold text-slate-800">Terms & Conditions</h2>
          </div>
          <button onClick={() => setShowTermsModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4 text-sm text-slate-700">
          <section>
            <h3 className="font-semibold text-slate-800 mb-2">1. Acceptance of Terms</h3>
            <p>By using Advance Washing services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
          </section>

          <section>
            <h3 className="font-semibold text-slate-800 mb-2">2. Service Description</h3>
            <p className="mb-3">Advance Washing provides:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>Laundry and dry cleaning services</li>
              <li>Pickup and delivery services</li>
              <li>Garment care and maintenance</li>
              <li>Special fabric treatments</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-slate-800 mb-2">3. User Responsibilities</h3>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>Provide accurate contact and address information</li>
              <li>Ensure items are suitable for our cleaning processes</li>
              <li>Report any special care instructions</li>
              <li>Be available during scheduled pickup/delivery times</li>
              <li>Pay for services in a timely manner</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-slate-800 mb-2">4. Pricing and Payment</h3>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>Prices are subject to change with notice</li>
              <li>Payment is due upon completion of service</li>
              <li>We accept various payment methods</li>
              <li>Late payment fees may apply</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-slate-800 mb-2">5. Liability and Insurance</h3>
            <p className="mb-3 text-slate-600">
              While we take utmost care of your garments, our liability is limited to:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>10 times the cleaning charge for damaged items</li>
              <li>Original purchase price with valid receipt</li>
              <li>We are not liable for items left over 30 days</li>
              <li>Special items require prior notice and acceptance</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-slate-800 mb-2">6. Prohibited Items</h3>
            <p className="mb-3">We do not accept:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>Items contaminated with hazardous materials</li>
              <li>Leather goods (unless specified)</li>
              <li>Wedding dresses (requires special service)</li>
              <li>Items with non-permanent stains</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-slate-800 mb-2">7. Cancellation Policy</h3>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>Orders can be cancelled before pickup</li>
              <li>Cancellation fees may apply for scheduled pickups</li>
              <li>Refunds processed within 3-5 business days</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-slate-800 mb-2">8. Contact Information</h3>
            <p className="text-slate-600">
              For questions about these Terms of Service:
              <br />
              Email: info@advancewashing.com
              <br />
              Phone: +91 8928478081
              <br />
              Address: Second floor Nirman Ind Estate, Chincholi Link Road, Near Fire Brigade, Malad West Mumbai - 400064
            </p>
          </section>
        </div>
        <div className="p-6 border-t border-gray-200">
          <Button onClick={() => setShowTermsModal(false)} className="w-full bg-blue-500 hover:bg-blue-600 text-white">
            Close
          </Button>
        </div>
      </div>
    </div>;

  const PrivacyModal = () => <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Shield className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-bold text-slate-800">Your Privacy Matters</h2>
          </div>
          <button onClick={() => setShowPrivacyModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4 text-sm text-slate-700">
          <section>
            <h3 className="font-semibold text-slate-800 mb-2">Information We Collect</h3>
            <p className="mb-3">
              We collect information you provide directly to us, such as when you create an account, 
              place an order, or contact us for support.
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>Personal information (name, email, phone number)</li>
              <li>Address information for pickup and delivery</li>
              <li>Payment information (processed securely)</li>
              <li>Order history and preferences</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-slate-800 mb-2">How We Use Your Information</h3>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>To provide and improve our laundry services</li>
              <li>To process orders and payments</li>
              <li>To communicate with you about your orders</li>
              <li>To send promotional offers (with your consent)</li>
              <li>To ensure the security of our services</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-slate-800 mb-2">Information Sharing</h3>
            <p className="mb-3">
              We do not sell, trade, or rent your personal information to third parties. 
              We may share information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>With your explicit consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and safety</li>
              <li>With service providers who assist us in operations</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-slate-800 mb-2">Data Security</h3>
            <p className="text-slate-600">
              We implement appropriate security measures to protect your personal information 
              against unauthorized access, alteration, disclosure, or destruction. All payment 
              information is processed through secure, encrypted channels.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-slate-800 mb-2">Your Rights</h3>
            <p className="mb-3">You have the right to:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Data portability</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibred text-slate-800 mb-2">Third-Party Services</h3>
            <p className="mb-3">We use the following third-party services to provide our app functionality:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li><strong>Supabase:</strong> Database and authentication services (data stored in secure cloud)</li>
              <li><strong>OpenStreetMap/Leaflet:</strong> Map services for address selection (no personal data shared)</li>
              <li><strong>Nominatim:</strong> Address geocoding service (only coordinates shared for address lookup)</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-slate-800 mb-2">Location Data Usage</h3>
            <p className="mb-3">We collect and use location data specifically for:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>Automatic address detection during pickup scheduling</li>
              <li>Accurate delivery time estimation</li>
              <li>Service area verification</li>
              <li>Route optimization for our delivery team</li>
            </ul>
            <p className="text-slate-600 mt-3">
              Location access is only requested when you're actively using the app and is never tracked in the background. 
              You can always choose to enter your address manually instead.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-slate-800 mb-2">Data Retention</h3>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>Account information: Retained while your account is active</li>
              <li>Order history: Retained for 2 years for service and support purposes</li>
              <li>Location data: Not stored permanently, only used for immediate address detection</li>
              <li>Payment information: Processed securely and not stored on our servers</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-slate-800 mb-2">Children's Privacy</h3>
            <p className="text-slate-600">
              Our service is not intended for children under 13. We do not knowingly collect personal 
              information from children under 13. If you are a parent or guardian and believe your child 
              has provided us with personal information, please contact us immediately.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-slate-800 mb-2">International Data Transfers</h3>
            <p className="text-slate-600">
              Your information may be transferred to and processed in countries other than your own. 
              We ensure appropriate safeguards are in place to protect your data in accordance with 
              applicable privacy laws and our commitment to data protection.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-slate-800 mb-2">Policy Updates</h3>
            <p className="text-slate-600">
              We may update this Privacy Policy from time to time. We will notify you of any changes 
              by posting the new Privacy Policy on this page and updating the "Last updated" date. 
              You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-slate-800 mb-2">Contact Us</h3>
            <p className="text-slate-600">
              If you have any questions about this Privacy Policy or our data practices, please contact us at:
              <br />
              <strong>Email:</strong> info@advancewashing.com
              <br />
              <strong>Phone:</strong> +91 8928478081
              <br />
              <strong>Address:</strong> Second floor Nirman Ind Estate, Chincholi Link Road, Near Fire Brigade, Malad West Mumbai - 400064
            </p>
          </section>
        </div>
        <div className="p-6 border-t border-gray-200">
          <Button onClick={() => setShowPrivacyModal(false)} className="w-full bg-blue-500 hover:bg-blue-600 text-white">
            Close
          </Button>
        </div>
      </div>
    </div>;

  return (
    <div className="min-h-screen login-bg relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-4 h-4 bg-white/20 rounded-full animate-bounce opacity-60"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-yellow-300/30 rounded-full animate-pulse opacity-50" style={{
        animationDelay: '1s'
      }}></div>
        <div className="absolute bottom-40 left-16 w-5 h-5 bg-green-300/25 rounded-full animate-bounce opacity-40" style={{
        animationDelay: '2s'
      }}></div>
        <div className="absolute bottom-20 right-10 w-3 h-3 bg-purple-300/30 rounded-full animate-pulse opacity-50" style={{
        animationDelay: '0.5s'
      }}></div>
        
        <div className="absolute top-32 left-1/4 text-white/20 animate-float">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="absolute bottom-32 right-1/4 text-white/15 animate-pulse" style={{
        animationDelay: '3s'
      }}>
          <Shield className="w-5 h-5" />
        </div>
        <div className="absolute top-1/2 left-10 text-white/20 animate-bounce" style={{
        animationDelay: '1.5s'
      }}>
          <Heart className="w-4 h-4" />
        </div>
      </div>

      <div className="relative min-h-screen flex flex-col items-center justify-center p-4 my-0 py-[16px]">
        <div className="text-center mb-6 my-px">
          <div className="mb-4 px-[10px] py-0 my-[0.5px]">
            <div className="w-24 h-24 mx-auto mb-3 relative">
              <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl"></div>
              <img src="https://advancewashing.com/lovable-uploads/600eae54-4845-410b-93a1-7296f3d3ab9a.png" alt="AW Logo" className="w-full h-full object-contain relative z-10 drop-shadow-lg" />
            </div>
            <h1 className="text-white text-2xl font-bold tracking-tight mb-2 drop-shadow-lg">
              Advance Washing
            </h1>
            <p className="text-white/90 text-base font-medium drop-shadow-sm py-0 my-0">
              Professional Laundry Services ✨
            </p>
          </div>
        </div>

        <div className="w-full max-w-sm glass-card-login p-6 shadow-2xl py-[2px] my-0 px-[24px]">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-white mb-2 drop-shadow-sm py-0 my-[10px]">
              {isSignUp ? 'Create Account 🚀' : 'Welcome Back 👋'}
            </h2>
            <p className="text-white/80 text-sm">
              {isSignUp ? 'Join us for premium laundry service' : 'Sign in to your account'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 py-px my-px">
            {isSignUp && <>
                <div className="space-y-2">
                  <label className="text-white text-sm font-medium drop-shadow-sm">Full Name</label>
                  <Input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter your full name" className="h-12 bg-white/15 border-white/30 rounded-xl px-4 text-white placeholder:text-white/60 text-sm focus:ring-2 focus:ring-white/50 focus:border-white/50 backdrop-blur-sm transition-all duration-200 focus:bg-white/20 focus:ring-offset-0" required />
                </div>
                
                <div className="space-y-2">
                  <label className="text-white text-sm font-medium drop-shadow-sm">
                    Phone Number <span className="text-red-300">*</span>
                  </label>
                  <Input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Enter your phone number" className="h-12 bg-white/15 border-white/30 rounded-xl px-4 text-white placeholder:text-white/60 text-sm focus:ring-2 focus:ring-white/50 focus:border-white/50 backdrop-blur-sm transition-all duration-200 focus:bg-white/20 focus:ring-offset-0" required />
                </div>
              </>}

            <div className="space-y-2 my-0">
              <label className="text-white text-sm font-medium drop-shadow-sm">Email Address</label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" className="h-12 bg-white/15 border-white/30 rounded-xl px-4 text-white placeholder:text-white/60 text-sm focus:ring-2 focus:ring-white/50 focus:border-white/50 backdrop-blur-sm transition-all duration-200 focus:bg-white/20 focus:ring-offset-0" required />
            </div>

            <div className="space-y-2 my-[10px]">
              <label className="text-white text-sm font-medium drop-shadow-sm">Password</label>
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" className="h-12 bg-white/15 border-white/30 rounded-xl px-4 pr-12 text-white placeholder:text-white/60 text-sm focus:ring-2 focus:ring-white/50 focus:border-white/50 backdrop-blur-sm transition-all duration-200 focus:bg-white/20 focus:ring-offset-0" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isSignUp && <div className="text-right my-px">
                <button type="button" onClick={() => setShowOtpModal(true)} className="text-white/90 hover:text-white font-medium transition-colors text-sm underline decoration-white/50 hover:decoration-white">
                  Forgot password?
                </button>
              </div>}

            {isSignUp && <div className="space-y-3 pt-2 border-t border-white/20">
                <p className="text-white/90 text-sm font-medium">Required Agreements:</p>
                
                <div className="flex items-start space-x-3">
                  <Checkbox id="terms" checked={agreedToTerms} onCheckedChange={checked => setAgreedToTerms(checked === true)} className="mt-1 border-white/30 data-[state=checked]:bg-white/20 data-[state=checked]:border-white/50" />
                  <label htmlFor="terms" className="text-white/90 text-sm leading-relaxed">
                    I agree to the{' '}
                    <button type="button" onClick={() => setShowTermsModal(true)} className="text-white font-semibold underline decoration-white/50 hover:decoration-white transition-colors">
                      Terms and Conditions
                    </button>
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox id="privacy" checked={readPrivacyPolicy} onCheckedChange={checked => setReadPrivacyPolicy(checked === true)} className="mt-1 border-white/30 data-[state=checked]:bg-white/20 data-[state=checked]:border-white/50" />
                  <label htmlFor="privacy" className="text-white/90 text-sm leading-relaxed">
                    I have read the{' '}
                    <button type="button" onClick={() => setShowPrivacyModal(true)} className="text-white font-semibold underline decoration-white/50 hover:decoration-white transition-colors">
                      Privacy Policy
                    </button>
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox id="age" checked={confirmedAge} onCheckedChange={checked => setConfirmedAge(checked === true)} className="mt-1 border-white/30 data-[state=checked]:bg-white/20 data-[state=checked]:border-white/50" />
                  <label htmlFor="age" className="text-white/90 text-sm leading-relaxed">
                    I confirm that I am above 13 years of age
                  </label>
                </div>
              </div>}

            <Button type="submit" disabled={isLoading || isSignUp && !allConsentGiven} className="w-full h-13 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl shadow-xl transition-all duration-300 text-sm border border-white/30 backdrop-blur-sm mt-6 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 my-[2px]">
              {isLoading ? <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  {isSignUp ? 'Creating Account...' : 'Signing In...'}
                </div> : <>
                  {isSignUp ? '🎉 Create Account' : '🚀 Sign In'}
                </>}
            </Button>
          </form>

          <div className="text-center mt-6 pt-4 border-t border-white/20 my-[2px]">
            <p className="text-white/90 text-sm">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button onClick={toggleMode} className="text-white font-semibold hover:text-white/80 transition-colors ml-1 underline decoration-white/50 hover:decoration-white">
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-white/70 text-xs">
            By continuing, you agree to our{' '}
            <a 
              href="/public-terms-of-service" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white underline hover:text-white/90 transition-colors"
            >
              Terms of Service
            </a>
            {' '}and{' '}
            <a 
              href="/public-privacy-policy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white underline hover:text-white/90 transition-colors"
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </div>

      <OtpVerificationModal isOpen={showOtpModal} onClose={handleCloseOtpModal} email={otpEmail} onEmailChange={setOtpEmail} onSendOTP={handleSendOTP} onResendOTP={handleResendOTP} onVerify={handleVerifyOTP} isLoading={isOtpLoading} step={otpStep} onStepChange={setOtpStep} />
      
      {showTermsModal && <TermsModal />}
      {showPrivacyModal && <PrivacyModal />}
    </div>
  );
};

export default LoginPage;
