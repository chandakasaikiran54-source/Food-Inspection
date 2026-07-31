import wardRepository from '../repositories/ward.repository.js';
import inspectorRepository from '../repositories/inspector.repository.js';
import inspectorService from './inspector.service.js';
import AuditLog from '../models/AuditLog.model.js';

class WardService {
    async createWard(data, requestedBy, meta = {}) {
        const existing = await wardRepository.findByWardNumber(data.wardNumber);
        if (existing) {
            throw Object.assign(new Error(`Ward number ${data.wardNumber} already exists`), { status: 409 });
        }

        const ward = await wardRepository.create({ ...data, createdBy: requestedBy._id });

        await AuditLog.create({
            userId: requestedBy._id,
            action: 'WARD_CREATED', module: 'WARD',
            description: `Created Ward: ${ward.wardName} (${ward.wardNumber})`,
            metadata: { wardId: ward._id },
            ipAddress: meta.ip,
        });

        return ward;
    }

    async getWardById(id) {
        const ward = await wardRepository.findById(id);
        if (!ward) throw Object.assign(new Error('Ward not found'), { status: 404 });
        return ward;
    }

    async listWards(query) {
        return wardRepository.findAll(query);
    }

    async updateWard(id, updates, requestedBy, meta = {}) {
        const ward = await this.getWardById(id);

        if (updates.wardNumber && updates.wardNumber !== ward.wardNumber) {
            const existing = await wardRepository.findByWardNumber(updates.wardNumber);
            if (existing) throw Object.assign(new Error('Ward number is already assigned'), { status: 409 });
        }

        updates.updatedBy = requestedBy._id;
        const updated = await wardRepository.update(id, updates);

        await AuditLog.create({
            userId: requestedBy._id,
            action: 'WARD_UPDATED', module: 'WARD',
            description: `Updated Ward data for: ${updated.wardName}`,
            metadata: { wardId: id, updates: Object.keys(updates) },
            ipAddress: meta.ip
        });

        return updated;
    }

    async deleteWard(id, requestedBy, meta = {}) {
        const ward = await this.getWardById(id);
        if (ward.assignedInspector) {
            throw Object.assign(new Error('Cannot delete a ward with an actively assigned inspector. Remove assignment first.'), { status: 400 });
        }

        await wardRepository.softDelete(id, requestedBy._id);

        await AuditLog.create({
            userId: requestedBy._id,
            action: 'WARD_DELETED', module: 'WARD',
            description: `Deleted Ward: ${ward.wardName}`,
            metadata: { wardId: id },
            ipAddress: meta.ip
        });
    }

    async assignInspector(wardId, inspectorId, requestedBy, meta = {}) {
        const ward = await this.getWardById(wardId);
        if (ward.assignedInspector) {
            throw Object.assign(new Error('Ward already has an inspector assigned. Use reassign API instead.'), { status: 400 });
        }

        const inspector = await inspectorService.getInspectorById(inspectorId);
        if (inspector.availabilityStatus !== 'ACTIVE') {
            throw Object.assign(new Error('Cannot assign to an inspector who is not ACTIVE.'), { status: 400 });
        }
        if (inspector.currentWorkload >= inspector.maxWorkload) {
            throw Object.assign(new Error(`Assignment failed: Inspector ${inspector.fullName} is exactly at or beyond max workload capacity (${inspector.maxWorkload}).`), { status: 400 });
        }

        // Bi-directional hook execution
        await wardRepository.updateAssignedInspector(wardId, inspectorId);
        await inspectorRepository.addWardAssignment(inspectorId, wardId);

        await AuditLog.create({
            userId: requestedBy._id,
            action: 'WARD_ASSIGNED', module: 'WARD',
            description: `Assigned Inspector ${inspector.fullName} to Ward ${ward.wardName}`,
            metadata: { wardId, inspectorId },
            ipAddress: meta.ip
        });

        return this.getWardById(wardId);
    }

    async reassignInspector(wardId, newInspectorId, requestedBy, meta = {}) {
        const ward = await this.getWardById(wardId);
        if (!ward.assignedInspector) {
            throw Object.assign(new Error('No inspector currently assigned. Use standard assign API.'), { status: 400 });
        }

        const oldInspectorId = ward.assignedInspector._id || ward.assignedInspector;
        if (oldInspectorId.toString() === newInspectorId) {
            throw Object.assign(new Error('Target inspector is already assigned to this ward.'), { status: 400 });
        }

        const newInspector = await inspectorService.getInspectorById(newInspectorId);
        if (newInspector.availabilityStatus !== 'ACTIVE') {
            throw Object.assign(new Error('Cannot assign to an inactive inspector.'), { status: 400 });
        }
        if (newInspector.currentWorkload >= newInspector.maxWorkload) {
            throw Object.assign(new Error(`Cannot assign: New inspector is at max capacity.`), { status: 400 });
        }

        // De-link old mapped arrays natively
        await inspectorRepository.removeWardAssignment(oldInspectorId, wardId);

        // Link new mapped array logic
        await inspectorRepository.addWardAssignment(newInspectorId, wardId);
        await wardRepository.updateAssignedInspector(wardId, newInspectorId);

        await AuditLog.create({
            userId: requestedBy._id,
            action: 'WARD_REASSIGNED', module: 'WARD',
            description: `Transferred Ward ${ward.wardName} from prior inspector to new assignment`,
            metadata: { wardId, oldInspectorId, newInspectorId },
            ipAddress: meta.ip
        });

        return this.getWardById(wardId);
    }
}

export default new WardService();
