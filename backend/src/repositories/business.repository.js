import FoodBusiness from '../models/FoodBusiness.model.js';

class BusinessRepository {
    async create(data) {
        return FoodBusiness.create(data);
    }

    async findById(id) {
        return FoodBusiness.findOne({ _id: id, deletedAt: null }).populate('createdBy updatedBy', 'fullName email role');
    }

    async findByLicense(licenseNumber) {
        return FoodBusiness.findOne({ licenseNumber: { $regex: new RegExp(`^${licenseNumber}$`, 'i') }, deletedAt: null });
    }

    async update(id, updates) {
        return FoodBusiness.findOneAndUpdate({ _id: id, deletedAt: null }, updates, { new: true, runValidators: true }).populate('createdBy updatedBy', 'fullName email role');
    }

    async softDelete(id, deletedBy) {
        return FoodBusiness.findOneAndUpdate({ _id: id, deletedAt: null }, { deletedAt: new Date(), updatedBy: deletedBy }, { new: true });
    }

    async findAll({ page = 1, limit = 10, search, ward, zone, riskCategory, businessStatus, sortBy = 'createdAt', order = 'desc' }) {
        const filter = { deletedAt: null };

        if (search) {
            filter.$text = { $search: search };
        }
        if (ward) filter.ward = ward;
        if (zone) filter.zone = zone;
        if (riskCategory) filter.riskCategory = riskCategory;
        if (businessStatus) filter.businessStatus = businessStatus;

        // Construct sort object
        const sort = {};
        if (search) {
            sort.score = { $meta: 'textScore' };
        } else {
            sort[sortBy] = order === 'asc' ? 1 : -1;
        }

        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            FoodBusiness.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .populate('createdBy updatedBy', 'fullName email')
                .lean(),
            FoodBusiness.countDocuments(filter),
        ]);

        return { data, total };
    }
}

export default new BusinessRepository();
