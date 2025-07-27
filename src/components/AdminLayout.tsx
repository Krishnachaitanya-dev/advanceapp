
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Shield, Sparkles, BarChart3 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-4 h-4 bg-white/20 rounded-full animate-bounce opacity-60"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-yellow-300/30 rounded-full animate-pulse opacity-50" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-16 w-5 h-5 bg-green-300/25 rounded-full animate-bounce opacity-40" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-10 w-3 h-3 bg-purple-300/30 rounded-full animate-pulse opacity-50" style={{ animationDelay: '0.5s' }}></div>
        
        {/* Floating admin icons */}
        <div className="absolute top-32 left-1/4 text-white/15 animate-float">
          <BarChart3 className="w-6 h-6" />
        </div>
        <div className="absolute bottom-32 right-1/4 text-white/20 animate-pulse" style={{ animationDelay: '3s' }}>
          <Shield className="w-5 h-5" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 relative z-10">
        {/* Enhanced Admin Header */}
        <div className="glass-card-admin p-6 mb-6 shadow-2xl">
          <div className="absolute top-4 right-6">
            <Sparkles className="w-6 h-6 text-blue-500 animate-pulse" />
          </div>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center">
                <Shield className="w-8 h-8 mr-3 text-blue-600" />
                Admin Dashboard ⚡
              </h1>
              <p className="text-slate-600 text-lg">
                Welcome back, <span className="font-semibold text-blue-600">{user?.user_metadata?.name || user?.email}</span> 👋
              </p>
              <p className="text-slate-500 text-sm mt-1">
                Manage your laundry service operations with ease
              </p>
            </div>
            <Button 
              onClick={handleSignOut}
              variant="outline" 
              className="border-red-300 bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-400 flex items-center space-x-2 px-6 py-3 h-auto font-medium shadow-sm hover:shadow-md transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>

        {/* Admin Content with enhanced styling */}
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
