/**
 * src/models/User.model.js
 * Mongoose User schema.
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const ROLES = ['ADMIN', 'COMMISSIONER', 'SUPERVISOR', 'INSPECTOR', 'BUSINESS'];
const STATUSES = ['ACTIVE', 'INACTIVE'];

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, 'Full name is required'],
            trim: true,
            minlength: [2, 'Full name must be at least 2 characters'],
            maxlength: [100, 'Full name cannot exceed 100 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters'],
            select: false, // never returned by default
        },
        role: {
            type: String,
            enum: { values: ROLES, message: '{VALUE} is not a valid role' },
            default: 'INSPECTOR',
        },
        status: {
            type: String,
            enum: { values: STATUSES, message: '{VALUE} is not a valid status' },
            default: 'ACTIVE',
        },
        phone: {
            type: String,
            trim: true,
            match: [/^\d{10}$/, 'Phone number must be exactly 10 digits'],
            default: null,
        },
        alternatePhone: {
            type: String,
            trim: true,
            match: [/^\d{10}$/, 'Phone number must be exactly 10 digits'],
            default: null,
        },
        department: {
            type: String,
            trim: true,
            default: null,
        },
        govIdType: {
            type: String,
            enum: { values: ['Aadhaar', 'PAN', 'Driving Licence', 'Voter ID'], message: '{VALUE} is not a valid ID Type' },
            default: null,
        },
        govIdNumber: {
            type: String,
            trim: true,
            default: null,
        },
        businessId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'FoodBusiness',
            default: null,
        },
        lastLogin: {
            type: Date,
            default: null,
        },
        passwordChangedAt: {
            type: Date,
            select: false,
        },
        passwordResetToken: {
            type: String,
            select: false,
        },
        passwordResetExpires: {
            type: Date,
            select: false,
        },
        refreshToken: {
            type: String,
            select: false,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform(doc, ret) {
                delete ret.__v;
                delete ret.password;
                delete ret.refreshToken;
                delete ret.passwordResetToken;
                delete ret.passwordResetExpires;
                delete ret.passwordChangedAt;
                return ret;
            },
        },
    }
);

// Indexes
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });
userSchema.index({ deletedAt: 1 });

// ─── Hash password before save ────────────────────────────────────────────────
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    if (!this.isNew) this.passwordChangedAt = new Date();
});

// ─── Instance methods ─────────────────────────────────────────────────────────
userSchema.methods.comparePassword = async function (candidate) {
    return bcrypt.compare(candidate, this.password);
};

userSchema.methods.isActive = function () {
    return this.status === 'ACTIVE' && this.deletedAt === null;
};

// Reset Password Crypto Method natively securely generating hex chains safely.
userSchema.methods.createPasswordResetToken = async function () {
    const crypto = await import('crypto');
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash token efficiently avoiding plain-text exposure in database
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Token expires in 10 minutes safely avoiding unlimited spans
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

// ─── Soft-delete query helper ────────────────────────────────────────────────
userSchema.statics.findActive = function (filter = {}) {
    return this.find({ ...filter, deletedAt: null });
};

const User = mongoose.model('User', userSchema);
export default User;
