import express from 'express';
import Product from '../models/Product.js';
import { protect, seller } from '../middleware/auth.js';
import { upload, deleteImage } from '../utils/cloudinary.js';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find()
      .populate('seller', 'name email')
      .sort('-createdAt');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'name email')
      .populate('reviews.user', 'name');
    
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create product with photos
router.post('/', protect, seller, upload.array('photos', 5), async (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'Please upload at least one photo' });
    }

    const photoData = files.map(file => ({
      url: file.path,
      publicId: file.filename
    }));

    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      stock: req.body.stock,
      seller: req.user._id,
      mainPhoto: photoData[0],
      photos: photoData
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    // Delete uploaded images if product creation fails
    if (req.files) {
      for (const file of req.files) {
        await deleteImage(file.filename);
      }
    }
    res.status(400).json({ message: error.message });
  }
});

// Update product
router.put('/:id', protect, seller, upload.array('photos', 5), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if seller owns the product
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    // Handle new photos if uploaded
    let photoData = product.photos;
    let mainPhoto = product.mainPhoto;
    
    if (req.files && req.files.length > 0) {
      // Delete old photos from Cloudinary
      for (const photo of product.photos) {
        await deleteImage(photo.publicId);
      }

      // Process new photos
      photoData = req.files.map(file => ({
        url: file.path,
        publicId: file.filename
      }));
      mainPhoto = photoData[0];
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name || product.name,
        description: req.body.description || product.description,
        price: req.body.price || product.price,
        category: req.body.category || product.category,
        stock: req.body.stock || product.stock,
        mainPhoto,
        photos: photoData
      },
      { new: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    // Delete uploaded images if update fails
    if (req.files) {
      for (const file of req.files) {
        await deleteImage(file.filename);
      }
    }
    res.status(400).json({ message: error.message });
  }
});

// Delete product
router.delete('/:id', protect, seller, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if seller owns the product
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    // Delete photos from Cloudinary
    for (const photo of product.photos) {
      await deleteImage(photo.publicId);
    }

    await product.remove();
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add review
router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      review => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Product already reviewed' });
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
