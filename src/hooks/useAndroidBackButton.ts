
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { App } from '@capacitor/app';
import { PluginListenerHandle } from '@capacitor/core';

export const useAndroidBackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let backButtonListener: PluginListenerHandle;

    const setupBackButtonListener = async () => {
      const handleBackButton = () => {
        // If we're on the home page, exit the app
        if (location.pathname === '/home' || location.pathname === '/') {
          App.exitApp();
          return;
        }
        
        // Otherwise, navigate back
        navigate(-1);
      };

      // Await the listener setup
      backButtonListener = await App.addListener('backButton', handleBackButton);
    };

    setupBackButtonListener();

    // Cleanup
    return () => {
      if (backButtonListener) {
        backButtonListener.remove();
      }
    };
  }, [location.pathname, navigate]);
};
