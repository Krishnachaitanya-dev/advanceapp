import React from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
interface LocationPermissionDialogProps {
  isOpen: boolean;
  onAllow: () => void;
  onDecline: () => void;
}
const LocationPermissionDialog = ({
  isOpen,
  onAllow,
  onDecline
}: LocationPermissionDialogProps) => {
  return <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-sm p-0 bg-slate-100 border-0 shadow-2xl mx-px">
        <div className="bg-white rounded-xl p-6 m-3">
          <div className="text-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">Enable Location Access</h2>
            <p className="text-slate-600 text-sm mb-4">
              To provide you with the best pickup and delivery experience
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-3 mb-4">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              </div>
              <div>
                <h4 className="font-medium text-slate-800 text-sm">Accurate Address Detection</h4>
                <p className="text-slate-600 text-xs">Automatically detect your exact pickup location</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
              </div>
              <div>
                <h4 className="font-medium text-slate-800 text-sm">Precise Delivery Times</h4>
                <p className="text-slate-600 text-xs">Get accurate time estimates based on location</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
              </div>
              <div>
                <h4 className="font-medium text-slate-800 text-sm">Privacy Protected</h4>
                <p className="text-slate-600 text-xs">Location only used when actively using the app</p>
              </div>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="bg-blue-50 rounded-lg p-3 mb-4 border-l-4 border-blue-400">
            <p className="text-xs text-blue-800">
              <span className="font-semibold">Your Privacy:</span> We only access your location when you're using the app to 
              schedule pickups or deliveries. Your location data is never shared with 
              third parties and is only used to improve our service quality.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button onClick={onAllow} className="flex-1 bg-green-600 hover:bg-green-700 text-white h-11 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
              <MapPin className="w-4 h-4 mr-2" />
              Yes
            </Button>
            
            <Button onClick={onDecline} variant="outline" className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 border-red-200 hover:border-red-300 h-11 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
              No
            </Button>
          </div>

          <p className="text-center text-xs text-slate-500 mt-3">
            You can change this permission anytime in your device settings
          </p>
        </div>
      </DialogContent>
    </Dialog>;
};
export default LocationPermissionDialog;