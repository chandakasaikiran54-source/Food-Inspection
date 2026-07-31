import mongoose from 'mongoose';

const wardSchema = new mongoose.Schema(
    {
        wardNumber: { type: String, required: true, unique: true, uppercase: true, trim: true },
        wardName: { type: String, required: true, trim: true },
        zone: { type: String, required: true, trim: true },
        circle: { type: String, required: true, trim: true },
        assignedInspector: { type: mongoose.Schema.Types.ObjectId, ref: 'Inspector', default: null },

        totalBusinesses: { type: Number, default: 0 },
        totalInspections: { type: Number, default: 0 },
        pendingInspections: { type: Number, default: 0 },
        overdueInspections: { type: Number, default: 0 },
        compliancePercentage: { type: Number, default: 0, min: 0, max: 100 },
        riskScore: { type: Number, default: 0, min: 0 },

        status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },

        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
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

// Removed duplicate index explicit call for wardNumber (handled natively by unique: true)
wardSchema.index({ zone: 1 });
wardSchema.index({ assignedInspector: 1 });
wardSchema.index({ deletedAt: 1 });
wardSchema.index({ wardName: 'text', wardNumber: 'text', zone: 'text' });

export default mongoose.model('Ward', wardSchema);
