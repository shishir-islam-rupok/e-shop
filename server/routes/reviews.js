const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { auth } = require('../middleware/auth');
const upload = require('../utils/multer');
const cloudinary = require('../utils/cloudinary');

// Get all reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all reviews by a user
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.params.userId })
      .populate('product', 'name images price')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a review
router.post('/', auth, upload.array('images', 5), async (req, res) => {
  try {
    const { productId, rating, title, comment } = req.body;

    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({
      user: req.user.id,
      product: productId
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    // Upload images to Cloudinary if any
    const images = [];
    if (req.files) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'reviews'
        });
        images.push({
          url: result.secure_url,
          publicId: result.public_id
        });
      }
    }

    const review = new Review({
      user: req.user.id,
      product: productId,
      rating: Number(rating),
      title,
      comment,
      images
    });

    await review.save();

    // Populate user info before sending response
    await review.populate('user', 'name avatar');

    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a review
router.patch('/:id', auth, upload.array('images', 5), async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const updates = req.body;
    const allowedUpdates = ['rating', 'title', 'comment'];
    const isValidOperation = Object.keys(updates).every(update =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid updates' });
    }

    // Upload new images if any
    if (req.files && req.files.length > 0) {
      // Delete old images from Cloudinary
      for (const image of review.images) {
        await cloudinary.uploader.destroy(image.publicId);
      }

      // Upload new images
      const images = [];
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'reviews'
        });
        images.push({
          url: result.secure_url,
          publicId: result.public_id
        });
      }
      review.images = images;
    }

    // Update review fields
    Object.keys(updates).forEach(update => {
      review[update] = updates[update];
    });

    await review.save();
    res.json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a review
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Delete images from Cloudinary
    for (const image of review.images) {
      await cloudinary.uploader.destroy(image.publicId);
    }

    await review.remove();
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Like/Unlike a review
router.post('/:id/like', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const likeIndex = review.likes.indexOf(req.user.id);
    if (likeIndex === -1) {
      // Like
      review.likes.push(req.user.id);
    } else {
      // Unlike
      review.likes.splice(likeIndex, 1);
    }

    await review.save();
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
