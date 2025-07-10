const express = require('express');
const router = express.Router();
const StoreItem = require('../models/StoreItem');
const Order = require('../models/Order');
const { upload, processImage, deleteFile } = require('../middleware/upload');
const { body, validationResult } = require('express-validator');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// GET - Obtener productos de la tienda
router.get('/', async (req, res) => {
  try {
    const { category, type, featured, minPrice, maxPrice, page = 1, limit = 12 } = req.query;
    const query = { isActive: true, sold: false };
    
    if (category) {
      query.category = category;
    }
    
    if (type) {
      query.type = type;
    }
    
    if (featured === 'true') {
      query.featured = true;
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const items = await StoreItem.find(query)
      .sort({ featured: -1, order: 1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await StoreItem.countDocuments(query);

    res.json({
      items,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// GET - Obtener producto específico
router.get('/:id', async (req, res) => {
  try {
    const item = await StoreItem.findById(req.params.id);
    
    if (!item || !item.isActive) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json(item);
  } catch (error) {
    console.error('Error obteniendo producto:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// GET - Obtener categorías de productos
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await StoreItem.distinct('category', { isActive: true });
    res.json(categories);
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// POST - Crear producto (admin)
router.post('/',
  upload.array('images', 5),
  [
    body('title').trim().isLength({ min: 1 }).withMessage('El título es requerido'),
    body('description').trim().isLength({ min: 1 }).withMessage('La descripción es requerida'),
    body('price').isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),
    body('category').isIn(['original', 'print', 'digital', 'comision', 'otros']).withMessage('Categoría inválida'),
    body('type').isIn(['fisico', 'digital', 'servicio']).withMessage('Tipo inválido')
  ],
  processImage,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      if (!req.processedFiles || req.processedFiles.length === 0) {
        return res.status(400).json({ message: 'Al menos una imagen es requerida' });
      }

      const images = req.processedFiles.map((file, index) => ({
        url: `/uploads/${file.filename}`,
        alt: req.body.imageAlts ? req.body.imageAlts[index] : req.body.title,
        order: index
      }));

      const item = new StoreItem({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        currency: req.body.currency || 'USD',
        mainImage: `/uploads/${req.processedFiles[0].filename}`,
        images: images,
        category: req.body.category,
        type: req.body.type,
        dimensions: req.body.dimensions ? JSON.parse(req.body.dimensions) : undefined,
        materials: req.body.materials ? req.body.materials.split(',').map(m => m.trim()) : [],
        technique: req.body.technique,
        year: req.body.year,
        stock: req.body.stock || 1,
        isUnique: req.body.isUnique === 'true',
        isDigital: req.body.isDigital === 'true',
        digitalFileType: req.body.digitalFileType,
        digitalResolution: req.body.digitalResolution,
        shippingInfo: req.body.shippingInfo ? JSON.parse(req.body.shippingInfo) : undefined,
        tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [],
        featured: req.body.featured === 'true',
        onSale: req.body.onSale === 'true',
        salePrice: req.body.salePrice,
        saleEndDate: req.body.saleEndDate,
        order: req.body.order || 0,
        seoTitle: req.body.seoTitle,
        seoDescription: req.body.seoDescription
      });

      const savedItem = await item.save();
      res.status(201).json(savedItem);
    } catch (error) {
      console.error('Error creando producto:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
);

// POST - Crear orden de compra
router.post('/orders',
  [
    body('customer.name').trim().isLength({ min: 2 }).withMessage('El nombre es requerido'),
    body('customer.email').isEmail().withMessage('Email inválido'),
    body('items').isArray({ min: 1 }).withMessage('Debe incluir al menos un producto'),
    body('items.*.storeItem').isMongoId().withMessage('ID de producto inválido'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('La cantidad debe ser al menos 1')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { customer, items, shippingCost = 0, tax = 0 } = req.body;

      // Verificar disponibilidad y calcular total
      let subtotal = 0;
      const orderItems = [];

      for (const item of items) {
        const storeItem = await StoreItem.findById(item.storeItem);
        if (!storeItem || !storeItem.isActive) {
          return res.status(400).json({ message: `Producto no encontrado: ${item.storeItem}` });
        }

        if (storeItem.stock < item.quantity) {
          return res.status(400).json({ message: `Stock insuficiente para: ${storeItem.title}` });
        }

        const itemPrice = storeItem.finalPrice || storeItem.price;
        subtotal += itemPrice * item.quantity;

        orderItems.push({
          storeItem: storeItem._id,
          quantity: item.quantity,
          price: itemPrice,
          title: storeItem.title,
          image: storeItem.mainImage
        });
      }

      const total = subtotal + shippingCost + tax;

      const order = new Order({
        customer,
        items: orderItems,
        subtotal,
        shippingCost,
        tax,
        total,
        currency: req.body.currency || 'USD',
        paymentMethod: req.body.paymentMethod || 'stripe',
        notes: req.body.notes
      });

      const savedOrder = await order.save();
      res.status(201).json(savedOrder);
    } catch (error) {
      console.error('Error creando orden:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
);

// POST - Procesar pago con Stripe
router.post('/payment/stripe',
  [
    body('orderId').isMongoId().withMessage('ID de orden inválido'),
    body('paymentMethodId').isString().withMessage('Método de pago requerido')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { orderId, paymentMethodId } = req.body;

      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Orden no encontrada' });
      }

      // Crear intención de pago en Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(order.total * 100), // Convertir a centavos
        currency: order.currency.toLowerCase(),
        payment_method: paymentMethodId,
        confirm: true,
        metadata: {
          orderId: order._id.toString(),
          customerEmail: order.customer.email
        }
      });

      // Actualizar orden con información del pago
      order.paymentId = paymentIntent.id;
      order.paymentStatus = paymentIntent.status === 'succeeded' ? 'paid' : 'pending';
      order.status = paymentIntent.status === 'succeeded' ? 'processing' : 'pending';
      
      await order.save();

      // Si el pago fue exitoso, actualizar stock
      if (paymentIntent.status === 'succeeded') {
        for (const item of order.items) {
          await StoreItem.findByIdAndUpdate(
            item.storeItem,
            { $inc: { stock: -item.quantity } }
          );
        }
      }

      res.json({
        success: paymentIntent.status === 'succeeded',
        paymentIntent,
        order
      });
    } catch (error) {
      console.error('Error procesando pago:', error);
      res.status(500).json({ message: 'Error procesando pago' });
    }
  }
);

// GET - Obtener órdenes (admin)
router.get('/orders/all', async (req, res) => {
  try {
    const { status, paymentStatus, page = 1, limit = 10 } = req.query;
    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    const orders = await Order.find(query)
      .populate('items.storeItem', 'title mainImage')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error obteniendo órdenes:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// PUT - Actualizar estado de orden (admin)
router.put('/orders/:id/status',
  [
    body('status').isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']).withMessage('Estado inválido'),
    body('trackingNumber').optional().trim(),
    body('shippingCarrier').optional().trim(),
    body('adminNotes').optional().trim()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const updateData = {
        status: req.body.status,
        trackingNumber: req.body.trackingNumber,
        shippingCarrier: req.body.shippingCarrier,
        adminNotes: req.body.adminNotes
      };

      // Establecer fechas automáticamente
      if (req.body.status === 'shipped') {
        updateData.shippedAt = new Date();
      } else if (req.body.status === 'delivered') {
        updateData.deliveredAt = new Date();
      }

      const order = await Order.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      if (!order) {
        return res.status(404).json({ message: 'Orden no encontrada' });
      }

      res.json(order);
    } catch (error) {
      console.error('Error actualizando orden:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
);

module.exports = router; 