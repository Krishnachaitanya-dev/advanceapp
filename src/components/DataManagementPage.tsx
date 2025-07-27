import React, { useState } from 'react';
import AppLayout from './AppLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Trash2, Shield, AlertTriangle, FileText, User, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const DataManagementPage = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      console.log('Starting data export for user:', user?.id);
      
      // Fetch all user data
      const [profileData, ordersData, addressesData] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user?.id).single(),
        supabase.from('orders').select('*').eq('user_id', user?.id),
        supabase.from('addresses').select('*').eq('user_id', user?.id)
      ]);

      console.log('Export data fetched:', {
        profile: profileData.data,
        orders: ordersData.data?.length || 0,
        addresses: addressesData.data?.length || 0
      });

      const userData = {
        profile: profileData.data,
        orders: ordersData.data || [],
        addresses: addressesData.data || [],
        account_info: {
          email: user?.email,
          created_at: user?.created_at,
          last_sign_in: user?.last_sign_in_at
        },
        export_date: new Date().toISOString()
      };

      // Create and download JSON file
      const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `advance-washing-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Data Exported Successfully",
        description: "Your data has been downloaded as a JSON file."
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Unable to export your data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    console.log('Starting account deletion for user:', user?.id);
    
    try {
      if (!user?.id) {
        throw new Error('User ID not found');
      }

      console.log('Calling delete_user_account edge function...');
      
      // Call the edge function directly
      const { data, error } = await supabase.functions.invoke('delete_user_account', {
        body: { user_id: user.id }
      });

      console.log('Edge function response:', { data, error });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(`Edge function failed: ${error.message}`);
      }

      if (data && !data.success) {
        console.error('Edge function returned error:', data);
        throw new Error(data.details || data.error || 'Account deletion failed');
      }

      console.log('Account deletion completed successfully:', data);
      
      toast({
        title: "Account Deleted Successfully",
        description: "Your account and all data have been permanently deleted. You will now be signed out."
      });

      // Wait a moment then sign out and redirect
      setTimeout(async () => {
        console.log('Signing out user after successful deletion...');
        await signOut();
        navigate('/login');
      }, 2000);

    } catch (error: any) {
      console.error('Delete account error:', error);
      toast({
        title: "Deletion Failed",
        description: `Unable to delete your account: ${error.message}. Please contact support for assistance.`,
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const dataTypes = [
    {
      icon: <User className="w-5 h-5" />,
      name: "Personal Information",
      description: "Name, email, phone number, and profile data",
      color: "text-blue-600 bg-blue-50"
    },
    {
      icon: <FileText className="w-5 h-5" />,
      name: "Order History", 
      description: "All your past orders, items, and service requests",
      color: "text-green-600 bg-green-50"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      name: "Address Information",
      description: "Saved pickup and delivery addresses", 
      color: "text-purple-600 bg-purple-50"
    }
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center mb-6 bg-transparent">
          <Link to="/settings" className="mr-4 p-2 hover:bg-white/10 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-black">Data Management</h1>
            <p className="text-black">Manage your personal data and privacy preferences</p>
          </div>
        </div>

        {/* Data Types Overview */}
        <div className="glass-card p-6 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Your Data with Us</h2>
          <div className="space-y-4">
            {dataTypes.map((type, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm">
                <div className={`p-2 rounded-lg ${type.color}`}>
                  {type.icon}
                </div>
                <div>
                  <h3 className="font-medium text-slate-800">{type.name}</h3>
                  <p className="text-sm text-slate-600">{type.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Rights Actions */}
        <div className="glass-card p-6 bg-gradient-to-br from-slate-50 to-gray-50 border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Your Rights & Actions</h2>
          
          <div className="space-y-4">
            {/* View Data */}
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200">
              <div className="flex items-center space-x-3">
                <Eye className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="font-medium text-slate-800">View Your Data</h3>
                  <p className="text-sm text-slate-600">See what personal information we have about you</p>
                </div>
              </div>
              <Link to="/personal-information">
                <Button variant="outline" size="sm">
                  View Profile
                </Button>
              </Link>
            </div>

            {/* Export Data */}
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200">
              <div className="flex items-center space-x-3">
                <Download className="w-5 h-5 text-green-600" />
                <div>
                  <h3 className="font-medium text-slate-800">Export Your Data</h3>
                  <p className="text-sm text-slate-600">Download a copy of all your personal data</p>
                </div>
              </div>
              <Button 
                onClick={handleExportData} 
                disabled={isExporting} 
                className="bg-green-600 hover:bg-green-700"
              >
                {isExporting ? "Exporting..." : "Export Data"}
              </Button>
            </div>

            {/* Delete Account */}
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center space-x-3">
                <Trash2 className="w-5 h-5 text-red-600" />
                <div>
                  <h3 className="font-medium text-red-800">Delete Your Account</h3>
                  <p className="text-sm text-red-600">Permanently delete your account and all data</p>
                </div>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white border-2 border-red-200">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-red-800 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Delete Account Permanently?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-600">
                      This action cannot be undone. This will permanently delete your account and remove all your data from our servers, including:
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Your profile and personal information</li>
                        <li>All order history and records</li>
                        <li>Saved addresses and preferences</li>
                        <li>Account settings and data</li>
                      </ul>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDeleteAccount} 
                      disabled={isDeleting} 
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isDeleting ? "Deleting..." : "Yes, Delete Account"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="glass-card p-6 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200">
          <h2 className="text-lg font-semibold text-amber-800 mb-3">Need Help?</h2>
          <p className="text-amber-700 text-sm mb-4">
            If you have questions about your data or need assistance with data requests, contact our privacy team:
          </p>
          <div className="space-y-2 text-sm text-amber-700">
            <p><strong>Email:</strong> info@advancewashing.com</p>
            <p><strong>Phone:</strong> +91 8928478081</p>
            <p><strong>Address:</strong> Second floor Nirman Ind Estate, Chincholi Link Road, Near Fire Brigade, Malad West Mumbai - 400064</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default DataManagementPage;
