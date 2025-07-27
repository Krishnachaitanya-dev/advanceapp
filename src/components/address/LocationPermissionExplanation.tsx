import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Clock, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LocationPermissionExplanationProps {
  onAllowLocation: () => void;
  onEnterManually: () => void;
  isLoading?: boolean;
}

const LocationPermissionExplanation = ({ 
  onAllowLocation, 
  onEnterManually, 
  isLoading = false 
}: LocationPermissionExplanationProps) => {
  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <MapPin className="w-8 h-8 text-blue-600" />
        </div>
        <CardTitle className="text-xl text-slate-800">
          Enable Location Access
        </CardTitle>
        <p className="text-slate-600 text-sm">
          To provide you with the best pickup and delivery experience
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Navigation className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-slate-800">Accurate Address Detection</h4>
              <p className="text-sm text-slate-600">
                Automatically detect your exact pickup location without manual entry
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <h4 className="font-medium text-slate-800">Precise Delivery Times</h4>
              <p className="text-sm text-slate-600">
                Get accurate time estimates based on your exact location
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium text-slate-800">Privacy Protected</h4>
              <p className="text-sm text-slate-600">
                Location is only used when you're actively using the app
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
          <p className="text-sm text-blue-800">
            <strong>Your Privacy:</strong> We only access your location when you're using the app 
            to schedule pickups or deliveries. Your location data is never shared with third parties 
            and is only used to improve our service quality.
          </p>
        </div>
        
        <div className="flex flex-col space-y-3 pt-2">
          <Button
            onClick={onAllowLocation}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? (
              <>
                <MapPin className="mr-2 h-4 w-4 animate-pulse" />
                Requesting Permission...
              </>
            ) : (
              <>
                <MapPin className="mr-2 h-4 w-4" />
                Allow Location Access
              </>
            )}
          </Button>
          
          <Button
            onClick={onEnterManually}
            variant="outline"
            className="w-full border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Enter Address Manually
          </Button>
        </div>
        
        <p className="text-xs text-slate-500 text-center">
          You can change this permission anytime in your device settings
        </p>
      </CardContent>
    </Card>
  );
};

export default LocationPermissionExplanation;