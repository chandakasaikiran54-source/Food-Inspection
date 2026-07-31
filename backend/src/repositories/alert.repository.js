import InspectionAlert from '../models/InspectionAlert.model.js';
import mongoose from 'mongoose';

class AlertRepository {
    async queryAlerts(filters, skip = 0, limit = 50) {

        let matchStage = { deletedAt: null };

        // RBAC Context Filtering ensures users only see authorized alerts
        if (filters.rbacContext) {
            matchStage = { ...matchStage, ...filters.rbacContext };
        }

        // Apply direct exact match filters
        const directKeys = ['status', 'priority', 'type', 'ward', 'inspector', 'business'];
        directKeys.forEach(key => {
            if (filters[key]) {
                if (['ward', 'inspector', 'business'].includes(key)) {
                    matchStage[key] = new mongoose.Types.ObjectId(filters[key]);
                } else {
                    matchStage[key] = filters[key];
                }
            }
        });

        // Date Range
        if (filters.startDate || filters.endDate) {
            matchStage.generatedAt = {};
            if (filters.startDate) matchStage.generatedAt.$gte = new Date(filters.startDate);
            if (filters.endDate) matchStage.generatedAt.$lte = new Date(filters.endDate);
        }

        // Text Search
        if (filters.search) {
            const searchRegex = new RegExp(filters.search, 'i');
            // For advanced search, we'll need to lookup business/ward info if search string matches their names
            // But for repo layer simplicity initially, just search the alert message
            matchStage.message = { $regex: searchRegex };
        }

        const total = await InspectionAlert.countDocuments(matchStage);

        const data = await InspectionAlert.find(matchStage)
            .sort({ priority: 1, generatedAt: -1 }) // Sort Critical first, then newest
            .skip(skip)
            .limit(limit)
            .populate('business', 'businessName licenseNumber')
            .populate('inspector', 'fullName employeeId')
            .populate('ward', 'wardName')
            .lean();

        return { data, total, page: Math.floor(skip / limit) + 1, totalPages: Math.ceil(total / limit) };
    }

    async getAlertById(id) {
        return InspectionAlert.findOne({ _id: id, deletedAt: null })
            .populate('business')
            .populate('inspector')
            .populate('ward');
    }

    async updateStatus(id, status) {
        const updates = { status };
        if (status === 'RESOLVED') updates.resolvedAt = new Date();
        if (status === 'DELETED') updates.deletedAt = new Date();

        return InspectionAlert.findByIdAndUpdate(id, updates, { new: true });
    }

    async bulkUpdateStatus(ids, status) {
        const updates = { status };
        if (status === 'RESOLVED') updates.resolvedAt = new Date();
        if (status === 'DELETED') updates.deletedAt = new Date();

        return InspectionAlert.updateMany(
            { _id: { $in: ids }, deletedAt: null },
            { $set: updates }
        );
    }

    async getUnreadCount(rbacContext = {}) {
        return InspectionAlert.countDocuments({ ...rbacContext, status: 'UNREAD', deletedAt: null });
    }
}

export default new AlertRepository();
