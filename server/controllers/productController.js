const mongoose = require('mongoose');
const Product = require('../models/Product');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes default

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const { category, subcategory, search, page = 1, limit = 50 } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const startIndex = (pageNum - 1) * limitNum;
        
        let cacheKey = `products_${category}_${subcategory}_${search}_${pageNum}_${limitNum}`;
        const cachedResponse = cache.get(cacheKey);
        
        if (cachedResponse) {
            return res.json(cachedResponse);
        }

        const filter = { };
        if (category) filter.category = category;
        if (subcategory) filter.subcategory = subcategory;
        if (search) filter.name = { $regex: search, $options: 'i' };

        const totalItems = await Product.countDocuments(filter);
        const products = await Product.find(filter)
            .sort({ createdAt: -1 })
            .select('-description -features') // Optimized DB pull (don't pull huge text unless viewed individually)
            .skip(startIndex)
            .limit(limitNum)
            .lean();

        const response = {
            success: true,
            data: products,
            meta: {
                total: totalItems,
                page: pageNum,
                limit: limitNum,
                pages: Math.ceil(totalItems / limitNum)
            }
        };

        cache.set(cacheKey, response);
        res.json(response);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all subcategories (conveyor types)
// @route   GET /api/products/subcategories
// @access  Public
const getSubcategories = async (req, res) => {
    try {
        const cacheKey = `subcats`;
        const cachedSubcategories = cache.get(cacheKey);
        if (cachedSubcategories) return res.json({ success: true, data: cachedSubcategories });

        const subcategories = await Product.distinct('subcategory', { });
        cache.set(cacheKey, subcategories);
        res.json({ success: true, data: subcategories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
    try {
        const cacheKey = `featured`;
        const cachedFeatured = cache.get(cacheKey);
        if (cachedFeatured) return res.json({ success: true, data: cachedFeatured });

        const products = await Product.find({ featured: true, })
             .limit(6)
             .select('-description -features')
             .lean();
             
        cache.set(cacheKey, products);
        res.json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single product by slug
// @route   GET /api/products/slug/:slug
// @access  Public
const getProductBySlug = async (req, res) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug, }).lean();
        if (product) {
            res.json({ success: true, data: product });
        } else {
            res.status(404).json({ success: false, message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ success: false, message: 'Invalid product ID' });
        }
        const product = await Product.findOne({ _id: req.params.id, }).lean();
        if (product) {
            res.json({ success: true, data: product });
        } else {
            res.status(404).json({ success: false, message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Helper to generate slug
const generateSlug = (name) => {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
};

// Helper to ensure slug uniqueness
const generateUniqueSlug = async (name, excludeId = null) => {
    let baseSlug = generateSlug(name);
    let slug = baseSlug;
    let count = 1;
    while (true) {
        const filter = { slug };
        if (excludeId) filter._id = { $ne: excludeId };
        const existing = await Product.findOne(filter);
        if (!existing) break;
        slug = `${baseSlug}-${count++}`;
    }
    return slug;
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    try {
        const { name, shortDesc, description, category, subcategory, featured, features, specifications, applications, useCases } = req.body;
        let image = 'no-photo.jpg';
        let video = '';

        if (req.files) {
            if (req.files.image) image = req.files.image[0].path;
            if (req.files.video) video = req.files.video[0].path;
        }

        const slug = await generateUniqueSlug(name);

        // Parse JSON strings if coming from FormData
        const parsedFeatures = typeof features === 'string' ? JSON.parse(features) : (features || []);
        const parsedSpecs = typeof specifications === 'string' ? JSON.parse(specifications) : (specifications || []);
        const parsedApplications = typeof applications === 'string' ? JSON.parse(applications) : (applications || []);
        const parsedUseCases = typeof useCases === 'string' ? JSON.parse(useCases) : (useCases || []);

        const product = new Product({
            name,
            slug,
            shortDesc,
            description: description || '',
            image,
            video,
            category: category || 'Conveyors',
            subcategory: subcategory || '',
            featured: featured === 'true' || featured === true,
            features: parsedFeatures,
            specifications: parsedSpecs,
            applications: parsedApplications,
            useCases: parsedUseCases,
            images: [image]
        });

        const createdProduct = await product.save();
        
        // Cache invalidation
        cache.del(cache.keys().filter(key => key.includes(`products`) || key.includes(`featured`) || key.includes(`subcats`)));

        res.status(201).json({ success: true, data: createdProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }
        const { name, shortDesc, description, category, subcategory, featured, features, specifications, applications, useCases } = req.body;
        const product = await Product.findOne({ _id: req.params.id, });

        if (product) {
            if (name) {
                product.name = name;
                product.slug = await generateUniqueSlug(name, req.product._id);
            }
            if (shortDesc) product.shortDesc = shortDesc;
            if (description !== undefined) product.description = description;
            if (category) product.category = category;
            if (subcategory !== undefined) product.subcategory = subcategory;
            product.featured = featured !== undefined ? (featured === 'true' || featured === true) : product.featured;

            if (features) product.features = typeof features === 'string' ? JSON.parse(features) : features;
            if (specifications) product.specifications = typeof specifications === 'string' ? JSON.parse(specifications) : specifications;
            if (applications) product.applications = typeof applications === 'string' ? JSON.parse(applications) : applications;
            if (useCases) product.useCases = typeof useCases === 'string' ? JSON.parse(useCases) : useCases;

            if (req.files) {
                if (req.files.image) {
                    product.image = req.files.image[0].path;
                    if (!product.images.includes(product.image)) product.images.push(product.image);
                }
                if (req.files.video) product.video = req.files.video[0].path;
            }

            const updatedProduct = await product.save();

            // Cache invalidation
            cache.del(cache.keys().filter(key => key.includes(`products`) || key.includes(`featured`) || key.includes(`subcats`)));

            res.json({ success: true, data: updatedProduct });
        } else {
            res.status(404).json({ success: false, message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }
        const product = await Product.findOne({ _id: req.params.id, });

        if (product) {
            await product.deleteOne();

            // Cache invalidation
            cache.del(cache.keys().filter(key => key.includes(`products`) || key.includes(`featured`) || key.includes(`subcats`)));

            res.json({ success: true, message: 'Product removed' });
        } else {
            res.status(404).json({ success: false, message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getProducts,
    getProductById,
    getProductBySlug,
    getFeaturedProducts,
    getSubcategories,
    createProduct,
    updateProduct,
    deleteProduct,
};
