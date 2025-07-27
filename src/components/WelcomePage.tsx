
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Sparkles, Home, ShoppingBag, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const WelcomePage = () => {
  const { user } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Get user's first name for personalization
  const getUserName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(' ')[0];
    }
    if (user?.user_metadata?.name) {
      return user.user_metadata.name.split(' ')[0];
    }
    return 'there';
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Floating Geometric Shapes */}
        <div className="absolute top-10 left-10 w-3 h-3 bg-blue-300/40 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-32 right-20 w-2 h-2 bg-purple-300/30 rounded-full animate-bounce opacity-50" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-16 w-4 h-4 bg-green-300/35 rounded-full animate-pulse opacity-40" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-10 w-3 h-3 bg-orange-300/40 rounded-full animate-bounce opacity-50" style={{ animationDelay: '0.5s' }}></div>
        
        {/* Floating Laundry Emojis */}
        <div className="absolute top-20 right-32 text-2xl animate-bounce opacity-70" style={{ animationDelay: '1.5s' }}>🧺</div>
        <div className="absolute top-48 left-20 text-xl animate-pulse opacity-60" style={{ animationDelay: '2.5s' }}>👕</div>
        <div className="absolute bottom-32 right-20 text-lg animate-bounce opacity-50" style={{ animationDelay: '3s' }}>✨</div>
        <div className="absolute bottom-48 left-32 text-xl animate-pulse opacity-60" style={{ animationDelay: '0.8s' }}>💧</div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className={`w-full max-w-md transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          
          {/* Main Welcome Card */}
          <div className="glass-card p-4 text-center relative overflow-hidden group border border-blue-200/30 mb-4">
            {/* Card Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-white to-purple-50/80 opacity-90"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 opacity-80"></div>
            
            {/* Floating Sparkles in Card */}
            <div className="absolute top-3 right-3">
              <Sparkles className="w-4 h-4 text-blue-400 animate-pulse opacity-70" />
            </div>
            <div className="absolute bottom-3 left-3">
              <Star className="w-3 h-3 text-purple-400 animate-bounce opacity-50" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative z-10">
              {/* Success Icon */}
              <div className="mb-3 relative">
                <div className="w-16 h-16 mx-auto relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-blue-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
                  <div className="w-full h-full bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center relative z-10 shadow-2xl">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                </div>
              </div>

              {/* Welcome Message */}
              <h1 className="text-2xl font-bold mb-1 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
                Welcome{user ? `, ${getUserName()}` : ''}! 🎉
              </h1>
              
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <p className="text-slate-600 font-medium">
                  Email verified successfully!
                </p>
              </div>

              <p className="text-slate-600 text-sm mb-3 leading-relaxed">
                Your account is now active and ready to use. Experience premium laundry services in Mumbai with just a few taps.
              </p>

              {/* App Logo */}
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur-md opacity-20"></div>
                  <div className="w-full h-full relative z-10 flex items-center justify-center bg-white/20 rounded-xl p-2">
                    <img 
                      src="/lovable-uploads/a05b96c2-641b-4469-8482-6d8bd89c81e9.png" 
                      alt="AW Logo" 
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 rounded flex items-center justify-center text-white font-bold text-sm">AW</div>';
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* App Introduction Card */}
          <div className="glass-card p-6 mb-6 relative overflow-hidden border border-purple-200/30">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/80 via-white to-blue-50/80 opacity-90"></div>
            <div className="relative z-10">
              <h2 className="text-xl font-bold text-slate-800 mb-3 flex items-center">
                <span className="mr-2">✨</span>
                Advance Washing
                <span className="ml-2">🏙️</span>
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Mumbai's premier on-demand laundry service. We pickup, wash, iron, and deliver your clothes with care and precision.
              </p>
              
              {/* Service Highlights */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center text-slate-600">
                  <span className="mr-1">🚚</span>
                  Free Pickup & Delivery
                </div>
                <div className="flex items-center text-slate-600">
                  <span className="mr-1">⚡</span>
                  24-48 Hour Service
                </div>
                <div className="flex items-center text-slate-600">
                  <span className="mr-1">🧴</span>
                  Premium Care
                </div>
                <div className="flex items-center text-slate-600">
                  <span className="mr-1">📱</span>
                  Easy Tracking
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link to="/home" className="block">
{/*               <Button className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 hover:from-blue-600 hover:via-purple-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0">
                <Home className="w-5 h-5 mr-2" />
                Continue to App
              </Button> */}
            </Link>
            
            <Link to="/services" className="block">
{/*               <Button variant="outline" className="w-full bg-white/50 border-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Explore Services
              </Button> */}
            </Link>
          </div>

          {/* Mumbai Trust Badge */}
          <div className="text-center mt-6">
            <p className="text-xs text-slate-500 flex items-center justify-center">
              <span className="mr-1">🏙️</span>
              Trusted by Mumbai residents since 2020
              <span className="ml-1">⭐</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
