import mongoose from 'mongoose';

const frequencyRuleSchema = new mongoose.Schema(
    {
        riskCategory: {
            type: String,
            enum: ['Low', 'Medium', 'High', 'Critical'],
            required: true,
            unique: true
        },
        intervalDays: {
            type: Number,
            required: true,
            min: 1
        },
        description: { type: String, default: '' },

        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
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

export default mongoose.model('FrequencyRule', frequencyRuleSchema);
