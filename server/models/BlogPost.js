const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  excerpt: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  featuredImage: {
    type: String,
    required: true
  },
  images: [{
    url: String,
    caption: String,
    alt: String
  }],
  category: {
    type: String,
    required: true,
    enum: ['proceso-creativo', 'tutorial', 'reflexiones', 'noticias', 'inspiracion', 'otros']
  },
  tags: [{
    type: String,
    trim: true
  }],
  author: {
    type: String,
    default: 'Artista'
  },
  published: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date
  },
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: [{
    author: String,
    email: String,
    content: String,
    approved: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  seoTitle: String,
  seoDescription: String,
  readTime: {
    type: Number, // minutos estimados de lectura
    default: 5
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
blogPostSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Establecer publishedAt si se está publicando por primera vez
  if (this.published && !this.publishedAt) {
    this.publishedAt = Date.now();
  }
  
  next();
});

// Índices para optimización
blogPostSchema.index({ published: 1, publishedAt: -1 });
blogPostSchema.index({ category: 1, published: 1 });
blogPostSchema.index({ tags: 1 });
blogPostSchema.index({ slug: 1 });

module.exports = mongoose.model('BlogPost', blogPostSchema); 