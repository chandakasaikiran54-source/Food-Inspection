import violationRepository from '../repositories/violation.repository.js';
import AuditLog from '../models/AuditLog.model.js';
import inspectionRepository from '../repositories/inspection.repository.js';

class ViolationService {
    async addViolation(inspectionId, data, requestedBy, meta = {}) {
        const inspection = await inspectionRepository.findById(inspectionId);
        if (!inspection) throw Object.assign(new Error('Inspection not found'), { status: 404 });

        if (inspection.inspector._id.toString() !== requestedBy._id.toString() && requestedBy.role !== 'ADMIN') {
            throw Object.assign(new Error('Only the assigned inspector or ADMIN can add violations'), { status: 403 });
        }

        const violation = await violationRepository.create({
            ...data,
            inspectionReference: inspectionId
        });

        await AuditLog.create({
            userId: requestedBy._id,
            action: 'INSPECTION_VIOLATION_ADDED', module: 'INSPECTION',
            description: `Violation added: ${violation.violationCode} - ${violation.severity}`,
            metadata: { inspectionId, violationId: violation._id, severity: violation.severity },
            ipAddress: meta.ip
        });

        return violation;
    }

    async updateViolation(id, updates, requestedBy, meta = {}) {
        const violation = await violationRepository.findById(id);
        if (!violation) throw Object.assign(new Error('Violation not found'), { status: 404 });

        const updated = await violationRepository.update(id, updates);
        return updated;
    }

    async getViolationsForInspection(inspectionId) {
        return violationRepository.findAllByInspectionId(inspectionId);
    }

    async deleteViolation(id, requestedBy, meta = {}) {
        await violationRepository.softDelete(id);
    }
}

export default new ViolationService();
