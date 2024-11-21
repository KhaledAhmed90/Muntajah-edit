export interface Vendor {
  id: string;
  name: string;
  category: 'food' | 'clothing' | 'crafts' | 'accessories' | 'home-decor' | 'beauty';
  rating: number;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  phone: string;
  description: string;
  image: string;
  image_base64?: string;
  products: Product[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  image_base64?: string;
  inStock: boolean;
  reviews: Review[];
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export type UserRole = 'admin' | 'vendor' | 'customer';

export interface User {
  id: string;
  role: UserRole;
  vendorId?: string;
  name: string;
  email?: string;
  phone?: string;
  avatar_base64?: string;
  city?: string;
  district?: string;
  vendor?: Vendor;
}