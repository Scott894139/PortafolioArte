const mongoose = require('mongoose');

const storeItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'MXN', 'COP', 'ARS']
  },
  mainImage: {
    type: String,
    required: true
  },
  images: [{
    url: String,
    alt: String,
    order: Number
  }],
  category: {
    type: String,
    required: true,
    enum: ['original', 'print', 'digital', 'comision', 'otros']
  },
  type: {
    type: String,
    required: true,
    enum: ['fisico', 'digital', 'servicio']
  },
  dimensions: {
    width: Number,
    height: Number,
    depth: Number,
    unit: {
      type: String,
      enum: ['cm', 'in', 'px'],
      default: 'cm'
    }
  },
  materials: [{
    type: String,
    trim: true
  }],
  technique: {
    type: String,
    trim: true
  },
  year: {
    type: Number
  },
  stock: {
    type: Number,
    default: 1,
    min: 0
  },
  isUnique: {
    type: Boolean,
    default: true // Para obras originales
  },
  isDigital: {
    type: Boolean,
    default: false
  },
  digitalFileType: {
    type: String,
    enum: ['jpg', 'png', 'pdf', 'psd', 'ai', 'otros']
  },
  digitalResolution: {
    type: String // ej: "300 DPI", "4K"
  },
  shippingInfo: {
    weight: Number, // en gramos
    packageDimensions: {
      width: Number,
      height: Number,
      depth: Number
    },
    shippingCost: Number,
    freeShippingThreshold: Number
  },
  tags: [{
    type: String,
    trim: true
  }],
  featured: {
    type: Boolean,
    default: false
  },
  onSale: {
    type: Boolean,
    default: false
  },
  salePrice: {
    type: Number,
    min: 0
  },
  saleEndDate: {
    type: Date
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
  sold: {
    type: Boolean,
    default: false
  },
  soldDate: {
    type: Date
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
storeItemSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Marcar como vendido si no hay stock
  if (this.stock === 0 && this.isUnique) {
    this.sold = true;
    this.soldDate = Date.now();
  }
  
  next();
});

// Método virtual para precio final (considerando descuentos)
storeItemSchema.virtual('finalPrice').get(function() {
  if (this.onSale && this.salePrice && this.saleEndDate > Date.now()) {
    return this.salePrice;
  }
  return this.price;
});

// Índices para optimización
storeItemSchema.index({ category: 1, isActive: 1 });
storeItemSchema.index({ featured: -1, isActive: 1 });
storeItemSchema.index({ price: 1 });
storeItemSchema.index({ tags: 1 });
storeItemSchema.index({ sold: 1 });

module.exports = mongoose.model('StoreItem', storeItemSchema); 