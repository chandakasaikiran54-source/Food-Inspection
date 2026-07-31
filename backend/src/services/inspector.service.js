import inspectorRepository from '../repositories/inspector.repository.js';
import AuditLog from '../models/AuditLog.model.js';

class InspectorService {
    async createInspector(data, requestedBy, meta = {}) {
        const existing = await inspectorRepository.findByEmployeeIdOrEmail(data.employeeId, data.email);
        if (existing) {
            throw Object.assign(new Error(`Employee ID or Email already exists in the system`), { status: 409 });
        }

        const inspector = await inspectorRepository.create({
            ...data,
            createdBy: requestedBy._id,
        });

        await AuditLog.create({
            userId: requestedBy._id,
            userEmail: requestedBy.email,
            userRole: requestedBy.role,
            action: 'INSPECTOR_CREATED',
            module: 'INSPECTOR',
            description: `Created Inspector: ${inspector.fullName} (${inspector.employeeId})`,
            metadata: { inspectorId: inspector._id, employeeId: inspector.employeeId },
            ipAddress: meta.ip,
            userAgent: meta.userAgent,
        });

        return inspector;
    }

    async getInspectorById(id) {
        const inspector = await inspectorRepository.findById(id);
        if (!inspector) throw Object.assign(new Error('Inspector not found'), { status: 404 });
        return inspector;
    }

    async listInspectors(query) {
        return inspectorRepository.findAll(query);
    }

    async updateInspector(id, updates, requestedBy, meta = {}) {
        const inspector = await this.getInspectorById(id);

        if ((updates.employeeId && updates.employeeId !== inspector.employeeId) ||
            (updates.email && updates.email !== inspector.email)) {
            const existing = await inspectorRepository.findByEmployeeIdOrEmail(updates.employeeId ?? inspector.employeeId, updates.email ?? inspector.email);
            if (existing && existing._id.toString() !== id) {
                throw Object.assign(new Error('Updated Employee ID or Email conflicts with existing records'), { status: 409 });
            }
        }

        updates.updatedBy = requestedBy._id;
        const updated = await inspectorRepository.update(id, updates);

        await AuditLog.create({
            userId: requestedBy._id,
            action: 'INSPECTOR_UPDATED',
            module: 'INSPECTOR',
            description: `Updated Inspector logic: ${updated.fullName}`,
            metadata: { inspectorId: id, updates: Object.keys(updates) },
            ipAddress: meta.ip
        });

        return updated;
    }

    async updateStatus(id, status, requestedBy, meta = {}) {
        const inspector = await this.getInspectorById(id);
        const updated = await inspectorRepository.update(id, { availabilityStatus: status, updatedBy: requestedBy._id });

        await AuditLog.create({
            userId: requestedBy._id,
            action: 'INSPECTOR_STATUS_CHANGED',
            module: 'INSPECTOR',
            description: `Changed Inspector Status to ${status} for ${updated.fullName}`,
            metadata: { inspectorId: id, newStatus: status },
            ipAddress: meta.ip
        });
        return updated;
    }

    async deleteInspector(id, requestedBy, meta = {}) {
        const inspector = await this.getInspectorById(id);
        if (inspector.currentWorkload > 0) {
            throw Object.assign(new Error('Cannot delete inspector with active assigned wards.'), { status: 400 });
        }
        await inspectorRepository.softDelete(id, requestedBy._id);

        await AuditLog.create({
            userId: requestedBy._id,
            action: 'INSPECTOR_DELETED',
            module: 'INSPECTOR',
            description: `Deleted Inspector: ${inspector.fullName}`,
            metadata: { inspectorId: id },
            ipAddress: meta.ip
        });
    }

    async getInspectorWorkload(id) {
        const inspector = await this.getInspectorById(id);
        return {
            inspectorId: inspector._id,
            fullName: inspector.fullName,
            currentWorkload: inspector.currentWorkload,
            maxWorkload: inspector.maxWorkload,
            availableCapacity: inspector.maxWorkload - inspector.currentWorkload,
            assignedWards: inspector.assignedWards
        };
    }
}

export default new InspectorService();
