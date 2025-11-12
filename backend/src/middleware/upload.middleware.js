import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith('image/') ||
    ['.tif', '.tiff', '.png', '.jpg', '.jpeg'].some((ext) =>
      file.originalname.toLowerCase().endsWith(ext)
    )
  ) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only TIFF and image files are allowed.'));
  }
};

const uploadImagesMulter = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB per file
}).array('images', 100);

export const uploadImages = (req, res, next) => {
  console.log('uploadImages middleware called');
  console.log('Content-Type:', req.headers['content-type']);
  console.log('Content-Length:', req.headers['content-length']);
  
  uploadImagesMulter(req, res, (err) => {
    if (err) {
      console.error('Multer error in uploadImages:', err);
      console.error('Error stack:', err.stack);
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(413).json({
            error: 'File too large. Maximum size is 100MB per image file.',
          });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({
            error: 'Too many files. Maximum is 100 images per upload.',
          });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({
            error: 'Unexpected file field. Expected field name: images',
          });
        }
        return res.status(400).json({
          error: `Upload error: ${err.message}`,
        });
      }
      // Handle file filter errors
      if (err.message) {
        return res.status(400).json({
          error: err.message,
        });
      }
      return res.status(500).json({
        error: 'File upload error',
      });
    }
    // Log if files were processed
    if (req.files && Array.isArray(req.files)) {
      console.log(`Images received: ${req.files.length} files`);
      req.files.forEach((file, index) => {
        console.log(`  [${index}] ${file.originalname} - ${file.size} bytes`);
      });
    } else {
      console.warn('No files in req.files after multer processing');
      console.warn('req.files:', req.files);
    }
    next();
  });
};

