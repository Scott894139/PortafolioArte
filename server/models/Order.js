const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: String,
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String
    }
  },
  items: [{
    storeItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StoreItem',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    },
    title: String, // Guardar el título por si se elimina el item
    image: String // Guardar la imagen por si se elimina el item
  }],
  subtotal: {
    type: Number,
    required: true
  },
  shippingCost: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['stripe', 'paypal', 'bank-transfer', 'otros']
  },
  paymentId: String, // ID de la transacción en Stripe/PayPal
  trackingNumber: String,
  shippingCarrier: String,
  notes: String, // Notas del cliente
  adminNotes: String, // Notas internas
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  shippedAt: Date,
  deliveredAt: Date
});

// Middleware para actualizar updatedAt
orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Generar número de orden automáticamente
orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    const timestamp = Date.now();
    this.orderNumber = `ORD-${timestamp}`;
  }
  next();
});

// Índices para optimización
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ 'customer.email': 1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1 });

module.exports = mongoose.model('Order', orderSchema); 