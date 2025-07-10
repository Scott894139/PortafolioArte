const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Configurar almacenamiento temporal
const storage = multer.memoryStorage();

// Filtro para tipos de archivo
const fileFilter = (req, file, cb) => {
  // Permitir solo imágenes
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen'), false);
  }
};

// Configurar multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB límite
  }
});

// Middleware para procesar y guardar imágenes
const processImage = async (req, res, next) => {
  if (!req.file && !req.files) {
    return next();
  }

  try {
    const uploadDir = path.join(__dirname, '../uploads');
    const thumbnailDir = path.join(__dirname, '../uploads/thumbnails');
    
    // Crear directorios si no existen
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    if (!fs.existsSync(thumbnailDir)) {
      fs.mkdirSync(thumbnailDir, { recursive: true });
    }

    // Procesar archivo único
    if (req.file) {
      const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
      const mainImagePath = path.join(uploadDir, `${filename}.jpg`);
      const thumbnailPath = path.join(thumbnailDir, `${filename}-thumb.jpg`);

      // Procesar imagen principal
      await sharp(req.file.buffer)
        .resize(1920, 1080, { 
          fit: 'inside', 
          withoutEnlargement: true 
        })
        .jpeg({ quality: 85 })
        .toFile(mainImagePath);

      // Crear thumbnail
      await sharp(req.file.buffer)
        .resize(400, 300, { 
          fit: 'cover' 
        })
        .jpeg({ quality: 80 })
        .toFile(thumbnailPath);

      req.processedFile = {
        filename: `${filename}.jpg`,
        thumbnail: `${filename}-thumb.jpg`,
        path: mainImagePath,
        thumbnailPath: thumbnailPath
      };
    }

    // Procesar múltiples archivos
    if (req.files) {
      const processedFiles = [];
      
      for (const file of req.files) {
        const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const mainImagePath = path.join(uploadDir, `${filename}.jpg`);
        const thumbnailPath = path.join(thumbnailDir, `${filename}-thumb.jpg`);

        // Procesar imagen principal
        await sharp(file.buffer)
          .resize(1920, 1080, { 
            fit: 'inside', 
            withoutEnlargement: true 
          })
          .jpeg({ quality: 85 })
          .toFile(mainImagePath);

        // Crear thumbnail
        await sharp(file.buffer)
          .resize(400, 300, { 
            fit: 'cover' 
          })
          .jpeg({ quality: 80 })
          .toFile(thumbnailPath);

        processedFiles.push({
          filename: `${filename}.jpg`,
          thumbnail: `${filename}-thumb.jpg`,
          path: mainImagePath,
          thumbnailPath: thumbnailPath
        });
      }

      req.processedFiles = processedFiles;
    }

    next();
  } catch (error) {
    console.error('Error procesando imagen:', error);
    res.status(500).json({ message: 'Error procesando imagen' });
  }
};

// Middleware para eliminar archivos
const deleteFile = (filename) => {
  const filePath = path.join(__dirname, '../uploads', filename);
  const thumbnailPath = path.join(__dirname, '../uploads/thumbnails', filename.replace('.jpg', '-thumb.jpg'));
  
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
  if (fs.existsSync(thumbnailPath)) {
    fs.unlinkSync(thumbnailPath);
  }
};

module.exports = {
  upload,
  processImage,
  deleteFile
}; 