import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category.js';
import Product from './models/Product.js';

dotenv.config();

const categoriesData = [
  { name: 'School Supplies', slug: 'school-supplies', description: 'Backpacks, organizers, notebooks, and study essentials' },
  { name: 'Gaming & Tech', slug: 'gaming-tech', description: 'Keyboards, controllers, gaming mice, and audio accessories' },
  { name: 'Kitchen Essentials', slug: 'kitchen-essentials', description: 'Electric kettles, pots, cookers, and coffee makers' },
  { name: 'Fashion Trends', slug: 'fashion-trends', description: 'Jackets, shoes, knitwear, and sunglasses' }
];

const productsData = [
  // School Supplies
  {
    name: 'Premium Canvas Backpack',
    slug: 'premium-canvas-backpack',
    description: 'A durable, water-resistant canvas backpack with dedicated laptop protection and minimal aesthetic design. Perfect for daily commutes or study sessions.',
    price: 120.00,
    categorySlug: 'school-supplies',
    stock: 15,
    ratings: 5,
    numReviews: 8,
    images: [{ url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80', publicId: 'seeder/backpack' }]
  },
  {
    name: 'Ergonomic Desk Organizer',
    slug: 'ergonomic-desk-organizer',
    description: 'Organize your writing instruments and gadgets with this minimalist bamboo storage desk companion.',
    price: 35.00,
    categorySlug: 'school-supplies',
    stock: 50,
    ratings: 4,
    numReviews: 12,
    images: [{ url: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&q=80', publicId: 'seeder/stationery' }]
  },

  // Gaming & Tech
  {
    name: 'Wireless ANC Headphones',
    slug: 'wireless-anc-headphones',
    description: 'Immersive active noise-canceling headphones with studio-quality audio, deep bass, and comfortable memory-foam ear cushions.',
    price: 180.00,
    categorySlug: 'gaming-tech',
    stock: 10,
    ratings: 5,
    numReviews: 24,
    images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80', publicId: 'seeder/headphones' }]
  },
  {
    name: 'Custom Mechanical Keyboard',
    slug: 'custom-mechanical-keyboard',
    description: 'Compact 75% mechanical keyboard with hot-swappable tactile switches, double-shot PBT keycaps, and beautiful RGB lighting.',
    price: 150.00,
    categorySlug: 'gaming-tech',
    stock: 12,
    ratings: 5,
    numReviews: 15,
    images: [{ url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80', publicId: 'seeder/keyboard' }]
  },
  {
    name: 'Wireless Gaming Mouse',
    slug: 'wireless-gaming-mouse',
    description: 'Superlight gaming mouse with zero latency, high-precision optical sensor, and customizable side buttons.',
    price: 85.00,
    categorySlug: 'gaming-tech',
    stock: 30,
    ratings: 4,
    numReviews: 9,
    images: [{ url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&q=80', publicId: 'seeder/mouse' }]
  },
  {
    name: 'Dual-Sense Wireless Controller',
    slug: 'dual-sense-wireless-controller',
    description: 'Pro gaming controller with haptic feedback, adaptive triggers, and ergonomic rubberized grips.',
    price: 70.00,
    categorySlug: 'gaming-tech',
    stock: 25,
    ratings: 5,
    numReviews: 31,
    images: [{ url: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=600&q=80', publicId: 'seeder/controller' }]
  },

  // Kitchen Essentials
  {
    name: 'Minimalist Electric Kettle',
    slug: 'minimalist-electric-kettle',
    description: 'Sleek stainless steel electric kettle with precise temperature control and a goose-neck design for perfect pour-overs.',
    price: 75.00,
    categorySlug: 'kitchen-essentials',
    stock: 20,
    ratings: 4,
    numReviews: 19,
    images: [{ url: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=600&q=80', publicId: 'seeder/kettle' }]
  },
  {
    name: 'Multi-Functional Pressure Cooker',
    slug: 'multi-functional-pressure-cooker',
    description: 'Smart 7-in-1 multi-cooker: pressure cooker, slow cooker, rice cooker, steamer, sauté pan, and yogurt maker.',
    price: 135.00,
    categorySlug: 'kitchen-essentials',
    stock: 8,
    ratings: 5,
    numReviews: 42,
    images: [{ url: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&q=80', publicId: 'seeder/cooker' }]
  },
  {
    name: 'Non-Stick Ceramic Pot Set',
    slug: 'non-stick-ceramic-pot-set',
    description: 'Premium cookware set containing 3 non-toxic ceramic pots with tempered glass lids, induction base.',
    price: 199.00,
    categorySlug: 'kitchen-essentials',
    stock: 15,
    ratings: 5,
    numReviews: 7,
    images: [{ url: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=600&q=80', publicId: 'seeder/pots' }]
  },
  {
    name: 'Automatic Drip Coffee Maker',
    slug: 'automatic-drip-coffee-maker',
    description: 'Programmable coffee brewer with glass carafe, gold-tone mesh filter, and customizable brew strength setting.',
    price: 95.00,
    categorySlug: 'kitchen-essentials',
    stock: 18,
    ratings: 4,
    numReviews: 29,
    images: [{ url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80', publicId: 'seeder/coffee' }]
  },

  // Fashion Trends
  {
    name: 'Aesthetic Leather Sneakers',
    slug: 'aesthetic-leather-sneakers',
    description: 'Retro-style minimal leather sneakers with cushioned insoles and durable vulcanized rubber soles.',
    price: 95.00,
    categorySlug: 'fashion-trends',
    stock: 22,
    ratings: 5,
    numReviews: 38,
    images: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80', publicId: 'seeder/shoes' }]
  },
  {
    name: 'Windproof Denim Jacket',
    slug: 'windproof-denim-jacket',
    description: 'Classic relaxed-fit denim jacket made from thick, raw-cotton canvas. Perfect for layering.',
    price: 110.00,
    categorySlug: 'fashion-trends',
    stock: 14,
    ratings: 5,
    numReviews: 14,
    images: [{ url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80', publicId: 'seeder/jacket' }]
  },
  {
    name: 'Minimalist Sunglasses',
    slug: 'minimalist-sunglasses',
    description: 'Polarized UV400 protective sunglasses with premium lightweight acetate frames.',
    price: 45.00,
    categorySlug: 'fashion-trends',
    stock: 40,
    ratings: 4,
    numReviews: 53,
    images: [{ url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80', publicId: 'seeder/sunglasses' }]
  },
  {
    name: 'Chunky Knitwear Sweater',
    slug: 'chunky-knitwear-sweater',
    description: 'Warm and cozy oversized knit sweater crafted from organic cotton and merino wool blend.',
    price: 65.00,
    categorySlug: 'fashion-trends',
    stock: 30,
    ratings: 5,
    numReviews: 21,
    images: [{ url: 'https://images.unsplash.com/photo-1574164904299-3a102b110380?w=600&q=80', publicId: 'seeder/knitwear' }]
  }
];

const seedDatabase = async () => {
  try {
    const dbUri = process.env.MONGODB_URI;
    if (!dbUri) {
      throw new Error('MONGODB_URI is not defined in your environment variables');
    }

    console.log('Connecting to database...');
    await mongoose.connect(dbUri);
    console.log('Database connected successfully.');

    // 1. Clean collections
    console.log('Clearing database products and categories...');
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('Cleaned collections.');

    // 2. Insert Categories
    console.log('Inserting categories...');
    const createdCategories = await Category.insertMany(categoriesData);
    console.log(`Successfully created ${createdCategories.length} categories.`);

    // Map category slug to its mongo _id
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.slug] = cat._id;
    });

    // 3. Map products to correct category _id and insert
    console.log('Mapping products to categories...');
    const mappedProducts = productsData.map((prod) => {
      const catId = categoryMap[prod.categorySlug];
      if (!catId) {
        throw new Error(`Category ID not found for slug: ${prod.categorySlug}`);
      }
      
      const { categorySlug, ...productFields } = prod;
      return {
        ...productFields,
        category: catId
      };
    });

    console.log('Inserting products...');
    const createdProducts = await Product.insertMany(mappedProducts);
    console.log(`Successfully created ${createdProducts.length} products.`);

    console.log('Database seeding completed successfully! 🎉');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
