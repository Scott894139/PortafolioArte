const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  detailedDescription: {
    type: String,
    required: true
  },
  mainImage: {
    type: String,
    required: true
  },
  images: [{
    url: String,
    caption: String,
    order: Number
  }],
  category: {
    type: String,
    required: true,
    enum: ['colaboracion', 'exposicion', 'comision', 'proyecto-personal', 'otros']
  },
  client: {
    type: String,
    trim: true
  },
  year: {
    type: Number,
    required: true
  },
  duration: {
    type: String // ej: "3 meses", "1 año"
  },
  process: [{
    step: String,
    description: String,
    image: String
  }],
  materials: [{
    type: String,
    trim: true
  }],
  challenges: {
    type: String
  },
  results: {
    type: String
  },
  testimonial: {
    text: String,
    author: String,
    position: String,
    company: String
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
projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Índices para optimización
projectSchema.index({ category: 1, featured: -1 });
projectSchema.index({ year: -1 });
projectSchema.index({ tags: 1 });

module.exports = mongoose.model('Project', projectSchema); 