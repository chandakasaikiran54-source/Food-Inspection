import FoodBusiness from '../models/FoodBusiness.model.js';
import Inspection from '../models/Inspection.model.js';
import Inspector from '../models/Inspector.model.js';
import Ward from '../models/Ward.model.js';
import InspectionAlert from '../models/InspectionAlert.model.js';
import Violation from '../models/Violation.model.js';
import mongoose from 'mongoose';

class AnalyticsRepository {
    async getAdminDashboardMetrics() {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfWeek = new Date(startOfDay.getTime() + 7 * 24 * 60 * 60 * 1000);

        const [businesses, inspectors, inspections, alerts, compliance] = await Promise.all([
            FoodBusiness.aggregate([
                { $match: { deletedAt: null } },
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        active: { $sum: { $cond: [{ $eq: ['$businessStatus', 'ACTIVE'] }, 1, 0] } },
                        inactive: { $sum: { $cond: [{ $in: ['$businessStatus', ['INACTIVE', 'SUSPENDED', 'CLOSED']] }, 1, 0] } },
                        critical: { $sum: { $cond: [{ $eq: ['$riskCategory', 'Critical'] }, 1, 0] } },
                        highRisk: { $sum: { $cond: [{ $eq: ['$riskCategory', 'HIGH'] }, 1, 0] } },
                        dueThisWeek: { $sum: { $cond: [{ $and: [{ $gte: ['$nextDueDate', startOfDay] }, { $lte: ['$nextDueDate', endOfWeek] }] }, 1, 0] } },
                        dueToday: { $sum: { $cond: [{ $and: [{ $gte: ['$nextDueDate', startOfDay] }, { $lte: ['$nextDueDate', new Date(startOfDay.getTime() + 24 * 3600 * 1000)] }] }, 1, 0] } }
                    }
                }
            ]),
            Inspector.aggregate([
                { $match: { deletedAt: null } },
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        available: { $sum: { $cond: [{ $eq: ['$availabilityStatus', 'ACTIVE'] }, 1, 0] } },
                        busy: { $sum: { $cond: [{ $gt: ['$currentWorkload', 0] }, 1, 0] } } // Simple approximation for busy
                    }
                }
            ]),
            Inspection.aggregate([
                { $match: { deletedAt: null } },
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        completed: { $sum: { $cond: [{ $in: ['$status', ['Completed', 'Reviewed', 'Approved']] }, 1, 0] } },
                        pending: { $sum: { $cond: [{ $in: ['$status', ['Assigned', 'In Progress', 'Scheduled']] }, 1, 0] } },
                        overdue: { $sum: { $cond: [{ $and: [{ $in: ['$status', ['Assigned', 'Scheduled']] }, { $lt: ['$scheduledDate', now] }] }, 1, 0] } }
                    }
                }
            ]),
            InspectionAlert.countDocuments({ status: 'UNREAD' }),
            Inspection.aggregate([
                { $match: { deletedAt: null, complianceScore: { $ne: null } } },
                { $group: { _id: null, avgCompliance: { $avg: '$complianceScore' } } }
            ])
        ]);

        const wards = await Ward.countDocuments({ deletedAt: null });

        return {
            businesses: businesses[0] || {},
            inspectors: inspectors[0] || {},
            inspections: inspections[0] || {},
            totalWards: wards,
            unreadAlerts: alerts,
            compliancePercentage: compliance[0] ? Math.round(compliance[0].avgCompliance) : 0
        };
    }

    async getCommissionerAnalytics() {
        // Commissioner needs High-Level summaries
        const [wardPerformance, riskDistribution, trends] = await Promise.all([
            Inspection.aggregate([
                { $match: { deletedAt: null, complianceScore: { $ne: null } } },
                { $lookup: { from: 'wards', localField: 'ward', foreignField: '_id', as: 'wardInfo' } },
                { $unwind: '$wardInfo' },
                {
                    $group: {
                        _id: '$wardInfo.wardName',
                        avgCompliance: { $avg: '$complianceScore' },
                        totalInspections: { $sum: 1 }
                    }
                },
                { $sort: { avgCompliance: -1 } }
            ]),
            FoodBusiness.aggregate([
                { $match: { deletedAt: null } },
                { $group: { _id: '$riskCategory', count: { $sum: 1 } } }
            ]),
            Inspection.aggregate([
                { $match: { deletedAt: null, completedAt: { $ne: null } } },
                {
                    $group: {
                        _id: { $dateToString: { format: '%Y-%m', date: '$completedAt' } },
                        completed: { $sum: 1 },
                        avgScore: { $avg: '$complianceScore' }
                    }
                },
                { $sort: { '_id': 1 } }
            ])
        ]);

        return { wardPerformance, riskDistribution, trends };
    }

    async getInspectorDashboard(inspectorId) {
        const startOfDay = new Date(new Date().setHours(0, 0, 0, 0));
        const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

        const [inspections, scheduleToday] = await Promise.all([
            Inspection.aggregate([
                { $match: { inspector: new mongoose.Types.ObjectId(inspectorId), deletedAt: null } },
                {
                    $group: {
                        _id: null,
                        totalAssigned: { $sum: 1 },
                        completed: { $sum: { $cond: [{ $in: ['$status', ['Completed', 'Reviewed']] }, 1, 0] } },
                        pending: { $sum: { $cond: [{ $in: ['$status', ['Assigned', 'In Progress', 'Scheduled']] }, 1, 0] } }
                    }
                }
            ]),
            Inspection.find({
                inspector: inspectorId,
                scheduledDate: { $gte: startOfDay, $lt: endOfDay },
                status: { $in: ['Assigned', 'Scheduled', 'In Progress'] }
            }).populate('business', 'businessName address phone').lean()
        ]);

        return { stats: inspections[0] || {}, scheduleToday };
    }

    async buildExportData(reportType, filterOverrides = {}) {
        let data = [];
        if (reportType === 'BUSINESS') {
            data = await FoodBusiness.find({ deletedAt: null, ...filterOverrides }).lean();
        } else if (reportType === 'INSPECTION') {
            data = await Inspection.find({ deletedAt: null, ...filterOverrides })
                .populate('business', 'businessName licenseNumber')
                .populate('inspector', 'fullName employeeId')
                .lean();
        } else if (reportType === 'VIOLATION') {
            data = await Violation.find({ deletedAt: null, ...filterOverrides })
                .populate('inspectionReference', 'inspectionNumber scheduledDate')
                .lean();
        }
        return data;
    }
}

export default new AnalyticsRepository();
