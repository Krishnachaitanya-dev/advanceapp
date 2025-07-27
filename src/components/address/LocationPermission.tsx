
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, AlertCircle, Loader2 } from 'lucide-react';

interface LocationPermissionProps {
  onLocationGranted: (position: { lat: number; lng: number }) => void;
}

const LocationPermission = ({ onLocationGranted }: LocationPermissionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const handleRequestLocation = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check if geolocation is supported
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser');
      }

      // Get current position
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes
          }
        );
      });

      const coords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      onLocationGranted(coords);
    } catch (err: any) {
      console.error('Location error:', err);
      
      if (err.code === 1) { // PERMISSION_DENIED
        setPermissionDenied(true);
        setError('Location access denied. Please enable location in your browser settings.');
      } else if (err.code === 2) { // POSITION_UNAVAILABLE
        setError('Location information is unavailable.');
      } else if (err.code === 3) { // TIMEOUT
        setError('Location request timed out. Please try again.');
      } else {
        setError('Failed to get location. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="glass-card p-6 text-center">
        <AlertCircle className="mx-auto text-red-400 mb-4" size={48} />
        <h3 className="text-lg font-medium text-white mb-2">Location Error</h3>
        <p className="text-white/70 mb-4">{error}</p>
        {!permissionDenied && (
          <Button
            onClick={handleRequestLocation}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            Try Again
          </Button>
        )}
      </div>
    );
  }

  if (permissionDenied) {
    return (
      <div className="glass-card p-6 text-center">
        <MapPin className="mx-auto text-white/40 mb-4" size={48} />
        <h3 className="text-lg font-medium text-white mb-2">Location Access Denied</h3>
        <p className="text-white/70 mb-4">
          Please enable location access in your browser settings to automatically fill your address.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 text-center">
      <MapPin className="mx-auto text-green-400 mb-4" size={48} />
      <h3 className="text-lg font-medium text-white mb-2">Use Your Location</h3>
      <p className="text-white/70 mb-4">
        Allow location access to automatically detect and fill your address details.
      </p>
      <Button
        onClick={handleRequestLocation}
        disabled={isLoading}
        className="bg-green-500 hover:bg-green-600 text-white"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Getting Location...
          </>
        ) : (
          <>
            <MapPin className="mr-2 h-4 w-4" />
            Use My Location
          </>
        )}
      </Button>
    </div>
  );
};

export default LocationPermission;
