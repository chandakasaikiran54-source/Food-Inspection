import frequencyService from '../services/frequency.service.js';
import InspectionAlert from '../models/InspectionAlert.model.js';
import AuditLog from '../models/AuditLog.model.js';

class SchedulerService {

    async runDailyJobs() {
        console.log('[Scheduler] Running Daily Engine Analysis...');

        try {
            await AuditLog.create({
                action: 'SCHEDULER_EXECUTED', module: 'SYSTEM',
                description: `Daily chronological jobs invoked via internal Engine.`,
            });

            // 1. Recalculate Dates globally ensuring accuracy
            await frequencyService.triggerRecalculation(null, { ip: 'INTERNAL_SCHEDULER' });

            // 2. Identify and Generate Alerts for Overdue & Upcoming
            const overdue = await frequencyService.getOverdueInspections();
            const upcoming = await frequencyService.getUpcoming(15);
            let alertCount = 0;

            for (const biz of overdue) {
                // Check if alert already exists for this cycle (UNREAD, READ, or ACKNOWLEDGED statuses retain active block)
                const existing = await InspectionAlert.findOne({ business: biz._id, type: 'INSPECTION_OVERDUE', status: { $in: ['UNREAD', 'READ', 'ACKNOWLEDGED'] }, deletedAt: null });
                if (!existing) {
                    await InspectionAlert.create({
                        type: 'INSPECTION_OVERDUE',
                        message: `Inspection Overdue for [${biz.businessName}] (${biz.licenseNumber})`,
                        business: biz._id,
                        priority: biz.riskCategory?.toUpperCase() === 'CRITICAL' ? 'Critical' : 'High'
                    });
                    alertCount++;
                }
            }

            for (const biz of upcoming) {
                const existing = await InspectionAlert.findOne({ business: biz._id, type: 'INSPECTION_DUE', status: { $in: ['UNREAD', 'READ', 'ACKNOWLEDGED'] }, deletedAt: null });
                if (!existing) {
                    await InspectionAlert.create({
                        type: 'INSPECTION_DUE',
                        message: `Inspection Due Soon for [${biz.businessName}] (${biz.licenseNumber})`,
                        business: biz._id,
                        priority: biz.riskCategory?.toUpperCase() === 'CRITICAL' ? 'High' : 'Medium'
                    });
                    alertCount++;
                }
            }

            if (alertCount > 0) {
                await AuditLog.create({
                    action: 'ALERT_GENERATED', module: 'SYSTEM',
                    description: `Generated ${alertCount} automated inspection mapping alerts over interval computations.`
                });
            }

            console.log(`[Scheduler] Completed. Dispatched ${alertCount} tracking alerts.`);
        } catch (error) {
            console.error('[Scheduler] Failure running jobs: ', error);
        }
    }
}

export default new SchedulerService();
