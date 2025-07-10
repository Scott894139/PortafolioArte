const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
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
  phone: {
    type: String,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['general', 'colaboracion', 'comision', 'compra', 'otros'],
    default: 'general'
  },
  budget: {
    type: String,
    enum: ['menos-500', '500-1000', '1000-2500', '2500-5000', 'mas-5000', 'no-especificado'],
    default: 'no-especificado'
  },
  timeline: {
    type: String,
    enum: ['urgente', '1-semana', '2-4-semanas', '1-2-meses', 'flexible'],
    default: 'flexible'
  },
  projectDetails: {
    type: String
  },
  status: {
    type: String,
    enum: ['nuevo', 'leido', 'respondido', 'cerrado'],
    default: 'nuevo'
  },
  notes: {
    type: String // Notas internas del artista
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
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
contactSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Índices para optimización
contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ type: 1 });
contactSchema.index({ email: 1 });

module.exports = mongoose.model('Contact', contactSchema); 