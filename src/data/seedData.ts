import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

// First, create users with auth
async function createUsers() {
  const users = [
    {
      email: 'ahmed@example.com',
      password: 'password123',
      data: {
        name: 'Ahmed Abdullah',
        phone: '+966501234567',
        role: 'customer'
      }
    },
    {
      email: 'fatima@example.com',
      password: 'password123',
      data: {
        name: 'Fatima Mohammed',
        phone: '+966512345678',
        role: 'customer'
      }
    },
    {
      email: 'omar@example.com',
      password: 'password123',
      data: {
        name: 'Omar Saeed',
        phone: '+966523456789',
        role: 'customer'
      }
    },
    {
      email: 'aisha@example.com',
      password: 'password123',
      data: {
        name: 'Aisha Rahman',
        phone: '+966534567890',
        role: 'customer'
      }
    },
    {
      email: 'khalid@example.com',
      password: 'password123',
      data: {
        name: 'Khalid Hassan',
        phone: '+966545678901',
        role: 'customer'
      }
    }
  ];

  const createdUsers = [];

  for (const user of users) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
      options: {
        data: user.data
      }
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('No user data received');

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        user_id: authData.user.id,
        name: user.data.name,
        email: user.email,
        phone: user.data.phone,
        role: user.data.role
      });

    if (profileError) throw profileError;
    createdUsers.push(authData.user);
  }

  return createdUsers;
}

const vendors = [
  {
    name: "Layla's Kitchen",
    category: 'food',
    rating: 4.8,
    location: 'Riyadh, Saudi Arabia',
    coordinates: { lat: 24.7136, lng: 46.6753 },
    phone: '+966 50 123 4567',
    description: 'Traditional homemade Saudi dishes prepared with love and care.',
    image: 'https://images.unsplash.com/photo-1590577976322-3d2d6e2130d5?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: "Noor's Fashion House",
    category: 'clothing',
    rating: 4.9,
    location: 'Jeddah, Saudi Arabia',
    coordinates: { lat: 21.5433, lng: 39.1728 },
    phone: '+966 55 987 6543',
    description: 'Exquisite handmade abayas and traditional wear with modern touches.',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: "Sarah's Beauty Essentials",
    category: 'beauty',
    rating: 4.9,
    location: 'Riyadh, Saudi Arabia',
    coordinates: { lat: 24.7136, lng: 46.6753 },
    phone: '+966 57 432 1098',
    description: 'Natural and organic beauty products made with traditional ingredients.',
    image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: "Fatima's Handicrafts",
    category: 'crafts',
    rating: 4.8,
    location: 'Medina, Saudi Arabia',
    coordinates: { lat: 24.5247, lng: 39.5692 },
    phone: '+966 56 789 0123',
    description: 'Traditional handicrafts and modern artistic creations.',
    image: 'https://images.unsplash.com/photo-1621886292650-520f76c747d6?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: "Amira's Sweet Treats",
    category: 'food',
    rating: 4.7,
    location: 'Dammam, Saudi Arabia',
    coordinates: { lat: 26.4207, lng: 50.0888 },
    phone: '+966 54 321 7890',
    description: 'Homemade desserts and traditional Arabic sweets made with love.',
    image: 'https://images.unsplash.com/photo-1593347535897-620bfa187c85?auto=format&fit=crop&q=80&w=800'
  }
];

function generateProducts(vendor_id: string, category: string) {
  return [
    {
      name: category === 'food' ? 'Traditional Kabsa' : 
            category === 'clothing' ? 'Modern Abaya' :
            category === 'beauty' ? 'Organic Face Oil' :
            category === 'crafts' ? 'Hand-woven Carpet' : 'Premium Box Set',
      description: 'Premium quality product made with the finest materials and traditional techniques.',
      price: Math.floor(Math.random() * 300) + 100,
      image: vendors.find(v => v.category === category)?.image || '',
      in_stock: true,
      vendor_id
    },
    {
      name: category === 'food' ? 'Arabic Coffee Set' :
            category === 'clothing' ? 'Embroidered Kaftan' :
            category === 'beauty' ? 'Natural Hair Oil' :
            category === 'crafts' ? 'Ceramic Vase Set' : 'Deluxe Collection',
      description: 'Handcrafted with attention to detail and premium quality materials.',
      price: Math.floor(Math.random() * 200) + 150,
      image: vendors.find(v => v.category === category)?.image || '',
      in_stock: true,
      vendor_id
    },
    {
      name: category === 'food' ? 'Dates Selection' :
            category === 'clothing' ? 'Designer Scarf' :
            category === 'beauty' ? 'Organic Soap Set' :
            category === 'crafts' ? 'Wall Art' : 'Special Package',
      description: 'Unique pieces that combine traditional craftsmanship with modern design.',
      price: Math.floor(Math.random() * 150) + 50,
      image: vendors.find(v => v.category === category)?.image || '',
      in_stock: true,
      vendor_id
    },
    {
      name: category === 'food' ? 'Baklava Box' :
            category === 'clothing' ? 'Luxury Shawl' :
            category === 'beauty' ? 'Essential Oils' :
            category === 'crafts' ? 'Decorative Plates' : 'Gift Set',
      description: 'Perfect blend of quality and style, made for those who appreciate excellence.',
      price: Math.floor(Math.random() * 250) + 75,
      image: vendors.find(v => v.category === category)?.image || '',
      in_stock: true,
      vendor_id
    },
    {
      name: category === 'food' ? 'Traditional Sweets' :
            category === 'clothing' ? 'Evening Wear' :
            category === 'beauty' ? 'Skincare Set' :
            category === 'crafts' ? 'Handmade Jewelry' : 'Premium Selection',
      description: 'Exclusive collection featuring the finest materials and expert craftsmanship.',
      price: Math.floor(Math.random() * 400) + 200,
      image: vendors.find(v => v.category === category)?.image || '',
      in_stock: true,
      vendor_id
    }
  ];
}

function generateReviews(product_id: string, users: any[]) {
  const reviewCount = Math.floor(Math.random() * 3) + 3; // 3-5 reviews per product
  return Array.from({ length: reviewCount }, () => ({
    product_id,
    profile_id: users[Math.floor(Math.random() * users.length)].id,
    rating: Math.floor(Math.random() * 2) + 4, // 4-5 star ratings
    comment: 'Excellent product! Very satisfied with the quality and service.',
    created_at: new Date().toISOString()
  }));
}

export async function seedDatabase() {
  try {
    // Clear existing data
    await supabase.from('reviews').delete().neq('id', '0');
    await supabase.from('products').delete().neq('id', '0');
    await supabase.from('vendors').delete().neq('id', '0');
    await supabase.from('profiles').delete().eq('role', 'customer');

    // Create users first
    const users = await createUsers();

    // Insert vendors
    const { data: createdVendors, error: vendorError } = await supabase
      .from('vendors')
      .insert(vendors)
      .select();

    if (vendorError) throw vendorError;
    if (!createdVendors) throw new Error('No vendors created');

    // Insert products for each vendor
    for (const vendor of createdVendors) {
      const products = generateProducts(vendor.id, vendor.category);
      const { data: createdProducts, error: productError } = await supabase
        .from('products')
        .insert(products)
        .select();

      if (productError) throw productError;
      if (!createdProducts) continue;

      // Insert reviews for each product
      for (const product of createdProducts) {
        const reviews = generateReviews(product.id, users);
        const { error: reviewError } = await supabase
          .from('reviews')
          .insert(reviews);

        if (reviewError) throw reviewError;
      }
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}