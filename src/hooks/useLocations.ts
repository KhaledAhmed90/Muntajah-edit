import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Location {
  id: string;
  name_en: string;
  name_ar: string;
}

interface District extends Location {
  city_id: string;
}

export function useLocations(language: 'en' | 'ar') {
  const [cities, setCities] = useState<Location[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLocations() {
      try {
        // Fetch cities
        const { data: citiesData, error: citiesError } = await supabase
          .from('cities')
          .select('*')
          .order('name_en');

        if (citiesError) throw citiesError;

        // Fetch districts
        const { data: districtsData, error: districtsError } = await supabase
          .from('districts')
          .select('*')
          .order('name_en');

        if (districtsError) throw districtsError;

        setCities(citiesData || []);
        setDistricts(districtsData || []);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchLocations();
  }, []);

  const getDistrictsByCity = (cityId: string) => {
    return districts.filter(district => district.city_id === cityId);
  };

  const getCityName = (cityId: string) => {
    const city = cities.find(c => c.id === cityId);
    return city ? (language === 'ar' ? city.name_ar : city.name_en) : '';
  };

  const getDistrictName = (districtId: string) => {
    const district = districts.find(d => d.id === districtId);
    return district ? (language === 'ar' ? district.name_ar : district.name_en) : '';
  };

  return {
    cities,
    districts,
    loading,
    error,
    getDistrictsByCity,
    getCityName,
    getDistrictName
  };
}