import FoodBusiness from '../models/FoodBusiness.model.js';
import Inspection from '../models/Inspection.model.js';
import FrequencyRule from '../models/FrequencyRule.model.js';
import Ward from '../models/Ward.model.js';

class FrequencyRepository {
    async getRules() {
        return FrequencyRule.find({}).sort({ intervalDays: 1 });
    }

    async updateRule(riskCategory, intervalDays, userId) {
        return FrequencyRule.findOneAndUpdate(
            { riskCategory },
            { intervalDays, updatedBy: userId },
            { new: true, upsert: true }
        );
    }

    async getDashboardMetrics(requestedByRole, requestedByInspectorId = null) {

        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfWeek = new Date(startOfDay.getTime() + 7 * 24 * 60 * 60 * 1000);

        let businessMatch = { deletedAt: null };
        let inspectionMatch = { deletedAt: null };

        // Scope viewing if Inspector
        if (requestedByRole === 'INSPECTOR' && requestedByInspectorId) {
            inspectionMatch.inspector = requestedByInspectorId;
        }

        const [totalBusinesses, totalInspections, completedToday, pendingInspections, criticalBusinesses, highRiskBusinesses, overdueData, upcomingThisWeek, complianceData] = await Promise.all([
            // Total Businesses
            FoodBusiness.countDocuments(businessMatch),
            // Total Inspections
            Inspection.countDocuments(inspectionMatch),
            // Completed Today
            Inspection.countDocuments({ ...inspectionMatch, status: 'Completed', completedAt: { $gte: startOfDay } }),
            // Pending Inspections
            Inspection.countDocuments({ ...inspectionMatch, status: { $in: ['Assigned', 'In Progress', 'Scheduled'] } }),
            // Critical
            FoodBusiness.countDocuments({ ...businessMatch, riskCategory: 'Critical' }),
            // High Risk
            FoodBusiness.countDocuments({ ...businessMatch, riskCategory: 'HIGH' }),
            // Overdue (Business Next Due Date < Now)
            FoodBusiness.find({ ...businessMatch, nextDueDate: { $lt: now, $ne: null } }).select('_id lastInspectionDate riskCategory nextDueDate'),
            // Upcoming Weekly (Business Next Due Date >= Now AND < EndOfWeek)
            FoodBusiness.countDocuments({ ...businessMatch, nextDueDate: { $gte: now, $lt: endOfWeek } }),
            // Global Compliance Average
            Inspection.aggregate([
                { $match: { ...inspectionMatch, complianceScore: { $ne: null } } },
                { $group: { _id: null, avgCompliance: { $avg: '$complianceScore' } } }
            ])
        ]);

        return {
            totalBusinesses,
            totalInspections,
            completedToday,
            pending: pendingInspections,
            overdue: overdueData.length,
            criticalBusinesses,
            highRiskBusinesses,
            upcomingThisWeek,
            compliancePercentage: complianceData[0] ? Math.round(complianceData[0].avgCompliance) : 0
        };
    }

    async getOverdueBusinesses() {
        const now = new Date();
        return FoodBusiness.find({ nextDueDate: { $lt: now, $ne: null }, deletedAt: null })
            .populate('ward') // assuming simple string references were used, wait schema used strings for Ward on Business, interesting. I'll stick to basic lookups.
            .sort({ nextDueDate: 1 })
            .lean();
    }

    async getUpcomingBusinesses(days) {
        const now = new Date();
        const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
        return FoodBusiness.find({
            nextDueDate: { $gte: now, $lte: futureDate },
            deletedAt: null
        }).sort({ nextDueDate: 1 }).lean();
    }

    async getInspectorWorkload() {
        return Inspection.aggregate([
            { $match: { deletedAt: null } },
            {
                $group: {
                    _id: '$inspector',
                    pendingInspections: { $sum: { $cond: [{ $in: ['$status', ['Assigned', 'In Progress', 'Scheduled']] }, 1, 0] } },
                    completedInspections: { $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] } },
                    overdueAssignments: { $sum: { $cond: [{ $and: [{ $in: ['$status', ['Assigned', 'Scheduled']] }, { $lt: ['$scheduledDate', new Date()] }] }, 1, 0] } },
                    totalAssigned: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'inspectors',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'inspectorInfo'
                }
            },
            { $unwind: '$inspectorInfo' },
            {
                $project: {
                    _id: 1,
                    fullName: '$inspectorInfo.fullName',
                    employeeId: '$inspectorInfo.employeeId',
                    maxWorkload: '$inspectorInfo.maxWorkload',
                    pendingInspections: 1,
                    completedInspections: 1,
                    overdueAssignments: 1,
                    utilizationPercentage: {
                        $multiply: [{ $divide: ['$pendingInspections', '$inspectorInfo.maxWorkload'] }, 100]
                    }
                }
            },
            { $sort: { utilizationPercentage: -1 } }
        ]);
    }
}

export default new FrequencyRepository();
