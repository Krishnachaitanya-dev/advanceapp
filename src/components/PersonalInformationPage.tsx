import React, { useState } from 'react';
import AppLayout from './AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, User, Mail, Phone, Save, Edit3, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { usePersonalInformation } from '@/hooks/usePersonalInformation';
import { useOrders } from '@/hooks/useOrders';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
const PersonalInformationPage = () => {
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const {
    personalInfo,
    setPersonalInfo,
    isLoading,
    isSaving,
    updatePersonalInfo
  } = usePersonalInformation();
  const {
    orders
  } = useOrders();
  const [isEditing, setIsEditing] = useState(false);
  const handleSave = async () => {
    try {
      await updatePersonalInfo(personalInfo);
      setIsEditing(false);
    } catch (error) {
      // Error handling is done in the hook
    }
  };
  const handleInputChange = (field: string, value: string) => {
    setPersonalInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Calculate member since date from user creation
  const memberSince = user?.created_at ? format(new Date(user.created_at), 'MMMM yyyy') : 'January 2024';

  // Get total orders count
  const totalOrders = orders?.length || 0;
  if (isLoading) {
    return <AppLayout>
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading personal information...</p>
          </div>
        </div>
      </AppLayout>;
  }
  return <AppLayout>
      <div className="h-full flex flex-col py-4 space-y-4 overflow-y-auto">
        {/* Profile Photo Section */}
        <div className="glass-card p-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              
            </div>
            <div className="text-center">
              <h2 className="text-lg font-semibold text-slate-800">
                {personalInfo.firstName && personalInfo.lastName ? `${personalInfo.firstName} ${personalInfo.lastName}` : personalInfo.firstName || 'User'}
              </h2>
              <p className="text-sm text-slate-600">{personalInfo.email}</p>
            </div>
          </div>
        </div>

        {/* Personal Information Form */}
        <div className="glass-card p-6 bg-white/95 border border-blue-200/30">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Personal Details</h3>
            {!isEditing ? <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="border-blue-300 text-blue-600 hover:bg-blue-50">
                <Edit3 className="w-4 h-4 mr-2" />
                Edit
              </Button> : <div className="flex space-x-2">
                <Button onClick={() => setIsEditing(false)} variant="outline" size="sm" className="border-gray-300">
                  Cancel
                </Button>
                <Button onClick={handleSave} size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white" disabled={isSaving}>
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
              </div>}
          </div>

          <div className="space-y-4">
            {/* First Name Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                First Name
              </label>
              {isEditing ? <Input value={personalInfo.firstName} onChange={e => handleInputChange('firstName', e.target.value)} placeholder="Enter your first name" className="premium-input" /> : <div className="p-3 bg-gray-50 rounded-lg text-slate-800">
                  {personalInfo.firstName || 'Not provided'}
                </div>}
            </div>

            {/* Last Name Field */}
            

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address
              </label>
              <div className="p-3 bg-gray-50 rounded-lg text-slate-600">
                {personalInfo.email}
                <span className="text-xs text-slate-500 block mt-1">Email cannot be changed</span>
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Phone Number
              </label>
              {isEditing ? <Input value={personalInfo.phone} onChange={e => handleInputChange('phone', e.target.value)} placeholder="Enter your phone number" type="tel" className="premium-input" /> : <div className="p-3 bg-gray-50 rounded-lg text-slate-800">
                  {personalInfo.phone || 'Not provided'}
                </div>}
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="glass-card p-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Account Information</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Account Status:</span>
              <span className="text-green-600 font-medium">Active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Member Since:</span>
              <span className="text-slate-800">{memberSince}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Total Orders:</span>
              <span className="text-slate-800">{totalOrders}</span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>;
};
export default PersonalInformationPage;