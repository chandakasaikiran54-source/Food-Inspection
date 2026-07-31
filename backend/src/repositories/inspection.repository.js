import Inspection from '../models/Inspection.model.js';

class InspectionRepository {
    async create(data) {
        return Inspection.create(data);
    }

    async findById(id) {
        return Inspection.findOne({ _id: id, deletedAt: null })
            .populate('business', 'businessName licenseNumber address')
            .populate('inspector', 'fullName employeeId availabilityStatus')
            .populate('ward', 'wardName wardNumber zone')
            .populate('createdBy', 'fullName role');
    }

    async countActiveByBusiness(businessId) {
        // Prevent duplicate actively mapped inspections 
        return Inspection.countDocuments({
            business: businessId,
            status: { $nin: ['Completed', 'Cancelled'] },
            deletedAt: null
        });
    }

    async generateInspectionNumber() {
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const count = await Inspection.countDocuments({});
        return `INSP-${dateStr}-${(count + 1).toString().padStart(4, '0')}`;
    }

    async update(id, updates) {
        return Inspection.findOneAndUpdate({ _id: id, deletedAt: null }, updates, { new: true, runValidators: true });
    }

    async updateStatus(id, newStatus, trackingFields = {}) {
        return Inspection.findOneAndUpdate(
            { _id: id, deletedAt: null },
            { $set: { status: newStatus, ...trackingFields } },
            { new: true }
        );
    }

    async addEvidence(id, category, evidenceData) {
        const updateField = category === 'images' ? 'evidenceImages' : 'evidenceDocuments';
        return Inspection.findByIdAndUpdate(id, {
            $push: { [updateField]: evidenceData }
        }, { new: true });
    }

    async removeEvidence(id, fileId, category) {
        const updateField = category === 'images' ? 'evidenceImages' : 'evidenceDocuments';
        return Inspection.findByIdAndUpdate(id, {
            $pull: { [updateField]: { fileId } }
        }, { new: true });
    }

    async softDelete(id, deletedBy) {
        return Inspection.findOneAndUpdate(
            { _id: id, deletedAt: null },
            { deletedAt: new Date(), updatedBy: deletedBy },
            { new: true }
        );
    }

    async findAll({ page = 1, limit = 10, search, status, inspector, ward, riskLevel, inspectionType, sortBy = 'createdAt', order = 'desc' }) {
        const filter = { deletedAt: null };

        if (status) filter.status = status;
        if (inspector) filter.inspector = inspector;
        if (ward) filter.ward = ward;
        if (riskLevel) filter.riskLevel = riskLevel;
        if (inspectionType) filter.inspectionType = inspectionType;

        if (search) filter.inspectionNumber = { $regex: new RegExp(search, 'i') };

        const sort = {};
        sort[sortBy] = order === 'asc' ? 1 : -1;

        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            Inspection.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .populate('business', 'businessName licenseNumber')
                .populate('inspector', 'fullName employeeId')
                .lean(),
            Inspection.countDocuments(filter),
        ]);

        return { data, total };
    }
}

export default new InspectionRepository();
