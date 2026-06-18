
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'tenant-products',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'mp4', 'webm', 'mov', 'pdf'],
        resource_type: 'auto', // Important for video support
    },
});

const upload = multer({ storage: storage });

module.exports = upload;
