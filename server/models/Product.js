
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    shortDesc: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    image: {
        type: String,
        default: 'no-photo.jpg',
    },
    video: {
        type: String,
        required: false,
    },
    // Main category - always "Conveyors" for this client
    category: {
        type: String,
        required: true,
        default: 'Conveyors',
    },
    // Conveyor type subcategory e.g. "Belt Conveyor", "Roller Conveyor"
    subcategory: {
        type: String,
        required: true,
    },
    featured: {
        type: Boolean,
        default: false,
    },
    slug: {
        type: String,
        lowercase: true,
    },
    images: [{
        type: String
    }],
    features: [{
        type: String
    }],
    specifications: [{
        label: String,
        value: String
    }],
    // Industries / applications where this conveyor is used
    applications: [{
        type: String
    }],
    // Legacy field kept for backward compatibility
    useCases: [{
        type: String
    }],
    relatedProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],

}, {
    timestamps: true,
});

productSchema.index({ slug: 1 }, { unique: true });
productSchema.index({ category: 1 });
productSchema.index({ subcategory: 1 });

module.exports = mongoose.model('Product', productSchema);
