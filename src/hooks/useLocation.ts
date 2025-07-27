
import { useState, useEffect } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';
import { LocationPermissionState, MapPosition } from '@/types/address';

export const useLocation = () => {
  const [permissionState, setPermissionState] = useState<LocationPermissionState>({
    status: 'unknown',
    canRequest: true
  });
  const [currentPosition, setCurrentPosition] = useState<MapPosition | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isNative = Capacitor.isNativePlatform();

  const checkPermissions = async () => {
    try {
      if (isNative) {
        const permissions = await Geolocation.checkPermissions();
        setPermissionState({
          status: permissions.location as LocationPermissionState['status'],
          canRequest: permissions.location !== 'denied'
        });
        return permissions.location;
      } else {
        // For web, we check if geolocation is supported
        if ('geolocation' in navigator) {
          setPermissionState({
            status: 'unknown',
            canRequest: true
          });
          return 'unknown';
        } else {
          setPermissionState({
            status: 'denied',
            canRequest: false
          });
          return 'denied';
        }
      }
    } catch (err) {
      console.error('Error checking permissions:', err);
      setError('Failed to check location permissions');
      return 'unknown';
    }
  };

  const requestPermissions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (isNative) {
        const permissions = await Geolocation.requestPermissions();
        setPermissionState({
          status: permissions.location as LocationPermissionState['status'],
          canRequest: permissions.location !== 'denied'
        });
        return permissions.location === 'granted';
      } else {
        // For web, requesting permission happens when we call getCurrentPosition
        // The browser will show its native permission dialog
        return new Promise<boolean>((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              // Permission was granted
              setPermissionState({
                status: 'granted',
                canRequest: true
              });
              resolve(true);
            },
            (error) => {
              console.error('Web geolocation error:', error);
              if (error.code === error.PERMISSION_DENIED) {
                setPermissionState({
                  status: 'denied',
                  canRequest: false
                });
                setError('Location permission denied');
              } else {
                setError('Failed to get location: ' + error.message);
              }
              resolve(false);
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0
            }
          );
        });
      }
    } catch (err) {
      console.error('Error requesting permissions:', err);
      setError('Failed to request location permissions');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (isNative) {
        const position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 10000
        });

        const newPosition: MapPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          zoom: 16
        };

        setCurrentPosition(newPosition);
        return newPosition;
      } else {
        // Use web geolocation API
        return new Promise<MapPosition | null>((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const newPosition: MapPosition = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                zoom: 16
              };

              setCurrentPosition(newPosition);
              setPermissionState({
                status: 'granted',
                canRequest: true
              });
              resolve(newPosition);
            },
            (error) => {
              console.error('Web geolocation error:', error);
              if (error.code === error.PERMISSION_DENIED) {
                setError('Location permission denied');
                setPermissionState({
                  status: 'denied',
                  canRequest: false
                });
              } else {
                setError('Failed to get current location: ' + error.message);
              }
              resolve(null);
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0
            }
          );
        });
      }
    } catch (err) {
      console.error('Error getting location:', err);
      setError('Failed to get current location');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkPermissions();
  }, []);

  return {
    permissionState,
    currentPosition,
    isLoading,
    error,
    checkPermissions,
    requestPermissions,
    getCurrentLocation
  };
};
