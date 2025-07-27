import React, { ReactNode, memo, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, User, Package, Sparkles, Star } from 'lucide-react';
interface AppLayoutProps {
  children: ReactNode;
}
const AppLayout = memo(({
  children
}: AppLayoutProps) => {
  const location = useLocation();
  const [scrollY, setScrollY] = useState(0);

  // Track scroll for header effects
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [location.pathname]);
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Dynamic greeting based on current time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Get greeting emoji
  const getGreetingEmoji = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '🌅';
    if (hour < 17) return '☀️';
    return '🌆';
  };
  return <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Floating Geometric Shapes with better colors */}
        <div className="absolute top-10 left-10 w-3 h-3 bg-blue-300/40 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-32 right-20 w-2 h-2 bg-purple-300/30 rounded-full animate-bounce opacity-50" style={{
        animationDelay: '1s'
      }}></div>
        <div className="absolute bottom-40 left-16 w-4 h-4 bg-green-300/35 rounded-full animate-pulse opacity-40" style={{
        animationDelay: '2s'
      }}></div>
        <div className="absolute bottom-20 right-10 w-3 h-3 bg-orange-300/40 rounded-full animate-bounce opacity-50" style={{
        animationDelay: '0.5s'
      }}></div>
      </div>

      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-3 py-2 glass-card mx-2 mt-2 relative overflow-hidden group border border-blue-200/30">
        {/* Header Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/80 via-white to-purple-50/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 opacity-80"></div>
        
        {/* Floating Sparkles */}
        <div className="absolute top-1 right-3">
          <Sparkles className="w-3 h-3 text-blue-400 animate-pulse opacity-70" />
        </div>
        <div className="absolute bottom-1 left-4">
          <Star className="w-2 h-2 text-purple-400 animate-bounce opacity-50" style={{
          animationDelay: '1s'
        }} />
        </div>

        <div className="flex items-center justify-center relative z-10">
          <div className="flex items-center">
            <div className="gentle-float mr-3 relative">
              {/* Logo Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur-md opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div className="w-8 h-8 relative z-10 flex items-center justify-center bg-white/20 rounded-lg transform group-hover:scale-110 transition-transform duration-300 p-1 py-px px-px">
                <img src="/lovable-uploads/a05b96c2-641b-4469-8482-6d8bd89c81e9.png" alt="AW Logo" className="w-full h-full object-contain" onError={e => {
                // Fallback if image fails to load
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 rounded flex items-center justify-center text-white font-bold text-xs">AW</div>';
              }} />
              </div>
            </div>
            <div className="text-left">
              <h1 className="text-slate-800 text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent group-hover:scale-105 transition-all duration-300">
                Advance Washing ✨
              </h1>
              <p className="text-slate-600 text-xs flex items-start font-medium -ml-0">
                <span className="mr-1">{getGreetingEmoji()}</span>
                {getGreeting()}, Mumbai!
                <span className="ml-1">🏙️</span>
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content with reduced top padding for smaller gap */}
      <main className="flex-1 pt-6 pb-20 px-2 overflow-y-auto relative z-10 bg-transparent py-[12px]">
        <div className="h-full">
          {children}
        </div>
      </main>

      {/* Fixed Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 px-2 pb-2">
        <div className="glass-card rounded-2xl shadow-2xl border border-white/30 relative overflow-hidden">
          {/* Navigation Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/90 via-white to-purple-50/90 opacity-90"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 opacity-80"></div>
          
          {/* Navigation Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 via-transparent to-purple-100/30 opacity-0 hover:opacity-50 transition-opacity duration-500"></div>

          <div className="flex justify-around items-center py-2 relative z-10">
            <Link to="/" className={`px-3 py-2 flex flex-col items-center min-h-[50px] justify-center rounded-xl transition-all duration-500 interactive-scale group relative overflow-hidden ${isActive('/') ? 'text-white bg-gradient-to-b from-blue-500 via-blue-600 to-blue-700 shadow-xl scale-110' : 'text-slate-700 hover:text-blue-600 hover:bg-gradient-to-b hover:from-blue-50 hover:to-purple-50'}`}>
              {isActive('/') && <>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse"></div>
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                </>}
              <Home size={18} className="mb-1 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-[9px] font-semibold">Home</span>
            </Link>
            
            <Link to="/services" className={`px-3 py-2 flex flex-col items-center min-h-[50px] justify-center rounded-xl transition-all duration-500 interactive-scale group relative overflow-hidden ${isActive('/services') ? 'text-white bg-gradient-to-b from-purple-500 via-purple-600 to-purple-700 shadow-xl scale-110' : 'text-slate-700 hover:text-purple-600 hover:bg-gradient-to-b hover:from-purple-50 hover:to-blue-50'}`}>
              {isActive('/services') && <>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse"></div>
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"></div>
                </>}
              <ShoppingBag size={18} className="mb-1 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-[9px] font-semibold">Services</span>
            </Link>
            
            <Link to="/orders" className={`px-3 py-2 flex flex-col items-center min-h-[50px] justify-center rounded-xl transition-all duration-500 interactive-scale group relative overflow-hidden ${isActive('/orders') ? 'text-white bg-gradient-to-b from-green-500 via-green-600 to-green-700 shadow-xl scale-110' : 'text-slate-700 hover:text-green-600 hover:bg-gradient-to-b hover:from-green-50 hover:to-blue-50'}`}>
              {isActive('/orders') && <>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse"></div>
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-gradient-to-r from-green-400 to-blue-400 rounded-full"></div>
                </>}
              <Package size={18} className="mb-1 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-[9px] font-semibold">Orders</span>
            </Link>
            
            <Link to="/profile" className={`px-3 py-2 flex flex-col items-center min-h-[50px] justify-center rounded-xl transition-all duration-500 interactive-scale group relative overflow-hidden ${isActive('/profile') ? 'text-white bg-gradient-to-b from-orange-500 via-orange-600 to-orange-700 shadow-xl scale-110' : 'text-slate-700 hover:text-orange-600 hover:bg-gradient-to-b hover:from-orange-50 hover:to-purple-50'}`}>
              {isActive('/profile') && <>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse"></div>
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-gradient-to-r from-orange-400 to-purple-400 rounded-full"></div>
                </>}
              <User size={18} className="mb-1 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-[9px] font-semibold">Profile</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>;
});
AppLayout.displayName = 'AppLayout';
export default AppLayout;