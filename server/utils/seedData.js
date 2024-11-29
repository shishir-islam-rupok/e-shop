import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

// Sample product data
const products = [
  {
    name: "Classic Cotton T-Shirt",
    description: "Premium quality cotton t-shirt with comfortable fit. Available in multiple sizes.",
    price: 19.99,
    category: "clothing",
    stock: 100,
    mainPhoto: {
      url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
      publicId: "sample_photo"
    },
    photos: [
      {
        url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
        publicId: "sample_photo"
      }
    ]
  },
  {
    name: "Wireless Gaming Mouse",
    description: "High-precision wireless gaming mouse with RGB lighting and programmable buttons.",
    price: 49.99,
    category: "electronics",
    stock: 50,
    mainPhoto: {
      url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
      publicId: "sample_photo"
    },
    photos: [
      {
        url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
        publicId: "sample_photo"
      }
    ]
  },
  {
    name: "Graphic Design T-Shirt",
    description: "Unique graphic design t-shirt made with high-quality print. Perfect for casual wear.",
    price: 24.99,
    category: "clothing",
    stock: 75,
    mainPhoto: {
      url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
      publicId: "sample_photo"
    },
    photos: [
      {
        url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
        publicId: "sample_photo"
      }
    ]
  },
  {
    name: "Bluetooth Earbuds",
    description: "True wireless earbuds with noise cancellation and long battery life.",
    price: 89.99,
    category: "electronics",
    stock: 30,
    mainPhoto: {
      url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
      publicId: "sample_photo"
    },
    photos: [
      {
        url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
        publicId: "sample_photo"
      }
    ]
  },
  {
    name: "Smart Fitness Watch",
    description: "Track your health and fitness with this advanced smartwatch. Features heart rate monitoring and sleep tracking.",
    price: 129.99,
    category: "electronics",
    stock: 40,
    mainPhoto: {
      url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
      publicId: "sample_photo"
    },
    photos: [
      {
        url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
        publicId: "sample_photo"
      }
    ]
  },
  {
    name: "Sports T-Shirt",
    description: "Moisture-wicking sports t-shirt perfect for workouts and running.",
    price: 29.99,
    category: "clothing",
    stock: 60,
    mainPhoto: {
      url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
      publicId: "sample_photo"
    },
    photos: [
      {
        url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
        publicId: "sample_photo"
      }
    ]
  },
  {
    name: "Mechanical Gaming Keyboard",
    description: "RGB mechanical keyboard with customizable switches and macro keys.",
    price: 79.99,
    category: "electronics",
    stock: 25,
    mainPhoto: {
      url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
      publicId: "sample_photo"
    },
    photos: [
      {
        url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
        publicId: "sample_photo"
      }
    ]
  },
  {
    name: "Vintage Band T-Shirt",
    description: "Classic rock band t-shirt with retro design. Made from soft cotton blend.",
    price: 22.99,
    category: "clothing",
    stock: 45,
    mainPhoto: {
      url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
      publicId: "sample_photo"
    },
    photos: [
      {
        url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
        publicId: "sample_photo"
      }
    ]
  }
];

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Clear existing products
    await Product.deleteMany({});
    
    // Create a seller account
    const hashedPassword = await bcrypt.hash('password123', 10);
    const seller = await User.create({
      name: 'Sample Seller',
      email: 'seller@example.com',
      password: hashedPassword,
      role: 'seller'
    });

    // Add seller reference to products
    const productsWithSeller = products.map(product => ({
      ...product,
      seller: seller._id
    }));

    // Insert products
    await Product.insertMany(productsWithSeller);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
