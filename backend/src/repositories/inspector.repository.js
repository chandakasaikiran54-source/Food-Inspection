import Inspector from '../models/Inspector.model.js';

class InspectorRepository {
    async create(data) {
        return Inspector.create(data);
    }

    async findById(id) {
        return Inspector.findOne({ _id: id, deletedAt: null }).populate('assignedWards');
    }

    async findByEmployeeIdOrEmail(employeeId, email) {
        return Inspector.findOne({
            $or: [{ employeeId: { $regex: new RegExp(`^${employeeId}$`, 'i') } }, { email: { $regex: new RegExp(`^${email}$`, 'i') } }],
            deletedAt: null
        });
    }

    async update(id, updates) {
        return Inspector.findOneAndUpdate({ _id: id, deletedAt: null }, updates, { new: true, runValidators: true });
    }

    async addWardAssignment(inspectorId, wardId) {
        return Inspector.findByIdAndUpdate(inspectorId, {
            $addToSet: { assignedWards: wardId },
            $inc: { currentWorkload: 1 }
        }, { new: true });
    }

    async removeWardAssignment(inspectorId, wardId) {
        return Inspector.findByIdAndUpdate(inspectorId, {
            $pull: { assignedWards: wardId },
            $inc: { currentWorkload: -1 }
        }, { new: true });
    }

    async softDelete(id, deletedBy) {
        return Inspector.findOneAndUpdate({ _id: id, deletedAt: null }, { deletedAt: new Date(), updatedBy: deletedBy }, { new: true });
    }

    async findAll({ page = 1, limit = 10, search, department, availabilityStatus, sortBy = 'createdAt', order = 'desc' }) {
        const filter = { deletedAt: null };

        if (search) filter.$text = { $search: search };
        if (department) filter.department = department;
        if (availabilityStatus) filter.availabilityStatus = availabilityStatus;

        const sort = {};
        if (search) {
            sort.score = { $meta: 'textScore' };
        } else {
            sort[sortBy] = order === 'asc' ? 1 : -1;
        }

        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            Inspector.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .populate('assignedWards', 'wardNumber wardName zone')
                .lean(),
            Inspector.countDocuments(filter),
        ]);

        return { data, total };
    }
}

export default new InspectorRepository();
