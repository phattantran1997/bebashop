// cartModel.js

const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
});

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    items: [cartItemSchema],
    totalAmount: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    }
}, {
    timestamps: true
});

// Calculate total amount before saving
cartSchema.pre('save', function(next) {
    this.totalAmount = this.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
    next();
});

const Cart = mongoose.model('Cart', cartSchema);

exports.getCart = async (userId) => {
    try {
        let cart = await Cart.findOne({ user: userId })
            .populate('items.product', 'name description imageUrl');
        
        if (!cart) {
            cart = await Cart.create({
                user: userId,
                items: [],
                totalAmount: 0
            });
        }
        
        return cart;
    } catch (error) {
        throw error;
    }
};

exports.addToCart = async (userId, productId, quantity, price) => {
    try {
        let cart = await Cart.findOne({ user: userId });
        
        if (!cart) {
            cart = new Cart({
                user: userId,
                items: [],
                totalAmount: 0
            });
        }

        const existingItemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );

        if (existingItemIndex > -1) {
            // Update existing item
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Add new item
            cart.items.push({
                product: productId,
                quantity,
                price
            });
        }

        // Save will trigger the pre-save hook to calculate totalAmount
        await cart.save();
        
        return cart;
    } catch (error) {
        throw error;
    }
};

exports.updateCartItem = async (userId, productId, quantity) => {
    try {
        const cart = await Cart.findOne({ user: userId });
        
        if (!cart) {
            throw new Error('Cart not found');
        }

        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );

        if (itemIndex === -1) {
            throw new Error('Product not found in cart');
        }

        if (quantity <= 0) {
            // Remove item if quantity is 0 or negative
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity = quantity;
        }

        await cart.save();
        return cart;
    } catch (error) {
        throw error;
    }
};

exports.removeFromCart = async (userId, productId) => {
    try {
        const cart = await Cart.findOne({ user: userId });
        
        if (!cart) {
            throw new Error('Cart not found');
        }

        cart.items = cart.items.filter(
            item => item.product.toString() !== productId
        );

        await cart.save();
        return cart;
    } catch (error) {
        throw error;
    }
};

exports.clearCart = async (userId) => {
    try {
        const cart = await Cart.findOne({ user: userId });
        
        if (!cart) {
            throw new Error('Cart not found');
        }

        cart.items = [];
        cart.totalAmount = 0;
        
        await cart.save();
        return cart;
    } catch (error) {
        throw error;
    }
};

module.exports.Cart = Cart;
