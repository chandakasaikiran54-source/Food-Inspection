import mongoose from 'mongoose';

const violationSchema = new mongoose.Schema(
    {
        violationCode: { type: String, required: true, uppercase: true, trim: true },
        violationTitle: { type: String, required: true, trim: true },
        violationCategory: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },

        severity: {
            type: String,
            enum: ['Critical', 'Major', 'Minor'],
            required: true
        },

        penaltyRecommendation: { type: String, default: null },
        correctiveAction: { type: String, required: true },

        inspectionReference: { type: mongoose.Schema.Types.ObjectId, ref: 'Inspection', required: true },

        status: {
            type: String,
            enum: ['Resolved', 'Pending'],
            default: 'Pending'
        },

        deletedAt: { type: Date, default: null }, // Added soft delete capability uniformly
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

violationSchema.index({ inspectionReference: 1 });
violationSchema.index({ severity: 1 });
violationSchema.index({ status: 1 });
violationSchema.index({ violationCode: 1 });

export default mongoose.model('Violation', violationSchema);
