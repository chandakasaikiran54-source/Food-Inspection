import analyticsRepository from '../repositories/analytics.repository.js';
import AuditLog from '../models/AuditLog.model.js';
import frequencyService from '../services/frequency.service.js';

class AnalyticsService {

    async getRoleDashboard(requestedBy, meta = {}) {
        let dashboardData = {};

        switch (requestedBy.role) {
            case 'ADMIN':
                dashboardData = await analyticsRepository.getAdminDashboardMetrics();
                break;
            case 'COMMISSIONER':
                dashboardData = await analyticsRepository.getCommissionerAnalytics();
                break;
            case 'SUPERVISOR':
                // For Supervisor, we map workload constraints + global assignments. 
                const workload = await frequencyService.getInspectorWorkload();
                dashboardData = { assignedInspectors: workload, summary: await analyticsRepository.getAdminDashboardMetrics() };
                break;
            case 'INSPECTOR':
                dashboardData = await analyticsRepository.getInspectorDashboard(requestedBy._id);
                break;
            default:
                throw Object.assign(new Error('Dashboard access restricted for given role'), { status: 403 });
        }

        await AuditLog.create({
            userId: requestedBy._id,
            action: 'DASHBOARD_VIEWED', module: 'ANALYTICS',
            description: `${requestedBy.role} requested mapping analytics scope`,
            ipAddress: meta.ip
        });

        return dashboardData;
    }

    async generateExport(reportType, format, filterOverrides, requestedBy, meta = {}) {
        const rawData = await analyticsRepository.buildExportData(reportType, filterOverrides);

        await AuditLog.create({
            userId: requestedBy._id,
            action: 'REPORT_EXPORTED', module: 'REPORT',
            description: `Exported ${reportType} report globally into ${format} format`,
            ipAddress: meta.ip
        });

        if (format === 'CSV') {
            return this.convertToCSV(rawData);
        } else {
            // Default fallback to raw JSON buffers (pseudo-Excel/PDF downstream placeholder matching restrictions)
            return Buffer.from(JSON.stringify(rawData, null, 2));
        }
    }

    convertToCSV(objArray) {
        if (!objArray || !objArray.length) return '';
        const flattenObject = (obj, prefix = '') => {
            return Object.keys(obj).reduce((acc, k) => {
                const pre = prefix.length ? prefix + '.' : '';
                if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
                    Object.assign(acc, flattenObject(obj[k], pre + k));
                } else {
                    acc[pre + k] = obj[k];
                }
                return acc;
            }, {});
        };

        const flattened = objArray.map(item => flattenObject(item));
        const keys = [...new Set(flattened.flatMap(Object.keys))];

        const csvRows = [keys.join(',')];

        for (const row of flattened) {
            const values = keys.map(k => {
                const val = row[k] === null || row[k] === undefined ? '' : row[k];
                const strVal = String(val).replace(/"/g, '""');
                return `"${strVal}"`;
            });
            csvRows.push(values.join(','));
        }
        return csvRows.join('\n');
    }
}

export default new AnalyticsService();
