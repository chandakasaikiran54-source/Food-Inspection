import inspectionRepository from '../repositories/inspection.repository.js';
import violationRepository from '../repositories/violation.repository.js';
import AuditLog from '../models/AuditLog.model.js';
import crypto from 'crypto';

class InspectionService {
    async createInspection(data, requestedBy, meta = {}) {
        const activeCount = await inspectionRepository.countActiveByBusiness(data.business);
        if (activeCount > 0) {
            throw Object.assign(new Error('Cannot create: An active inspection already exists for this business. Resolve it first.'), { status: 400 });
        }

        const inspectionNumber = await inspectionRepository.generateInspectionNumber();
        const inspection = await inspectionRepository.create({
            ...data,
            inspectionNumber,
            createdBy: requestedBy._id,
            status: 'Draft',
        });

        await AuditLog.create({
            userId: requestedBy._id,
            action: 'INSPECTION_CREATED', module: 'INSPECTION',
            description: `Created Inspection ${inspectionNumber}`,
            metadata: { inspectionId: inspection._id, inspectionNumber },
            ipAddress: meta.ip,
        });

        return inspection;
    }

    async getInspectionById(id) {
        const inspection = await inspectionRepository.findById(id);
        if (!inspection) throw Object.assign(new Error('Inspection not found'), { status: 404 });
        return inspection;
    }

    async assignInspector(id, inspectorId, requestedBy, meta = {}) {
        const inspection = await inspectionRepository.updateStatus(id, 'Assigned', {
            inspector: inspectorId,
            assignedDate: new Date()
        });

        await AuditLog.create({
            userId: requestedBy._id,
            action: 'INSPECTION_ASSIGNED', module: 'INSPECTION',
            description: `Assigned inspection to new inspector`,
            metadata: { inspectionId: id, inspectorId },
            ipAddress: meta.ip
        });
        return inspection;
    }

    async updateStatus(id, newStatus, requestedBy, meta = {}) {
        let trackingFields = {};
        if (newStatus === 'In Progress') trackingFields.startedAt = new Date();
        else if (newStatus === 'Completed' || newStatus === 'Cancelled') trackingFields.completedAt = new Date();
        else if (newStatus === 'Reviewed') {
            trackingFields.supervisorReview = 'Approved';
            trackingFields.reviewDate = new Date();
        }

        const inspection = await inspectionRepository.updateStatus(id, newStatus, trackingFields);

        await AuditLog.create({
            userId: requestedBy._id,
            action: `INSPECTION_${newStatus.toUpperCase().replace(' ', '_')}`, module: 'INSPECTION',
            description: `Status changed to ${newStatus}`,
            metadata: { inspectionId: id, newStatus },
            ipAddress: meta.ip
        });
        return inspection;
    }

    async uploadEvidence(id, category, fileData, requestedBy, meta = {}) {
        const evidenceData = {
            fileId: crypto.randomUUID(),
            originalName: fileData.originalName,
            mimeType: fileData.mimeType,
            size: fileData.size,
            uploadedBy: requestedBy._id
        };

        const updated = await inspectionRepository.addEvidence(id, category, evidenceData);

        await AuditLog.create({
            userId: requestedBy._id,
            action: 'INSPECTION_EVIDENCE_UPLOADED', module: 'INSPECTION',
            description: `Uploaded evidence type: ${category}`,
            metadata: { inspectionId: id, fileId: evidenceData.fileId },
            ipAddress: meta.ip
        });
        return updated;
    }

    async computeInspectionResults(id) {
        const stats = await violationRepository.getStatsByInspectionId(id);
        let score = 100;
        score -= (stats.critical * 30);
        score -= (stats.major * 15);
        score -= (stats.minor * 5);
        if (score < 0) score = 0;

        let risk = 'Low';
        if (stats.critical > 0) risk = 'Critical';
        else if (stats.major >= 3) risk = 'High';
        else if (stats.major > 0 || stats.minor >= 5) risk = 'Medium';

        let grade = 'A';
        if (score < 50 || risk === 'Critical') grade = 'D';
        else if (score < 75 || risk === 'High') grade = 'C';
        else if (score < 90 || risk === 'Medium') grade = 'B';

        return inspectionRepository.update(id, {
            complianceScore: score,
            riskLevel: risk,
            foodSafetyGrade: grade
        });
    }

    async submitInspection(id, requestedBy, meta = {}) {
        const inspection = await this.getInspectionById(id);
        if (inspection.inspector._id.toString() !== requestedBy._id.toString()) {
            throw Object.assign(new Error('Only assigned inspector can submit'), { status: 403 });
        }

        await this.computeInspectionResults(id);
        return this.updateStatus(id, 'Submitted', requestedBy, meta);
    }
}

export default new InspectionService();
