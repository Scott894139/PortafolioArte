const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');
const { upload, processImage, deleteFile } = require('../middleware/upload');
const { body, validationResult } = require('express-validator');

// GET - Obtener todas las obras de la galería
router.get('/', async (req, res) => {
  try {
    const { category, featured, page = 1, limit = 12 } = req.query;
    const query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (featured === 'true') {
      query.featured = true;
    }

    const items = await Gallery.find(query)
      .sort({ featured: -1, order: 1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Gallery.countDocuments(query);

    res.json({
      items,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error obteniendo galería:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// GET - Obtener obra específica por ID
router.get('/:id', async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    
    if (!item || !item.isActive) {
      return res.status(404).json({ message: 'Obra no encontrada' });
    }

    res.json(item);
  } catch (error) {
    console.error('Error obteniendo obra:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// GET - Obtener categorías disponibles
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Gallery.distinct('category', { isActive: true });
    res.json(categories);
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// GET - Obtener tags populares
router.get('/tags/popular', async (req, res) => {
  try {
    const tags = await Gallery.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);
    
    res.json(tags.map(tag => tag._id));
  } catch (error) {
    console.error('Error obteniendo tags:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// POST - Crear nueva obra (admin)
router.post('/', 
  upload.single('image'),
  [
    body('title').trim().isLength({ min: 1 }).withMessage('El título es requerido'),
    body('description').trim().isLength({ min: 1 }).withMessage('La descripción es requerida'),
    body('category').isIn(['pintura', 'ilustracion-digital', 'diseño-grafico', 'arte-conceptual', 'otros']).withMessage('Categoría inválida'),
    body('technique').trim().isLength({ min: 1 }).withMessage('La técnica es requerida'),
    body('year').isInt({ min: 1900, max: new Date().getFullYear() }).withMessage('Año inválido')
  ],
  processImage,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      if (!req.processedFile) {
        return res.status(400).json({ message: 'Imagen requerida' });
      }

      const galleryItem = new Gallery({
        title: req.body.title,
        description: req.body.description,
        image: `/uploads/${req.processedFile.filename}`,
        thumbnail: `/uploads/thumbnails/${req.processedFile.thumbnail}`,
        category: req.body.category,
        technique: req.body.technique,
        year: req.body.year,
        dimensions: req.body.dimensions ? JSON.parse(req.body.dimensions) : undefined,
        tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [],
        featured: req.body.featured === 'true',
        order: req.body.order || 0,
        seoTitle: req.body.seoTitle,
        seoDescription: req.body.seoDescription
      });

      const savedItem = await galleryItem.save();
      res.status(201).json(savedItem);
    } catch (error) {
      console.error('Error creando obra:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
);

// PUT - Actualizar obra (admin)
router.put('/:id',
  upload.single('image'),
  [
    body('title').trim().isLength({ min: 1 }).withMessage('El título es requerido'),
    body('description').trim().isLength({ min: 1 }).withMessage('La descripción es requerida'),
    body('category').isIn(['pintura', 'ilustracion-digital', 'diseño-grafico', 'arte-conceptual', 'otros']).withMessage('Categoría inválida'),
    body('technique').trim().isLength({ min: 1 }).withMessage('La técnica es requerida'),
    body('year').isInt({ min: 1900, max: new Date().getFullYear() }).withMessage('Año inválido')
  ],
  processImage,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const item = await Gallery.findById(req.params.id);
      if (!item) {
        return res.status(404).json({ message: 'Obra no encontrada' });
      }

      const updateData = {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        technique: req.body.technique,
        year: req.body.year,
        dimensions: req.body.dimensions ? JSON.parse(req.body.dimensions) : item.dimensions,
        tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : item.tags,
        featured: req.body.featured === 'true',
        order: req.body.order || item.order,
        seoTitle: req.body.seoTitle,
        seoDescription: req.body.seoDescription
      };

      // Si hay nueva imagen, actualizar y eliminar la anterior
      if (req.processedFile) {
        // Eliminar imagen anterior
        if (item.image) {
          const filename = item.image.split('/').pop();
          deleteFile(filename);
        }
        
        updateData.image = `/uploads/${req.processedFile.filename}`;
        updateData.thumbnail = `/uploads/thumbnails/${req.processedFile.thumbnail}`;
      }

      const updatedItem = await Gallery.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      res.json(updatedItem);
    } catch (error) {
      console.error('Error actualizando obra:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
);

// DELETE - Eliminar obra (admin)
router.delete('/:id', async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Obra no encontrada' });
    }

    // Eliminar archivos de imagen
    if (item.image) {
      const filename = item.image.split('/').pop();
      deleteFile(filename);
    }

    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Obra eliminada exitosamente' });
  } catch (error) {
    console.error('Error eliminando obra:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router; 