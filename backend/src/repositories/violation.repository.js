import Violation from '../models/Violation.model.js';

class ViolationRepository {
    async create(data) {
        return Violation.create(data);
    }

    async findById(id) {
        return Violation.findOne({ _id: id, deletedAt: null });
    }

    async findAllByInspectionId(inspectionId) {
        return Violation.find({ inspectionReference: inspectionId, deletedAt: null }).sort({ createdAt: 1 }).lean();
    }

    async getStatsByInspectionId(inspectionId) {
        const violations = await this.findAllByInspectionId(inspectionId);
        let critical = 0, major = 0, minor = 0;

        violations.forEach(v => {
            if (v.severity === 'Critical') critical++;
            else if (v.severity === 'Major') major++;
            else if (v.severity === 'Minor') minor++;
        });

        return {
            total: violations.length,
            critical,
            major,
            minor
        };
    }

    async update(id, updates) {
        return Violation.findOneAndUpdate({ _id: id, deletedAt: null }, updates, { new: true, runValidators: true });
    }

    async softDelete(id) {
        return Violation.findOneAndUpdate({ _id: id, deletedAt: null }, { deletedAt: new Date() }, { new: true });
    }
}

export default new ViolationRepository();
