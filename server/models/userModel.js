// userModel.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { generateAccessAndRefreshToken } = require('../utils/token');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        unique: true,
        sparse: true
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const User = mongoose.model('User', userSchema);

exports.register = async (email, password, isAdmin, fname, lname) => {
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error("User already exists");
        }
        
        const user = await User.create({
            email,
            password,
            isAdmin,
            fname,
            lname
        });
        
        return user;
    } catch (error) {
        throw error;
    }
};

exports.login = async (email, password) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("Invalid email or password");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Invalid email or password");
        }

        const userData = {
            userId: user._id,
            isAdmin: user.isAdmin
        };

        const { token, refreshToken } = generateAccessAndRefreshToken(userData);
        userData.token = token;
        userData.refreshToken = refreshToken;

        return [userData];
    } catch (error) {
        throw error;
    }
};

exports.loginByPhoneNumber = async (phoneNumber) => {
    try {
        const user = await User.findOne({ phoneNumber });
        if (!user) {
            throw new Error("Invalid phone number");
        }

        const userData = {
            userId: user._id,
            isAdmin: user.isAdmin,
            phoneNumber: user.phoneNumber
        };

        const { token, refreshToken } = generateAccessAndRefreshToken(userData);
        userData.token = token;
        userData.refreshToken = refreshToken;

        return [userData];
    } catch (error) {
        throw error;
    }
};

exports.getAllUsers = async () => {
    try {
        const users = await User.find({}, '-password');
        return users;
    } catch (error) {
        throw error;
    }
};

module.exports.User = User;
