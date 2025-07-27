
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.advancewashing.app',
  appName: 'advancewashing',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // Remove the development URL for production builds
    // url: 'https://b916e345-5208-4d12-a131-dcb9bd3b440b.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    allowMixedContent: true,
    webContentsDebuggingEnabled: false,
    backgroundColor: '#3B82F6',
    // Add better handling for offline content
    useLegacyBridge: false
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#3B82F6',
      showSpinner: true,
      spinnerColor: '#ffffff'
    },
    // Add App plugin for better mobile handling
    App: {
      launchUrl: 'index.html'
    },
    // Add Geolocation plugin configuration for Google Play compliance
    Geolocation: {
      // Foreground location access only for pickup/delivery services
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 3600000,
      // Ensure location is only accessed when app is active
      requestPermissions: true,
      // Business justification: accurate pickup and delivery services
      usageDescription: "Location access is used to provide accurate pickup and delivery services"
    }
  }
};

export default config;
