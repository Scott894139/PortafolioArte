const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Contact = require('../models/Contact');
const { body, validationResult } = require('express-validator');

// Configurar transporter de email
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// POST - Enviar mensaje de contacto
router.post('/',
  [
    body('name').trim().isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),
    body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
    body('subject').trim().isLength({ min: 5 }).withMessage('El asunto debe tener al menos 5 caracteres'),
    body('message').trim().isLength({ min: 10 }).withMessage('El mensaje debe tener al menos 10 caracteres'),
    body('type').optional().isIn(['general', 'colaboracion', 'comision', 'compra', 'otros']),
    body('budget').optional().isIn(['menos-500', '500-1000', '1000-2500', '2500-5000', 'mas-5000', 'no-especificado']),
    body('timeline').optional().isIn(['urgente', '1-semana', '2-4-semanas', '1-2-meses', 'flexible'])
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, phone, subject, message, type, budget, timeline, projectDetails } = req.body;

      // Guardar en base de datos
      const contact = new Contact({
        name,
        email,
        phone,
        subject,
        message,
        type: type || 'general',
        budget: budget || 'no-especificado',
        timeline: timeline || 'flexible',
        projectDetails,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      const savedContact = await contact.save();

      // Enviar email al artista
      const artistMailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `Nuevo mensaje de contacto: ${subject}`,
        html: `
          <h2>Nuevo mensaje de contacto</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Teléfono:</strong> ${phone}</p>` : ''}
          <p><strong>Asunto:</strong> ${subject}</p>
          <p><strong>Tipo:</strong> ${type}</p>
          ${budget !== 'no-especificado' ? `<p><strong>Presupuesto:</strong> ${budget}</p>` : ''}
          <p><strong>Tiempo:</strong> ${timeline}</p>
          <p><strong>Mensaje:</strong></p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
            ${message.replace(/\n/g, '<br>')}
          </div>
          ${projectDetails ? `
            <p><strong>Detalles del proyecto:</strong></p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
              ${projectDetails.replace(/\n/g, '<br>')}
            </div>
          ` : ''}
          <p><strong>Fecha:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>IP:</strong> ${req.ip}</p>
        `
      };

      // Enviar email de confirmación al cliente
      const clientMailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Confirmación de mensaje recibido',
        html: `
          <h2>Hola ${name},</h2>
          <p>Gracias por contactarme. He recibido tu mensaje y me pondré en contacto contigo lo antes posible.</p>
          <p><strong>Tu mensaje:</strong></p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
            <p><strong>Asunto:</strong> ${subject}</p>
            <p><strong>Mensaje:</strong> ${message}</p>
          </div>
          <p>Saludos cordiales,<br>Artista Digital</p>
        `
      };

      // Enviar emails
      await transporter.sendMail(artistMailOptions);
      await transporter.sendMail(clientMailOptions);

      res.status(201).json({ 
        message: 'Mensaje enviado exitosamente',
        id: savedContact._id 
      });
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
);

// GET - Obtener mensajes (admin)
router.get('/', async (req, res) => {
  try {
    const { status, type, page = 1, limit = 10 } = req.query;
    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (type) {
      query.type = type;
    }

    const messages = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Contact.countDocuments(query);

    res.json({
      messages,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error obteniendo mensajes:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// GET - Obtener mensaje específico (admin)
router.get('/:id', async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ message: 'Mensaje no encontrado' });
    }

    // Marcar como leído si es nuevo
    if (message.status === 'nuevo') {
      message.status = 'leido';
      await message.save();
    }

    res.json(message);
  } catch (error) {
    console.error('Error obteniendo mensaje:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// PUT - Actualizar estado del mensaje (admin)
router.put('/:id/status',
  [
    body('status').isIn(['nuevo', 'leido', 'respondido', 'cerrado']).withMessage('Estado inválido'),
    body('notes').optional().trim()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const message = await Contact.findByIdAndUpdate(
        req.params.id,
        { 
          status: req.body.status,
          notes: req.body.notes 
        },
        { new: true }
      );

      if (!message) {
        return res.status(404).json({ message: 'Mensaje no encontrado' });
      }

      res.json(message);
    } catch (error) {
      console.error('Error actualizando mensaje:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
);

// DELETE - Eliminar mensaje (admin)
router.delete('/:id', async (req, res) => {
  try {
    const message = await Contact.findByIdAndDelete(req.params.id);
    
    if (!message) {
      return res.status(404).json({ message: 'Mensaje no encontrado' });
    }

    res.json({ message: 'Mensaje eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando mensaje:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router; 