import mongoose from 'mongoose';

const inspectionAlertSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: [
                'INSPECTION_DUE',
                'INSPECTION_OVERDUE',
                'CRITICAL_BUSINESS',
                'HIGH_RISK',
                'LICENSE_EXPIRY',
                'INSPECTOR_OVERLOAD',
                'INSPECTOR_OVERLOAD',
                'WARD_OVERLOAD',
                'SYSTEM_NOTIFICATION'
            ],
            required: true
        },
        message: { type: String, required: true },

        business: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodBusiness', default: null },
        inspector: { type: mongoose.Schema.Types.ObjectId, ref: 'Inspector', default: null },
        ward: { type: mongoose.Schema.Types.ObjectId, ref: 'Ward', default: null },

        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High', 'Critical'],
            default: 'Medium'
        },

        status: {
            type: String,
            enum: ['UNREAD', 'READ', 'ACKNOWLEDGED', 'RESOLVED', 'ARCHIVED', 'DELETED'],
            default: 'UNREAD'
        },

        generatedAt: { type: Date, default: Date.now },
        resolvedAt: { type: Date, default: null },
        deletedAt: { type: Date, default: null }
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

inspectionAlertSchema.index({ type: 1, status: 1 });
inspectionAlertSchema.index({ business: 1 });
inspectionAlertSchema.index({ inspector: 1 });
inspectionAlertSchema.index({ generatedAt: -1 });

export default mongoose.model('InspectionAlert', inspectionAlertSchema);
