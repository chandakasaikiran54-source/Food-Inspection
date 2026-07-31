import Ward from '../models/Ward.model.js';

class WardRepository {
    async create(data) {
        return Ward.create(data);
    }

    async findById(id) {
        return Ward.findOne({ _id: id, deletedAt: null }).populate('assignedInspector', 'fullName employeeId availabilityStatus');
    }

    async findByWardNumber(wardNumber) {
        return Ward.findOne({ wardNumber: { $regex: new RegExp(`^${wardNumber}$`, 'i') }, deletedAt: null });
    }

    async update(id, updates) {
        return Ward.findOneAndUpdate({ _id: id, deletedAt: null }, updates, { new: true, runValidators: true });
    }

    async updateAssignedInspector(wardId, inspectorId) {
        return Ward.findByIdAndUpdate(wardId, { assignedInspector: inspectorId }, { new: true });
    }

    async removeAssignedInspector(wardId) {
        return Ward.findByIdAndUpdate(wardId, { assignedInspector: null }, { new: true });
    }

    async softDelete(id, deletedBy) {
        return Ward.findOneAndUpdate({ _id: id, deletedAt: null }, { deletedAt: new Date(), updatedBy: deletedBy }, { new: true });
    }

    async findAll({ page = 1, limit = 10, search, zone, circle, hasInspector, sortBy = 'createdAt', order = 'desc' }) {
        const filter = { deletedAt: null };

        if (search) filter.$text = { $search: search };
        if (zone) filter.zone = zone;
        if (circle) filter.circle = circle;
        if (hasInspector === 'true') filter.assignedInspector = { $ne: null };
        if (hasInspector === 'false') filter.assignedInspector = null;

        const sort = {};
        if (search) {
            sort.score = { $meta: 'textScore' };
        } else {
            sort[sortBy] = order === 'asc' ? 1 : -1;
        }

        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            Ward.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .populate('assignedInspector', 'fullName employeeId availabilityStatus phone')
                .lean(),
            Ward.countDocuments(filter),
        ]);

        return { data, total };
    }
}

export default new WardRepository();
