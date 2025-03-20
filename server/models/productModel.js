// productModel.js

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    category: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String
    }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

exports.createProduct = async (productData) => {
    try {
        const product = await Product.create(productData);
        return product;
    } catch (error) {
        throw error;
    }
};

exports.getAllProducts = async () => {
    try {
        const products = await Product.find({});
        return products;
    } catch (error) {
        throw error;
    }
};

exports.getProductById = async (productId) => {
    try {
        const product = await Product.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    } catch (error) {
        throw error;
    }
};

exports.updateProduct = async (productId, updateData) => {
    try {
        const product = await Product.findByIdAndUpdate(
            productId,
            updateData,
            { new: true, runValidators: true }
        );
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    } catch (error) {
        throw error;
    }
};

exports.deleteProduct = async (productId) => {
    try {
        const product = await Product.findByIdAndDelete(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    } catch (error) {
        throw error;
    }
};

module.exports.Product = Product;
