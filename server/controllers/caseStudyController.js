const mongoose = require('mongoose');
const CaseStudy = require('../models/CaseStudy');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes default


// Helper to slugify text
const slugify = (text) => {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
};

// Helper to ensure slug uniqueness
const generateUniqueSlug = async (title, excludeId = null) => {
    let baseSlug = slugify(title);
    let slug = baseSlug;
    let count = 1;
    while (true) {
        const filter = { slug };
        if (excludeId) filter._id = { $ne: excludeId };
        const existing = await CaseStudy.findOne(filter);
        if (!existing) break;
        slug = `${baseSlug}-${count++}`;
    }
    return slug;
};


// @desc    Get all case studies
// @route   GET /api/case-studies
// @access  Public
const getCaseStudies = async (req, res) => {
    try {
        const { page = 1, limit = 50, industry } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const startIndex = (pageNum - 1) * limitNum;

        const cacheKey = `casestudies_${industry || 'all'}_${pageNum}_${limitNum}`;
        const cachedResponse = cache.get(cacheKey);

        if (cachedResponse) {
            return res.json(cachedResponse);
        }

        const filter = { };
        if (industry) filter.industry = industry;

        const totalItems = await CaseStudy.countDocuments(filter);
        const caseStudies = await CaseStudy.find(filter)
            .sort({ date: -1 })
            .select('-problem -solution -results') // Exclude heavy text content from list views
            .skip(startIndex)
            .limit(limitNum)
            .lean();

        const response = {
            success: true,
            data: caseStudies,
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

// @desc    Get single case study by slug
// @route   GET /api/case-studies/:slug
// @access  Public
const getCaseStudyBySlug = async (req, res) => {
    try {
        const caseStudy = await CaseStudy.findOne({ slug: req.params.slug, }).lean();
        if (caseStudy) {
            res.json({ success: true, data: caseStudy });
        } else {
            res.status(404).json({ success: false, message: 'Case Study not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create a case study
// @route   POST /api/case-studies
// @access  Private/Admin
const createCaseStudy = async (req, res) => {
    try {
        const { title, client, industry, location, problem, solution, results, stats, featured, date } = req.body;

        // Handle images from upload middleware
        // This assumes multiple file upload handling which we might need to adjust based on current middleware capabilities
        // For now, let's assume URLs are passed or we handle single main image + gallery

        const mainImage = req.files && req.files['mainImage'] ? req.files['mainImage'][0].path : req.body.mainImage;
        const galleryImages = req.files && req.files['images'] ? req.files['images'].map(file => file.path) : (req.body.images || []);

        // Parse JSON strings if they come from formData
        const parsedResults = typeof results === 'string' ? JSON.parse(results) : results;
        const parsedStats = typeof stats === 'string' ? JSON.parse(stats) : stats;

        const caseStudy = new CaseStudy({
            title,
            slug: await generateUniqueSlug(title),
            client,
            industry,
            location,
            problem,
            solution,
            results: parsedResults || [],
            stats: parsedStats || [],
            mainImage,
            images: galleryImages,
            featured: featured === 'true' || featured === true,
            date: date || Date.now()
        });

        const createdCaseStudy = await caseStudy.save();
        
        // Invalidate cache
        cache.del(cache.keys().filter(key => key.includes(`casestudies`)));
        
        res.status(201).json({ success: true, data: createdCaseStudy });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update a case study
// @route   PUT /api/case-studies/:id
// @access  Private/Admin
const updateCaseStudy = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid case study ID' });
        }
        const { title, client, industry, location, problem, solution, results, stats, featured, date } = req.body;

        const caseStudy = await CaseStudy.findOne({ _id: req.params.id, });

        if (caseStudy) {
            caseStudy.title = title || caseStudy.title;
            if (title) caseStudy.slug = await generateUniqueSlug(title, req.caseStudy._id);
            caseStudy.client = client || caseStudy.client;
            caseStudy.industry = industry || caseStudy.industry;
            caseStudy.location = location || caseStudy.location;
            caseStudy.problem = problem || caseStudy.problem;
            caseStudy.solution = solution || caseStudy.solution;

            if (results) caseStudy.results = typeof results === 'string' ? JSON.parse(results) : results;
            if (stats) caseStudy.stats = typeof stats === 'string' ? JSON.parse(stats) : stats;

            if (req.files && req.files['mainImage']) {
                caseStudy.mainImage = req.files['mainImage'][0].path;
            }
            if (req.files && req.files['images']) {
                const newImages = req.files['images'].map(file => file.path);
                caseStudy.images = [...caseStudy.images, ...newImages];
            }

            caseStudy.featured = featured !== undefined ? (featured === 'true' || featured === true) : caseStudy.featured;
            caseStudy.date = date || caseStudy.date;

            const updatedCaseStudy = await caseStudy.save();

            // Invalidate cache
            cache.del(cache.keys().filter(key => key.includes(`casestudies`)));

            res.json({ success: true, data: updatedCaseStudy });
        } else {
            res.status(404).json({ success: false, message: 'Case Study not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete a case study
// @route   DELETE /api/case-studies/:id
// @access  Private/Admin
const deleteCaseStudy = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid case study ID' });
        }
        const caseStudy = await CaseStudy.findOne({ _id: req.params.id, });
        if (caseStudy) {
            await caseStudy.deleteOne();
            
            // Invalidate cache
            cache.del(cache.keys().filter(key => key.includes(`casestudies`)));

            res.json({ success: true, message: 'Case Study removed' });
        } else {
            res.status(404).json({ success: false, message: 'Case Study not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getCaseStudies,
    getCaseStudyBySlug,
    createCaseStudy,
    updateCaseStudy,
    deleteCaseStudy
};
