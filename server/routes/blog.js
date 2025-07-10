const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');
const { upload, processImage, deleteFile } = require('../middleware/upload');
const { body, validationResult } = require('express-validator');

// GET - Obtener posts del blog
router.get('/', async (req, res) => {
  try {
    const { category, featured, page = 1, limit = 6 } = req.query;
    const query = { published: true };
    
    if (category) {
      query.category = category;
    }
    
    if (featured === 'true') {
      query.featured = true;
    }

    const posts = await BlogPost.find(query)
      .sort({ featured: -1, publishedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-content'); // Excluir contenido completo en lista

    const total = await BlogPost.countDocuments(query);

    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error obteniendo posts:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// GET - Obtener post específico por slug
router.get('/:slug', async (req, res) => {
  try {
    const post = await BlogPost.findOne({ 
      slug: req.params.slug, 
      published: true 
    });
    
    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    // Incrementar views
    post.views += 1;
    await post.save();

    res.json(post);
  } catch (error) {
    console.error('Error obteniendo post:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// GET - Obtener categorías del blog
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await BlogPost.distinct('category', { published: true });
    res.json(categories);
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// GET - Obtener posts relacionados
router.get('/:slug/related', async (req, res) => {
  try {
    const currentPost = await BlogPost.findOne({ 
      slug: req.params.slug, 
      published: true 
    });
    
    if (!currentPost) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    // Buscar posts relacionados por categoría y tags
    const relatedPosts = await BlogPost.find({
      _id: { $ne: currentPost._id },
      published: true,
      $or: [
        { category: currentPost.category },
        { tags: { $in: currentPost.tags } }
      ]
    })
    .sort({ publishedAt: -1 })
    .limit(3)
    .select('-content');

    res.json(relatedPosts);
  } catch (error) {
    console.error('Error obteniendo posts relacionados:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// POST - Crear nuevo post (admin)
router.post('/',
  upload.single('featuredImage'),
  [
    body('title').trim().isLength({ min: 1 }).withMessage('El título es requerido'),
    body('slug').trim().isLength({ min: 1 }).withMessage('El slug es requerido'),
    body('excerpt').trim().isLength({ min: 1 }).withMessage('El extracto es requerido'),
    body('content').trim().isLength({ min: 1 }).withMessage('El contenido es requerido'),
    body('category').isIn(['proceso-creativo', 'tutorial', 'reflexiones', 'noticias', 'inspiracion', 'otros']).withMessage('Categoría inválida')
  ],
  processImage,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      if (!req.processedFile) {
        return res.status(400).json({ message: 'Imagen destacada requerida' });
      }

      // Verificar que el slug sea único
      const existingPost = await BlogPost.findOne({ slug: req.body.slug });
      if (existingPost) {
        return res.status(400).json({ message: 'El slug ya existe' });
      }

      const post = new BlogPost({
        title: req.body.title,
        slug: req.body.slug,
        excerpt: req.body.excerpt,
        content: req.body.content,
        featuredImage: `/uploads/${req.processedFile.filename}`,
        category: req.body.category,
        tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [],
        author: req.body.author || 'Artista',
        published: req.body.published === 'true',
        featured: req.body.featured === 'true',
        seoTitle: req.body.seoTitle,
        seoDescription: req.body.seoDescription,
        readTime: req.body.readTime || 5
      });

      const savedPost = await post.save();
      res.status(201).json(savedPost);
    } catch (error) {
      console.error('Error creando post:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
);

// PUT - Actualizar post (admin)
router.put('/:id',
  upload.single('featuredImage'),
  [
    body('title').trim().isLength({ min: 1 }).withMessage('El título es requerido'),
    body('slug').trim().isLength({ min: 1 }).withMessage('El slug es requerido'),
    body('excerpt').trim().isLength({ min: 1 }).withMessage('El extracto es requerido'),
    body('content').trim().isLength({ min: 1 }).withMessage('El contenido es requerido'),
    body('category').isIn(['proceso-creativo', 'tutorial', 'reflexiones', 'noticias', 'inspiracion', 'otros']).withMessage('Categoría inválida')
  ],
  processImage,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const post = await BlogPost.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: 'Post no encontrado' });
      }

      // Verificar que el slug sea único (excepto el post actual)
      if (req.body.slug !== post.slug) {
        const existingPost = await BlogPost.findOne({ slug: req.body.slug });
        if (existingPost) {
          return res.status(400).json({ message: 'El slug ya existe' });
        }
      }

      const updateData = {
        title: req.body.title,
        slug: req.body.slug,
        excerpt: req.body.excerpt,
        content: req.body.content,
        category: req.body.category,
        tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : post.tags,
        author: req.body.author || post.author,
        published: req.body.published === 'true',
        featured: req.body.featured === 'true',
        seoTitle: req.body.seoTitle,
        seoDescription: req.body.seoDescription,
        readTime: req.body.readTime || post.readTime
      };

      // Si hay nueva imagen destacada, actualizar
      if (req.processedFile) {
        // Eliminar imagen anterior
        if (post.featuredImage) {
          const filename = post.featuredImage.split('/').pop();
          deleteFile(filename);
        }
        
        updateData.featuredImage = `/uploads/${req.processedFile.filename}`;
      }

      const updatedPost = await BlogPost.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      res.json(updatedPost);
    } catch (error) {
      console.error('Error actualizando post:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
);

// DELETE - Eliminar post (admin)
router.delete('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    // Eliminar imagen destacada
    if (post.featuredImage) {
      const filename = post.featuredImage.split('/').pop();
      deleteFile(filename);
    }

    await BlogPost.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando post:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// POST - Dar like a un post
router.post('/:slug/like', async (req, res) => {
  try {
    const post = await BlogPost.findOne({ 
      slug: req.params.slug, 
      published: true 
    });
    
    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    post.likes += 1;
    await post.save();

    res.json({ likes: post.likes });
  } catch (error) {
    console.error('Error dando like:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router; 