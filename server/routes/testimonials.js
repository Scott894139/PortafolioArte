const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');
const { upload, processImage, deleteFile } = require('../middleware/upload');
const { body, validationResult } = require('express-validator');

// GET - Obtener testimonios públicos
router.get('/', async (req, res) => {
  try {
    const { featured, category, page = 1, limit = 6 } = req.query;
    const query = { approved: true, isActive: true };
    
    if (featured === 'true') {
      query.featured = true;
    }
    
    if (category) {
      query.projectCategory = category;
    }

    const testimonials = await Testimonial.find(query)
      .sort({ featured: -1, order: 1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Testimonial.countDocuments(query);

    res.json({
      testimonials,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error obteniendo testimonios:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// GET - Obtener testimonio específico
router.get('/:id', async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    
    if (!testimonial || !testimonial.approved || !testimonial.isActive) {
      return res.status(404).json({ message: 'Testimonio no encontrado' });
    }

    res.json(testimonial);
  } catch (error) {
    console.error('Error obteniendo testimonio:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// POST - Crear nuevo testimonio (público)
router.post('/',
  upload.single('image'),
  [
    body('name').trim().isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),
    body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
    body('content').trim().isLength({ min: 20 }).withMessage('El testimonio debe tener al menos 20 caracteres'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('La calificación debe ser entre 1 y 5'),
    body('projectCategory').optional().isIn(['colaboracion', 'exposicion', 'comision', 'proyecto-personal', 'otros'])
  ],
  processImage,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const testimonial = new Testimonial({
        name: req.body.name,
        email: req.body.email,
        position: req.body.position,
        company: req.body.company,
        image: req.processedFile ? `/uploads/${req.processedFile.filename}` : null,
        content: req.body.content,
        rating: req.body.rating,
        project: req.body.project,
        projectCategory: req.body.projectCategory,
        approved: false // Requiere aprobación del admin
      });

      const savedTestimonial = await testimonial.save();
      res.status(201).json({ 
        message: 'Testimonio enviado exitosamente. Será revisado antes de publicarse.',
        id: savedTestimonial._id 
      });
    } catch (error) {
      console.error('Error creando testimonio:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
);

// GET - Obtener todos los testimonios (admin)
router.get('/admin/all', async (req, res) => {
  try {
    const { approved, featured, page = 1, limit = 10 } = req.query;
    const query = {};
    
    if (approved !== undefined) {
      query.approved = approved === 'true';
    }
    
    if (featured !== undefined) {
      query.featured = featured === 'true';
    }

    const testimonials = await Testimonial.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Testimonial.countDocuments(query);

    res.json({
      testimonials,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error obteniendo testimonios (admin):', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// PUT - Actualizar testimonio (admin)
router.put('/:id',
  upload.single('image'),
  [
    body('name').trim().isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),
    body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
    body('content').trim().isLength({ min: 20 }).withMessage('El testimonio debe tener al menos 20 caracteres'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('La calificación debe ser entre 1 y 5'),
    body('projectCategory').optional().isIn(['colaboracion', 'exposicion', 'comision', 'proyecto-personal', 'otros'])
  ],
  processImage,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const testimonial = await Testimonial.findById(req.params.id);
      if (!testimonial) {
        return res.status(404).json({ message: 'Testimonio no encontrado' });
      }

      const updateData = {
        name: req.body.name,
        email: req.body.email,
        position: req.body.position,
        company: req.body.company,
        content: req.body.content,
        rating: req.body.rating,
        project: req.body.project,
        projectCategory: req.body.projectCategory,
        approved: req.body.approved === 'true',
        featured: req.body.featured === 'true',
        order: req.body.order || testimonial.order,
        isActive: req.body.isActive !== 'false'
      };

      // Si hay nueva imagen, actualizar
      if (req.processedFile) {
        // Eliminar imagen anterior
        if (testimonial.image) {
          const filename = testimonial.image.split('/').pop();
          deleteFile(filename);
        }
        
        updateData.image = `/uploads/${req.processedFile.filename}`;
      }

      const updatedTestimonial = await Testimonial.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      res.json(updatedTestimonial);
    } catch (error) {
      console.error('Error actualizando testimonio:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
);

// PUT - Aprobar/desaprobar testimonio (admin)
router.put('/:id/approve', 
  [
    body('approved').isBoolean().withMessage('El estado de aprobación debe ser un booleano')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const testimonial = await Testimonial.findByIdAndUpdate(
        req.params.id,
        { approved: req.body.approved },
        { new: true }
      );

      if (!testimonial) {
        return res.status(404).json({ message: 'Testimonio no encontrado' });
      }

      res.json(testimonial);
    } catch (error) {
      console.error('Error aprobando testimonio:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
);

// DELETE - Eliminar testimonio (admin)
router.delete('/:id', async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonio no encontrado' });
    }

    // Eliminar imagen si existe
    if (testimonial.image) {
      const filename = testimonial.image.split('/').pop();
      deleteFile(filename);
    }

    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ message: 'Testimonio eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando testimonio:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router; 