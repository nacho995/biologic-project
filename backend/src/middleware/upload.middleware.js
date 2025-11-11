import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
    cb(null, true);
  } else if (
    file.mimetype.startsWith('image/') ||
    ['.tif', '.tiff', '.png', '.jpg', '.jpeg'].some((ext) =>
      file.originalname.toLowerCase().endsWith(ext)
    )
  ) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only CSV and image files are allowed.'));
  }
};

const uploadCSVMulter = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
}).single('csv');

const uploadImagesMulter = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB per file
}).array('images', 100);

// Wrapper middleware to handle multer errors
export const uploadCSV = (req, res, next) => {
  console.log('uploadCSV middleware called');
  console.log('Content-Type:', req.headers['content-type']);
  console.log('Content-Length:', req.headers['content-length']);
  
  uploadCSVMulter(req, res, (err) => {
    if (err) {
      console.error('Multer error in uploadCSV:', err);
      console.error('Error stack:', err.stack);
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(413).json({
            error: 'File too large. Maximum size is 10MB for CSV files.',
          });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({
            error: 'Unexpected file field. Expected field name: csv',
            details: `Received field: ${err.field}`,
          });
        }
        return res.status(400).json({
          error: `Upload error: ${err.message}`,
          code: err.code,
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
    // Log if file was processed
    if (req.file) {
      console.log('CSV file received:', req.file.originalname, 'Size:', req.file.size);
    } else {
      console.warn('No file in req.file after multer processing');
    }
    next();
  });
};

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

