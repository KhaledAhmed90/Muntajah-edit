import { useEffect, useState } from 'react';
import { useVendorStore } from '../store/vendorStore';
import { useAuthStore } from '../store/authStore';
import { Vendor } from '../types';

export function useVendorData() {
  const { user } = useAuthStore();
  const { fetchVendors, vendors, loading, error } = useVendorStore();
  const [vendorData, setVendorData] = useState<Vendor | null>(null);

  useEffect(() => {
    const loadVendorData = async () => {
      if (user?.vendorId) {
        await fetchVendors();
      }
    };
    loadVendorData();
  }, [user?.vendorId, fetchVendors]);

  useEffect(() => {
    if (user?.vendorId && vendors.length > 0) {
      const vendor = vendors.find(v => v.id === user.vendorId);
      setVendorData(vendor || null);
    } else {
      setVendorData(null);
    }
  }, [user?.vendorId, vendors]);

  return { vendor: vendorData, loading, error };
}