import mongoose from 'mongoose';

const inspectorSchema = new mongoose.Schema(
    {
        employeeId: { type: String, required: true, unique: true, uppercase: true, trim: true },
        fullName: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        phone: { type: String, required: true, trim: true },
        designation: { type: String, required: true, trim: true },
        department: { type: String, required: true, trim: true },
        experience: { type: Number, required: true, min: 0 },
        assignedWards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ward' }],
        currentWorkload: { type: Number, default: 0 },
        maxWorkload: { type: Number, required: true, min: 1, default: 5 },
        availabilityStatus: { type: String, enum: ['ACTIVE', 'INACTIVE', 'ON_LEAVE'], default: 'ACTIVE' },
        employmentStatus: { type: String, enum: ['FULL_TIME', 'CONTRACTOR', 'TERMINATED'], default: 'FULL_TIME' },
        joiningDate: { type: Date, required: true },
        profilePhoto: { type: String, default: null },

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

// Removed duplicate index explicit calls for employeeId and email (handled natively by unique: true)
inspectorSchema.index({ availabilityStatus: 1 });
inspectorSchema.index({ deletedAt: 1 });
inspectorSchema.index({ fullName: 'text', employeeId: 'text', email: 'text' });
// Enforce unique constraints specifically disregarding soft-deleted items (partial index natively unsupported in raw Mongoose without specific DB config, so we rely on logic or unique:true overrides)

export default mongoose.model('Inspector', inspectorSchema);
