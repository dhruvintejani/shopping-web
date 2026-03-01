import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DeliveryLocation {
  country: string;
  countryCode: string;
  city: string;
  pincode: string;
}

interface LocationState {
  location: DeliveryLocation;
  isModalOpen: boolean;
  setLocation: (location: DeliveryLocation) => void;
  openModal: () => void;
  closeModal: () => void;
}

const defaultLocation: DeliveryLocation = {
  country: 'United States',
  countryCode: 'US',
  city: '',
  pincode: '',
};

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      location: defaultLocation,
      isModalOpen: false,
      setLocation: (location) => set({ location, isModalOpen: false }),
      openModal: () => set({ isModalOpen: true }),
      closeModal: () => set({ isModalOpen: false }),
    }),
    {
      name: 'shoply-location',
    }
  )
);

// Countries list
export const countries = [
  { name: 'United States', code: 'US' },
  { name: 'Canada', code: 'CA' },
  { name: 'United Kingdom', code: 'GB' },
  { name: 'Germany', code: 'DE' },
  { name: 'France', code: 'FR' },
  { name: 'India', code: 'IN' },
  { name: 'Australia', code: 'AU' },
  { name: 'Japan', code: 'JP' },
  { name: 'Brazil', code: 'BR' },
  { name: 'Mexico', code: 'MX' },
  { name: 'Spain', code: 'ES' },
  { name: 'Italy', code: 'IT' },
  { name: 'Netherlands', code: 'NL' },
  { name: 'Sweden', code: 'SE' },
  { name: 'Singapore', code: 'SG' },
  { name: 'United Arab Emirates', code: 'AE' },
  { name: 'South Korea', code: 'KR' },
  { name: 'China', code: 'CN' },
];
