
export interface Address {
  id: string;
  doorNo: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  name?: string;
  label: AddressLabel;
  coordinates?: {
    lat: number;
    lng: number;
  };
  isDefault?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type AddressLabel = 'home' | 'work' | 'other';

export interface AddressFormData {
  doorNo: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  name?: string;
  label: AddressLabel;
}

export interface LocationPermissionState {
  status: 'granted' | 'denied' | 'prompt' | 'prompt-with-rationale' | 'unknown';
  canRequest: boolean;
}

export interface MapPosition {
  lat: number;
  lng: number;
  zoom: number;
}
