import { memo, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocationStore, countries, DeliveryLocation } from '../../store/locationStore';
import { useReducedMotion } from '../../hooks/useDebounce';

export const LocationModal = memo(function LocationModal() {
  const { location, isModalOpen, setLocation, closeModal } = useLocationStore();
  const prefersReducedMotion = useReducedMotion();
  
  const [formData, setFormData] = useState<DeliveryLocation>(location);
  const [searchCountry, setSearchCountry] = useState('');

  useEffect(() => {
    if (isModalOpen) {
      setFormData(location);
      setSearchCountry('');
    }
  }, [isModalOpen, location]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isModalOpen, closeModal]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setLocation(formData);
  }, [formData, setLocation]);

  const handleCountrySelect = useCallback((country: typeof countries[0]) => {
    setFormData(prev => ({
      ...prev,
      country: country.name,
      countryCode: country.code,
    }));
    setSearchCountry('');
  }, []);

  const filteredCountries = countries.filter(c => 
    c.name.toLowerCase().includes(searchCountry.toLowerCase())
  );

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 },
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={overlayVariants}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/50"
            onClick={closeModal}
          />

          {/* Modal */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Choose your location</h2>
              <button
                onClick={closeModal}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="p-6">
              <p className="text-sm text-gray-600 mb-6">
                Delivery options and speeds may vary for different locations
              </p>

              {/* Country Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country/Region
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchCountry || formData.country}
                    onChange={(e) => setSearchCountry(e.target.value)}
                    onFocus={() => setSearchCountry('')}
                    placeholder="Search country..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                {/* Country Dropdown */}
                {searchCountry && (
                  <div className="mt-1 max-h-48 overflow-y-auto border border-gray-200 rounded-lg bg-white shadow-lg">
                    {filteredCountries.length > 0 ? (
                      filteredCountries.map((country) => (
                        <button
                          key={country.code}
                          type="button"
                          onClick={() => handleCountrySelect(country)}
                          className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-orange-50 transition-colors flex items-center gap-3"
                        >
                          <span className="w-6 h-4 bg-gray-200 rounded text-xs flex items-center justify-center font-medium">
                            {country.code}
                          </span>
                          {country.name}
                        </button>
                      ))
                    ) : (
                      <p className="px-4 py-3 text-sm text-gray-500">No countries found</p>
                    )}
                  </div>
                )}
              </div>

              {/* City */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City (optional)
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="Enter your city"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* ZIP/Pincode */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP / Postal Code (optional)
                </label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData(prev => ({ ...prev, pincode: e.target.value }))}
                  placeholder="Enter ZIP or postal code"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
                >
                  Apply
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});
