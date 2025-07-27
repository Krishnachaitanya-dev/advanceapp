import React, { memo } from 'react';
import AppLayout from './AppLayout';
import { Button } from '@/components/ui/button';
import { User, MapPin, Star, Shield, FileText, LogOut, ChevronRight, Award, Heart, Sparkles, Database } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';

const ProfilePage = memo(() => {
  const { user, signOut } = useAuth();
  const { isAdmin, profile } = useUserRole();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
  };

  const accountMenuItems = [{
    icon: <User className="w-5 h-5" />,
    label: 'Personal Information',
    path: '/personal-information',
    description: 'Update your profile details',
    gradient: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700'
  }, {
    icon: <MapPin className="w-5 h-5" />,
    label: 'Address Management', 
    path: '/address-management',
    description: 'Manage your delivery addresses',
    gradient: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700'
  }];

  const supportMenuItems = [{
    icon: <Star className="w-5 h-5" />,
    label: 'Rate Our App',
    path: '/rate-app', 
    description: 'Share your feedback',
    gradient: 'from-yellow-500 to-orange-500',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700'
  }, {
    icon: <Shield className="w-5 h-5" />,
    label: 'Privacy Policy',
    path: '/privacy-policy',
    description: 'How we protect your data',
    gradient: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700'
  }, {
    icon: <FileText className="w-5 h-5" />,
    label: 'Terms of Service',
    path: '/terms-of-service',
    description: 'App terms and conditions',
    gradient: 'from-slate-500 to-slate-600',
    bgColor: 'bg-slate-50',
    textColor: 'text-slate-700'
  }, {
    icon: <Database className="w-5 h-5" />,
    label: 'Data Management',
    path: '/data-management',
    description: 'Manage your personal data and privacy',
    gradient: 'from-teal-500 to-teal-600',
    bgColor: 'bg-teal-50',
    textColor: 'text-teal-700'
  }];

  return (
    <AppLayout>
      <div className="h-full flex flex-col py-4 space-y-4 overflow-y-auto">
        <div className="glass-card p-4 relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 border border-blue-200/30">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-transparent rounded-full -mr-16 -mt-16 opacity-50"></div>
          <div className="absolute top-4 right-4">
            <Sparkles className="w-6 h-6 text-blue-400 animate-pulse" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg gentle-float">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-slate-800 mb-1">
                  {profile?.name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'} ✨
                </h2>
                <p className="text-slate-600 text-sm mb-2">{user?.email}</p>
                {isAdmin && (
                  <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-medium rounded-full shadow-sm">
                    <Award className="w-3 h-3 mr-1" />
                    Admin
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-4 bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 border border-amber-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Heart className="w-6 h-6 text-red-500 animate-pulse" />
              <div>
                <p className="font-semibold text-slate-800 text-sm">Mumbai Family Member 🏠</p>
                <p className="text-slate-600 text-xs">Thank you for trusting us with your laundry!</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-amber-600">★★★★★</p>
              <p className="text-xs text-slate-600">Premium User</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-slate-700 text-sm font-semibold uppercase tracking-wide px-2 flex items-center">
            <User className="w-4 h-4 mr-2 text-blue-500" />
            Account Settings
          </h3>
          <div className="space-y-2">
            {accountMenuItems.map((item, index) => (
              <Link key={index} to={item.path}>
                <div className={`glass-card p-4 hover:shadow-xl transition-all duration-300 interactive-scale relative overflow-hidden ${item.bgColor} border border-blue-200/30`}>
                  <div className={`absolute left-0 top-0 w-1 h-full bg-gradient-to-b ${item.gradient}`}></div>
                  <div className="flex items-center justify-between pl-2">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${item.gradient} text-white shadow-sm hover:scale-110 transition-transform`}>
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <p className={`font-semibold text-sm ${item.textColor}`}>{item.label}</p>
                        <p className="text-slate-500 text-xs">{item.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-slate-700 text-sm font-semibold uppercase tracking-wide px-2 flex items-center">
            <Shield className="w-4 h-4 mr-2 text-purple-500" />
            Support & Legal
          </h3>
          <div className="space-y-2">
            {supportMenuItems.map((item, index) => (
              <Link key={index} to={item.path}>
                <div className={`glass-card p-4 hover:shadow-xl transition-all duration-300 interactive-scale relative overflow-hidden ${item.bgColor} border border-blue-200/30`}>
                  <div className={`absolute left-0 top-0 w-1 h-full bg-gradient-to-b ${item.gradient}`}></div>
                  <div className="flex items-center justify-between pl-2">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${item.gradient} text-white shadow-sm hover:scale-110 transition-transform`}>
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <p className={`font-semibold text-sm ${item.textColor}`}>{item.label}</p>
                        <p className="text-slate-500 text-xs">{item.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="glass-card p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200">
          <Button 
            onClick={handleSignOut} 
            variant="outline" 
            className="w-full border-red-300 bg-white hover:bg-red-50 hover:border-red-400 text-red-600 font-medium h-12 interactive-scale shadow-sm hover:shadow-md transition-all"
          >
            <LogOut className="w-5 h-5 mr-2" />
            <span>Sign Out</span>
          </Button>
        </div>

        <div className="text-center text-slate-500 text-xs space-y-1">
          <p className="font-medium">Advance Washing v1.0.0</p>
          <p className="flex items-center justify-center space-x-1">
            <span>Made with</span>
            <Heart className="w-3 h-3 text-red-500" />
            <span>in Mumbai</span>
          </p>
        </div>
      </div>
    </AppLayout>
  );
});

ProfilePage.displayName = 'ProfilePage';
export default ProfilePage;
