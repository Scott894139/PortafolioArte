const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  position: {
    type: String,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  image: {
    type: String // URL de la foto del cliente
  },
  content: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  project: {
    type: String, // Nombre del proyecto relacionado
    trim: true
  },
  projectCategory: {
    type: String,
    enum: ['colaboracion', 'exposicion', 'comision', 'proyecto-personal', 'otros']
  },
  approved: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
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
testimonialSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Índices para optimización
testimonialSchema.index({ approved: 1, featured: -1 });
testimonialSchema.index({ rating: -1 });
testimonialSchema.index({ projectCategory: 1 });

module.exports = mongoose.model('Testimonial', testimonialSchema); 