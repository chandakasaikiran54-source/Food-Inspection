/**
 * src/models/User.model.js
 * Mongoose User schema.
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const ROLES = ['ADMIN', 'COMMISSIONER', 'SUPERVISOR', 'INSPECTOR'];
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
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });
userSchema.index({ deletedAt: 1 });

// ─── Hash password before save ────────────────────────────────────────────────
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    if (!this.isNew) this.passwordChangedAt = new Date();
    next();
});

// ─── Instance methods ─────────────────────────────────────────────────────────
userSchema.methods.comparePassword = async function (candidate) {
    return bcrypt.compare(candidate, this.password);
};

userSchema.methods.isActive = function () {
    return this.status === 'ACTIVE' && this.deletedAt === null;
};

// ─── Soft-delete query helper ────────────────────────────────────────────────
userSchema.statics.findActive = function (filter = {}) {
    return this.find({ ...filter, deletedAt: null });
};

const User = mongoose.model('User', userSchema);
export default User;
