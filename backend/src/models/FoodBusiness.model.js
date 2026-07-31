import mongoose from 'mongoose';

const STATUSES = ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'CLOSED'];
const RISK_CATEGORIES = ['HIGH', 'MEDIUM', 'LOW'];

const foodBusinessSchema = new mongoose.Schema(
    {
        businessName: { type: String, required: true, trim: true },
        licenseNumber: { type: String, required: true, unique: true, uppercase: true, trim: true },
        businessType: { type: String, required: true, trim: true },
        foodCategory: { type: String, required: true, trim: true },
        ownerName: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true },
        email: { type: String, trim: true, lowercase: true },
        ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Linked from User
        shopNumber: { type: String, trim: true, default: null },
        streetArea: { type: String, required: true, trim: true },
        villageLocality: { type: String, required: true, trim: true },
        mandal: { type: String, required: true, trim: true },
        district: { type: String, required: true, trim: true },
        state: { type: String, required: true, trim: true },
        pincode: { type: String, required: true, trim: true },
        landmark: { type: String, trim: true, default: null },

        gstNumber: { type: String, trim: true, default: null },
        tradeLicense: { type: String, trim: true, default: null },
        fssaiLicenseNumber: { type: String, trim: true, default: null },
        businessOpeningDate: { type: Date, default: null },
        numberOfEmployees: { type: Number, default: null },

        businessLicenseUrl: { type: String, trim: true, default: null },
        identityProofUrl: { type: String, trim: true, default: null },
        addressProofUrl: { type: String, trim: true, default: null },
        shopPhotographUrl: { type: String, trim: true, default: null },

        // Old fields retained but adjusted optionally:
        address: { type: String, trim: true, default: null }, // Legacy string address
        ward: { type: String, trim: true, default: 'Default' },
        zone: { type: String, trim: true, default: 'Default' },
        latitude: { type: Number, default: null },
        longitude: { type: Number, default: null },
        foodCategory: { type: String, trim: true, default: 'General' },
        licenseIssueDate: { type: Date, default: null },
        licenseExpiryDate: { type: Date, default: null },
        businessStatus: { type: String, enum: STATUSES, default: 'ACTIVE' },
        riskCategory: { type: String, enum: RISK_CATEGORIES, default: 'MEDIUM' },
        lastInspectionDate: { type: Date, default: null },
        nextDueDate: { type: Date, default: null },
        qrCode: { type: String, default: null },

        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
        deletedAt: { type: Date, default: null },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform(doc, ret) {
                delete ret.__v;
                return ret;
            }
        }
    }
);

// Indexes mapping to common queries
foodBusinessSchema.index({ ward: 1 });
foodBusinessSchema.index({ riskCategory: 1 });
foodBusinessSchema.index({ businessStatus: 1 });
foodBusinessSchema.index({ deletedAt: 1 });
foodBusinessSchema.index({ nextDueDate: 1 });
// Compound text index for global search
foodBusinessSchema.index({ businessName: 'text', licenseNumber: 'text', ownerName: 'text' });
// Enforce unique license but allow partial nulls if needed, though schema prevents it currently.

foodBusinessSchema.statics.findActive = function (filter = {}) {
    return this.find({ ...filter, deletedAt: null });
};

export default mongoose.model('FoodBusiness', foodBusinessSchema);
