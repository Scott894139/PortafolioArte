const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { upload, processImage, deleteFile } = require('../middleware/upload');
const { body, validationResult } = require('express-validator');

// GET - Obtener todos los proyectos
router.get('/', async (req, res) => {
  try {
    const { category, featured, page = 1, limit = 6 } = req.query;
    const query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (featured === 'true') {
      query.featured = true;
    }

    const projects = await Project.find(query)
      .sort({ featured: -1, order: 1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Project.countDocuments(query);

    res.json({
      projects,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error obteniendo proyectos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// GET - Obtener proyecto específico por ID
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project || !project.isActive) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error obteniendo proyecto:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// GET - Obtener categorías de proyectos
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Project.distinct('category', { isActive: true });
    res.json(categories);
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// POST - Crear nuevo proyecto (admin)
router.post('/',
  upload.array('images', 10),
  [
    body('title').trim().isLength({ min: 1 }).withMessage('El título es requerido'),
    body('description').trim().isLength({ min: 1 }).withMessage('La descripción es requerida'),
    body('detailedDescription').trim().isLength({ min: 1 }).withMessage('La descripción detallada es requerida'),
    body('category').isIn(['colaboracion', 'exposicion', 'comision', 'proyecto-personal', 'otros']).withMessage('Categoría inválida'),
    body('year').isInt({ min: 1900, max: new Date().getFullYear() }).withMessage('Año inválido')
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
        caption: req.body.captions ? req.body.captions[index] : '',
        order: index
      }));

      const project = new Project({
        title: req.body.title,
        description: req.body.description,
        detailedDescription: req.body.detailedDescription,
        mainImage: `/uploads/${req.processedFiles[0].filename}`,
        images: images,
        category: req.body.category,
        client: req.body.client,
        year: req.body.year,
        duration: req.body.duration,
        process: req.body.process ? JSON.parse(req.body.process) : [],
        materials: req.body.materials ? req.body.materials.split(',').map(m => m.trim()) : [],
        challenges: req.body.challenges,
        results: req.body.results,
        testimonial: req.body.testimonial ? JSON.parse(req.body.testimonial) : undefined,
        tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [],
        featured: req.body.featured === 'true',
        order: req.body.order || 0,
        seoTitle: req.body.seoTitle,
        seoDescription: req.body.seoDescription
      });

      const savedProject = await project.save();
      res.status(201).json(savedProject);
    } catch (error) {
      console.error('Error creando proyecto:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
);

// PUT - Actualizar proyecto (admin)
router.put('/:id',
  upload.array('images', 10),
  [
    body('title').trim().isLength({ min: 1 }).withMessage('El título es requerido'),
    body('description').trim().isLength({ min: 1 }).withMessage('La descripción es requerida'),
    body('detailedDescription').trim().isLength({ min: 1 }).withMessage('La descripción detallada es requerida'),
    body('category').isIn(['colaboracion', 'exposicion', 'comision', 'proyecto-personal', 'otros']).withMessage('Categoría inválida'),
    body('year').isInt({ min: 1900, max: new Date().getFullYear() }).withMessage('Año inválido')
  ],
  processImage,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const project = await Project.findById(req.params.id);
      if (!project) {
        return res.status(404).json({ message: 'Proyecto no encontrado' });
      }

      const updateData = {
        title: req.body.title,
        description: req.body.description,
        detailedDescription: req.body.detailedDescription,
        category: req.body.category,
        client: req.body.client,
        year: req.body.year,
        duration: req.body.duration,
        process: req.body.process ? JSON.parse(req.body.process) : project.process,
        materials: req.body.materials ? req.body.materials.split(',').map(m => m.trim()) : project.materials,
        challenges: req.body.challenges,
        results: req.body.results,
        testimonial: req.body.testimonial ? JSON.parse(req.body.testimonial) : project.testimonial,
        tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : project.tags,
        featured: req.body.featured === 'true',
        order: req.body.order || project.order,
        seoTitle: req.body.seoTitle,
        seoDescription: req.body.seoDescription
      };

      // Si hay nuevas imágenes, procesar y actualizar
      if (req.processedFiles && req.processedFiles.length > 0) {
        // Eliminar imágenes anteriores
        if (project.images) {
          project.images.forEach(img => {
            const filename = img.url.split('/').pop();
            deleteFile(filename);
          });
        }

        const images = req.processedFiles.map((file, index) => ({
          url: `/uploads/${file.filename}`,
          caption: req.body.captions ? req.body.captions[index] : '',
          order: index
        }));

        updateData.mainImage = `/uploads/${req.processedFiles[0].filename}`;
        updateData.images = images;
      }

      const updatedProject = await Project.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      res.json(updatedProject);
    } catch (error) {
      console.error('Error actualizando proyecto:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
);

// DELETE - Eliminar proyecto (admin)
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    // Eliminar archivos de imagen
    if (project.images) {
      project.images.forEach(img => {
        const filename = img.url.split('/').pop();
        deleteFile(filename);
      });
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Proyecto eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando proyecto:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router; 