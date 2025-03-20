// orderModel.js

const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    }
});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [orderItemSchema],
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    }
}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

exports.createOrder = async (orderData) => {
    try {
        const order = await Order.create(orderData);
        return order;
    } catch (error) {
        throw error;
    }
};

exports.getAllOrders = async () => {
    try {
        const orders = await Order.find()
            .populate('user', 'fname lname email')
            .populate('items.product', 'name price');
        return orders;
    } catch (error) {
        throw error;
    }
};

exports.getOrderById = async (orderId) => {
    try {
        const order = await Order.findById(orderId)
            .populate('user', 'fname lname email')
            .populate('items.product', 'name price');
        if (!order) {
            throw new Error('Order not found');
        }
        return order;
    } catch (error) {
        throw error;
    }
};

exports.getUserOrders = async (userId) => {
    try {
        const orders = await Order.find({ user: userId })
            .populate('items.product', 'name price');
        return orders;
    } catch (error) {
        throw error;
    }
};

exports.updateOrderStatus = async (orderId, status) => {
    try {
        const order = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true, runValidators: true }
        );
        if (!order) {
            throw new Error('Order not found');
        }
        return order;
    } catch (error) {
        throw error;
    }
};

module.exports.Order = Order;

