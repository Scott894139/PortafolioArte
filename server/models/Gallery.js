const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['pintura', 'ilustracion-digital', 'diseño-grafico', 'arte-conceptual', 'otros']
  },
  technique: {
    type: String,
    required: true
  },
  dimensions: {
    width: Number,
    height: Number,
    unit: {
      type: String,
      enum: ['cm', 'px', 'in'],
      default: 'cm'
    }
  },
  year: {
    type: Number,
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  seoTitle: String,
  seoDescription: String,
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware para actualizar updatedAt
gallerySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Índices para optimización
gallerySchema.index({ category: 1, featured: -1 });
gallerySchema.index({ year: -1 });
gallerySchema.index({ tags: 1 });

module.exports = mongoose.model('Gallery', gallerySchema); 