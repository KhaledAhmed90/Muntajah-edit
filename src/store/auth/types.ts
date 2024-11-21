import { UserRole } from '../../types';

export interface VendorProfile {
  id: string;
  name: string;
  category: string;
  rating: number;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  phone: string;
  description: string;
  image: string;
}

export interface AuthUser {
  id: string;
  role: UserRole;
  vendorId?: string;
  name: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  vendor?: VendorProfile;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  users: Array<{
    id: string;
    email?: string;
    phone?: string;
    role: UserRole;
    name: string;
    created_at: string;
  }>;
}