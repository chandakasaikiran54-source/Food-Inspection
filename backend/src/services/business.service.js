import businessRepository from '../repositories/business.repository.js';
import AuditLog from '../models/AuditLog.model.js';
import logger from '../utils/logger.js';

class BusinessService {
    async createBusiness(data, requestedBy, meta = {}) {
        // Validate duplicate license
        const existing = await businessRepository.findByLicense(data.licenseNumber);
        if (existing) {
            throw Object.assign(new Error(`License number ${data.licenseNumber} is already registered to ${existing.businessName}`), { status: 409 });
        }

        const business = await businessRepository.create({
            ...data,
            createdBy: requestedBy._id,
        });

        await AuditLog.create({
            userId: requestedBy._id,
            userEmail: requestedBy.email,
            userRole: requestedBy.role,
            action: 'BUSINESS_CREATED',
            module: 'BUSINESS',
            description: `Created business: ${business.businessName}`,
            metadata: { businessId: business._id, license: business.licenseNumber },
            ipAddress: meta.ip,
            userAgent: meta.userAgent,
        });

        return business;
    }

    async getBusinessById(id) {
        const business = await businessRepository.findById(id);
        if (!business) throw Object.assign(new Error('Business not found'), { status: 404 });
        return business;
    }

    async listBusinesses(query) {
        return businessRepository.findAll(query);
    }

    async updateBusiness(id, updates, requestedBy, meta = {}) {
        const business = await this.getBusinessById(id);

        if (updates.licenseNumber && updates.licenseNumber !== business.licenseNumber) {
            const existing = await businessRepository.findByLicense(updates.licenseNumber);
            if (existing) throw Object.assign(new Error('License number is already in use'), { status: 409 });
        }

        updates.updatedBy = requestedBy._id;
        const updated = await businessRepository.update(id, updates);

        await AuditLog.create({
            userId: requestedBy._id,
            userEmail: requestedBy.email,
            userRole: requestedBy.role,
            action: 'BUSINESS_UPDATED',
            module: 'BUSINESS',
            description: `Updated business: ${business.businessName}`,
            metadata: { businessId: id, updates: Object.keys(updates) },
            ipAddress: meta.ip,
            userAgent: meta.userAgent,
        });

        return updated;
    }

    async deleteBusiness(id, requestedBy, meta = {}) {
        const business = await this.getBusinessById(id);

        await businessRepository.softDelete(id, requestedBy._id);

        await AuditLog.create({
            userId: requestedBy._id,
            userEmail: requestedBy.email,
            userRole: requestedBy.role,
            action: 'BUSINESS_DELETED',
            module: 'BUSINESS',
            description: `Deleted business: ${business.businessName}`,
            metadata: { businessId: id },
            ipAddress: meta.ip,
            userAgent: meta.userAgent,
        });
    }
}

export default new BusinessService();
