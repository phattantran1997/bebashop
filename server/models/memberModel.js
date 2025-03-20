const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    membershipType: {
        type: String,
        enum: ['basic', 'premium', 'vip'],
        default: 'basic'
    },
    points: {
        type: Number,
        default: 0,
        min: 0
    },
    memberSince: {
        type: Date,
        default: Date.now
    },
    expiryDate: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    benefits: [{
        type: String
    }]
}, {
    timestamps: true
});

// Add index for efficient queries
memberSchema.index({ user: 1, membershipType: 1 });

const Member = mongoose.model('Member', memberSchema);

exports.createMember = async (memberData) => {
    try {
        const member = await Member.create(memberData);
        return member;
    } catch (error) {
        throw error;
    }
};

exports.getMemberByUserId = async (userId) => {
    try {
        const member = await Member.findOne({ user: userId })
            .populate('user', 'fname lname email');
        return member;
    } catch (error) {
        throw error;
    }
};

exports.getAllMembers = async () => {
    try {
        const members = await Member.find()
            .populate('user', 'fname lname email');
        return members;
    } catch (error) {
        throw error;
    }
};

exports.updateMember = async (userId, updateData) => {
    try {
        const member = await Member.findOneAndUpdate(
            { user: userId },
            updateData,
            { new: true, runValidators: true }
        ).populate('user', 'fname lname email');

        if (!member) {
            throw new Error('Member not found');
        }

        return member;
    } catch (error) {
        throw error;
    }
};

exports.deleteMember = async (userId) => {
    try {
        const member = await Member.findOneAndDelete({ user: userId });
        if (!member) {
            throw new Error('Member not found');
        }
        return member;
    } catch (error) {
        throw error;
    }
};

exports.updateMemberPoints = async (userId, points) => {
    try {
        const member = await Member.findOneAndUpdate(
            { user: userId },
            { $inc: { points: points } },
            { new: true, runValidators: true }
        );

        if (!member) {
            throw new Error('Member not found');
        }

        return member;
    } catch (error) {
        throw error;
    }
};

module.exports.Member = Member; 