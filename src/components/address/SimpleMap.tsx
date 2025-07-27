
import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from '@/hooks/useLocation';
import LocationPermissionDialog from '@/components/LocationPermissionDialog';

interface SimpleMapProps {
  onAddressSelect: (address: any, coordinates?: { lat: number; lng: number }) => void;
  initialPosition?: { lat: number; lng: number };
  onCoordinatesChange?: (coords: { lat: number; lng: number }) => void;
}

const SimpleMap = ({ onAddressSelect, initialPosition, onCoordinatesChange }: SimpleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [markerInstance, setMarkerInstance] = useState<any>(null);
  const [currentCoordinates, setCurrentCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [hideMap, setHideMap] = useState(false);
  
  // Use the native location hook
  const { 
    permissionState, 
    currentPosition, 
    isLoading: locationLoading, 
    error: locationError,
    requestPermissions,
    getCurrentLocation
  } = useLocation();

  // Initialize map only once when component mounts
  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current || mapInitialized) return;

      try {
        // Dynamically import Leaflet to avoid SSR issues
        const L = await import('leaflet');
        
        // Fix default marker icons
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        // Clear any existing content in the map container
        if (mapRef.current) {
          mapRef.current.innerHTML = '';
        }

        // Create map
        const defaultPos = initialPosition || currentPosition || { lat: 20.5937, lng: 78.9629 }; // India center
        const map = L.map(mapRef.current).setView([defaultPos.lat, defaultPos.lng], 13);

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Add marker
        const marker = L.marker([defaultPos.lat, defaultPos.lng]).addTo(map);

        // Set initial coordinates
        setCurrentCoordinates(defaultPos);
        onCoordinatesChange?.(defaultPos);

        // Handle map clicks
        map.on('click', async (e: any) => {
          const { lat, lng } = e.latlng;
          marker.setLatLng([lat, lng]);
          setCurrentCoordinates({ lat, lng });
          onCoordinatesChange?.({ lat, lng });
          await reverseGeocode(lat, lng);
        });

        setMapInstance(map);
        setMarkerInstance(marker);
        setMapInitialized(true);
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initMap();

    // Cleanup function
    return () => {
      if (mapInstance) {
        try {
          mapInstance.remove();
        } catch (error) {
          console.error('Error cleaning up map:', error);
        }
      }
      setMapInstance(null);
      setMarkerInstance(null);
      setMapInitialized(false);
    };
  }, []); // Only run once on mount

  // Update map position when current position changes
  useEffect(() => {
    if (currentPosition && mapInstance && markerInstance && mapInitialized) {
      try {
        mapInstance.setView([currentPosition.lat, currentPosition.lng], 16);
        markerInstance.setLatLng([currentPosition.lat, currentPosition.lng]);
        setCurrentCoordinates(currentPosition);
        onCoordinatesChange?.(currentPosition);
        reverseGeocode(currentPosition.lat, currentPosition.lng);
      } catch (error) {
        console.error('Error updating map position:', error);
      }
    }
  }, [currentPosition, mapInstance, markerInstance, mapInitialized]);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      setIsLoading(true);
      console.log('Reverse geocoding for:', { lat, lng });
      
      // Use multiple geocoding attempts for better pincode accuracy
      const promises = [
        // High zoom level for precise location
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=en`),
        // Lower zoom for better administrative data
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1&accept-language=en`),
        // Even lower zoom for postal code
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=12&addressdetails=1&accept-language=en`)
      ];

      const responses = await Promise.all(promises);
      const dataPromises = responses.map(response => response.json());
      const [highZoom, mediumZoom, lowZoom] = await Promise.all(dataPromises);
      
      // Try to get the most accurate pincode from different zoom levels
      let bestPincode = '';
      let bestAddress = null;
      
      for (const data of [highZoom, mediumZoom, lowZoom]) {
        if (data && data.address && data.address.postcode) {
          // Validate pincode format (6 digits)
          const pincode = data.address.postcode.replace(/\D/g, ''); // Remove non-digits
          if (pincode.length === 6) {
            bestPincode = pincode;
            bestAddress = data;
            break;
          }
        }
      }
      
      // If no good pincode found, try a nearby search
      if (!bestPincode) {
        try {
          const nearbyResponse = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&lat=${lat}&lon=${lng}&limit=5&addressdetails=1&accept-language=en`
          );
          const nearbyData = await nearbyResponse.json();
          
          for (const item of nearbyData) {
            if (item.address && item.address.postcode) {
              const pincode = item.address.postcode.replace(/\D/g, '');
              if (pincode.length === 6) {
                bestPincode = pincode;
                bestAddress = item;
                break;
              }
            }
          }
        } catch (error) {
          console.error('Nearby search failed:', error);
        }
      }
      
      // Use the best available data
      const addressData = bestAddress || highZoom;
      
      if (addressData && addressData.address) {
        const addr = addressData.address;
        
        const address = {
          street: `${addr.house_number || ''} ${addr.road || addr.pedestrian || addr.suburb || ''}`.trim(),
          city: addr.city || addr.town || addr.village || addr.county || '',
          state: addr.state || '',
          pincode: bestPincode || addr.postcode || '',
          landmark: addr.amenity || addr.shop || addr.tourism || ''
        };
        
        console.log('Address found:', address, 'Coordinates:', { lat, lng });
        onAddressSelect(address, { lat, lng });
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationRequest = () => {
    // Only request location when app is in foreground for Google Play compliance
    if (document.visibilityState !== 'visible') {
      console.log('Location request blocked - app not in foreground');
      return;
    }

    // Always show dialog first, regardless of permission state
    setShowLocationDialog(true);
  };

  const handleAllowLocation = async () => {
    // User clicked "Yes" - hide dialog and request location
    setShowLocationDialog(false);
    
    // Request permissions after user agrees
    const granted = await requestPermissions();
    if (granted) {
      // Get current location using native GPS
      await getCurrentLocation();
    }
  };

  const handleDeclineLocation = () => {
    // User clicked "No" - hide dialog and hide map
    setShowLocationDialog(false);
    setHideMap(true);
  };

  const isGettingLocation = locationLoading || isLoading;

  // If map is hidden, don't render it
  if (hideMap) {
    return (
      <div className="glass-card overflow-hidden relative">
        <div className="p-6 text-center">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Location access declined</p>
          <Button
            onClick={() => setHideMap(false)}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Show Map
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden relative">
      <div className="p-3 bg-white/5 border-b border-white/10">
        <div className="flex items-center justify-between">
          <p className="text-sm text-white/70">
            📍 Click on map to set location
          </p>
          
          <Button
            type="button"
            size="sm"
            onClick={handleLocationRequest}
            disabled={isGettingLocation}
            className="bg-blue-500 hover:bg-blue-600 text-white text-xs"
          >
            {isGettingLocation ? (
              <>
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                Getting Location...
              </>
            ) : (
              <>
                <MapPin className="mr-1 h-3 w-3" />
                Update Location
              </>
            )}
          </Button>
        </div>
        
        {locationError && (
          <p className="text-xs text-red-300 mt-1">{locationError}</p>
        )}
      </div>
      
      <div 
        ref={mapRef} 
        className="h-64 w-full"
        style={{ minHeight: '256px' }}
      />
      
      {/* Location Permission Dialog - Positioned above the map */}
      {showLocationDialog && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50">
          <LocationPermissionDialog
            isOpen={showLocationDialog}
            onAllow={handleAllowLocation}
            onDecline={handleDeclineLocation}
          />
        </div>
      )}
      
      {isGettingLocation && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-40">
          <div className="bg-white/90 px-3 py-2 rounded-lg flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span className="text-sm">Getting address...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleMap;
