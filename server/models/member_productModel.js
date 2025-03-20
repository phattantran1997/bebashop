const mongoose = require('mongoose');

const memberProductSchema = new mongoose.Schema({
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    discountPercentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    validFrom: {
        type: Date,
        default: Date.now
    },
    validUntil: {
        type: Date
    },
    specialNotes: {
        type: String
    }
}, {
    timestamps: true
});

// Compound index to ensure unique member-product combinations
memberProductSchema.index({ member: 1, product: 1 }, { unique: true });

const MemberProduct = mongoose.model('MemberProduct', memberProductSchema);

exports.addProductToMember = async (memberProductData) => {
    try {
        const memberProduct = await MemberProduct.create(memberProductData);
        return memberProduct;
    } catch (error) {
        throw error;
    }
};

exports.getMemberProducts = async (memberId) => {
    try {
        const memberProducts = await MemberProduct.find({ member: memberId })
            .populate('product', 'name price description')
            .populate('member', 'membershipType');
        return memberProducts;
    } catch (error) {
        throw error;
    }
};

exports.getProductMembers = async (productId) => {
    try {
        const productMembers = await MemberProduct.find({ product: productId })
            .populate('member')
            .populate('product', 'name price');
        return productMembers;
    } catch (error) {
        throw error;
    }
};

exports.updateMemberProduct = async (memberId, productId, updateData) => {
    try {
        const memberProduct = await MemberProduct.findOneAndUpdate(
            { member: memberId, product: productId },
            updateData,
            { new: true, runValidators: true }
        )
        .populate('product', 'name price description')
        .populate('member', 'membershipType');

        if (!memberProduct) {
            throw new Error('Member product relationship not found');
        }

        return memberProduct;
    } catch (error) {
        throw error;
    }
};

exports.removeMemberProduct = async (memberId, productId) => {
    try {
        const memberProduct = await MemberProduct.findOneAndDelete({
            member: memberId,
            product: productId
        });

        if (!memberProduct) {
            throw new Error('Member product relationship not found');
        }

        return memberProduct;
    } catch (error) {
        throw error;
    }
};

exports.getActiveDiscounts = async (memberId) => {
    try {
        const now = new Date();
        const activeDiscounts = await MemberProduct.find({
            member: memberId,
            isActive: true,
            validFrom: { $lte: now },
            $or: [
                { validUntil: { $gt: now } },
                { validUntil: null }
            ]
        })
        .populate('product', 'name price description')
        .populate('member', 'membershipType');

        return activeDiscounts;
    } catch (error) {
        throw error;
    }
};

module.exports.MemberProduct = MemberProduct;