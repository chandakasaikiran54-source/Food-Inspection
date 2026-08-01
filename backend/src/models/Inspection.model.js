import mongoose from 'mongoose';

const evidenceSchema = new mongoose.Schema({
    fileId: { type: String, required: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    uploadedAt: { type: Date, default: Date.now },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { _id: false });

const inspectionSchema = new mongoose.Schema(
    {
        inspectionNumber: { type: String, required: true, unique: true, uppercase: true, trim: true },
        business: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodBusiness', required: true },
        inspector: { type: mongoose.Schema.Types.ObjectId, ref: 'Inspector', required: true },
        ward: { type: mongoose.Schema.Types.ObjectId, ref: 'Ward', required: true },

        inspectionType: {
            type: String,
            enum: ['Routine', 'Complaint', 'Follow-up', 'Surprise', 'Special Drive'],
            required: true
        },
        inspectionCategory: { type: String, required: true },

        scheduledDate: { type: Date, required: true },
        assignedDate: { type: Date, default: null },
        startedAt: { type: Date, default: null },
        completedAt: { type: Date, default: null },

        status: {
            type: String,
            enum: ['Draft', 'Scheduled', 'Assigned', 'In Progress', 'Submitted', 'Reviewed', 'Completed', 'Cancelled'],
            default: 'Draft'
        },

        complianceScore: { type: Number, min: 0, max: 100, default: null },
        riskLevel: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: null },
        foodSafetyGrade: { type: String, enum: ['A', 'B', 'C', 'D'], default: null },

        overallRemarks: { type: String, default: null },
        recommendations: { type: String, default: null },
        correctiveActions: { type: String, default: null },

        followUpRequired: { type: Boolean, default: false },
        nextSuggestedInspectionDate: { type: Date, default: null },

        evidenceImages: [evidenceSchema],
        evidenceDocuments: [evidenceSchema],

        gpsLatitude: { type: Number, default: null },
        gpsLongitude: { type: Number, default: null },
        gpsVerified: { type: Boolean, default: false },
        distanceMeters: { type: Number, default: null },

        isLocked: { type: Boolean, default: false },
        lockedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
        lockedAt: { type: Date, default: null },

        inspectorSignature: { type: String, default: null },
        businessOwnerSignature: { type: String, default: null },
        photos: [{
            url: { type: String, required: true },
            category: { type: String, default: 'General' },
            timestamp: { type: Date, default: Date.now }
        }],

        digitalSignaturePlaceholder: { type: String, default: null },
        supervisorReview: { type: String, default: null },
        reviewDate: { type: Date, default: null },

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

inspectionSchema.index({ status: 1 });
inspectionSchema.index({ inspectionType: 1 });
inspectionSchema.index({ riskLevel: 1 });
inspectionSchema.index({ business: 1 });
inspectionSchema.index({ inspector: 1 });
inspectionSchema.index({ ward: 1 });
// Unique constraint handles inspectionNumber index automatically
// Prevent duplicate active inspections for exactly same business dynamically
inspectionSchema.index({ business: 1, status: 1 });

export default mongoose.model('Inspection', inspectionSchema);
