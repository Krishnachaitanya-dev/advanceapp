import { useState, useCallback } from 'react';
import { useLocation } from './useLocation';

interface LocationPermissionFlow {
  showExplanation: boolean;
  hasPermission: boolean;
  isLoading: boolean;
  error: string | null;
  requestLocationWithExplanation: () => void;
  skipLocationPermission: () => void;
  resetFlow: () => void;
}

export const useLocationPermission = (): LocationPermissionFlow => {
  const [showExplanation, setShowExplanation] = useState(false);
  const [hasExplainedPermission, setHasExplainedPermission] = useState(false);
  
  const {
    permissionState,
    isLoading,
    error,
    requestPermissions,
    getCurrentLocation
  } = useLocation();

  const requestLocationWithExplanation = useCallback(async () => {
    // Google Play compliance: Show explanation before requesting permission
    if (!hasExplainedPermission && permissionState.status === 'unknown') {
      setShowExplanation(true);
      setHasExplainedPermission(true);
      return;
    }

    // If explanation was shown, proceed with permission request
    if (permissionState.status === 'unknown' || permissionState.status === 'denied') {
      const granted = await requestPermissions();
      if (granted) {
        await getCurrentLocation();
        setShowExplanation(false);
      }
    } else if (permissionState.status === 'granted') {
      await getCurrentLocation();
      setShowExplanation(false);
    }
  }, [permissionState.status, hasExplainedPermission, requestPermissions, getCurrentLocation]);

  const skipLocationPermission = useCallback(() => {
    setShowExplanation(false);
    setHasExplainedPermission(true);
  }, []);

  const resetFlow = useCallback(() => {
    setShowExplanation(false);
    setHasExplainedPermission(false);
  }, []);

  return {
    showExplanation,
    hasPermission: permissionState.status === 'granted',
    isLoading,
    error,
    requestLocationWithExplanation,
    skipLocationPermission,
    resetFlow
  };
};