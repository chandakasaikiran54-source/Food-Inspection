import frequencyRepository from '../repositories/frequency.repository.js';
import FoodBusiness from '../models/FoodBusiness.model.js';
import InspectionAlert from '../models/InspectionAlert.model.js';
import AuditLog from '../models/AuditLog.model.js';

class FrequencyService {
    async getRules() {
        return frequencyRepository.getRules();
    }

    async updateRule(riskCategory, intervalDays, requestedBy, meta = {}) {
        const rule = await frequencyRepository.updateRule(riskCategory, intervalDays, requestedBy._id);

        await AuditLog.create({
            userId: requestedBy._id,
            action: 'FREQUENCY_RULE_UPDATED', module: 'FREQUENCY',
            description: `Updated Rule for ${riskCategory} to ${intervalDays} days`,
            metadata: { riskCategory, intervalDays },
            ipAddress: meta.ip
        });

        return rule;
    }

    async getDashboardMetrics(requestedBy) {
        return frequencyRepository.getDashboardMetrics(requestedBy.role, requestedBy._id);
    }

    async getOverdueInspections() {
        return frequencyRepository.getOverdueBusinesses();
    }

    async getUpcoming(days = 15) {
        return frequencyRepository.getUpcomingBusinesses(days);
    }

    async getInspectorWorkload() {
        return frequencyRepository.getInspectorWorkload();
    }

    async triggerRecalculation(requestedBy, meta = {}) {
        await AuditLog.create({
            userId: requestedBy ? requestedBy._id : null,
            action: 'RECALCULATION_STARTED', module: 'FREQUENCY',
            description: `Starting full business frequency recalculation`,
            ipAddress: meta.ip
        });

        const rules = await this.getRules();
        const ruleMap = rules.reduce((acc, rule) => {
            acc[rule.riskCategory.toUpperCase()] = rule.intervalDays;
            return acc;
        }, {});

        // Fallbacks
        const fallbacks = { CRITICAL: 30, HIGH: 60, MEDIUM: 90, LOW: 180 };

        const businesses = await FoodBusiness.find({ businessStatus: 'ACTIVE', deletedAt: null });
        let updatedCount = 0;

        for (const biz of businesses) {
            let baseDate = biz.lastInspectionDate || biz.licenseIssueDate;
            const category = (biz.riskCategory || 'MEDIUM').toUpperCase();

            const interval = ruleMap[category] || fallbacks[category];

            if (baseDate && interval) {
                const nextDue = new Date(baseDate.getTime() + interval * 24 * 60 * 60 * 1000);
                if (!biz.nextDueDate || biz.nextDueDate.getTime() !== nextDue.getTime()) {
                    biz.nextDueDate = nextDue;
                    await biz.save();
                    updatedCount++;
                }
            }
        }

        await AuditLog.create({
            userId: requestedBy ? requestedBy._id : null,
            action: 'RECALCULATION_COMPLETED', module: 'FREQUENCY',
            description: `Recalculation complete. Updated ${updatedCount} businesses.`,
            ipAddress: meta.ip
        });

        return { success: true, updatedCount };
    }
}

export default new FrequencyService();
