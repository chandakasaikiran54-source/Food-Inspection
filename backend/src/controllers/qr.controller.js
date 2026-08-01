import FoodBusiness from '../models/FoodBusiness.model.js';
import AuditLog from '../models/AuditLog.model.js';
import { generateSecureQR } from '../utils/qrHelper.js';
import { successResponse, errorResponse } from '../utils/response.js';

class QRController {
    // Regenerate QR manually by Admin/Owner
    async regenerateQR(req, res, next) {
        try {
            const { businessId } = req.params;
            const business = await FoodBusiness.findById(businessId);
            if (!business) return errorResponse(res, 'Business not found', 404);

            const qrData = await generateSecureQR(business._id);
            business.qrToken = qrData.qrToken;
            business.qrImage = qrData.qrImage;
            business.qrVersion += 1;
            business.lastRegenerated = new Date();
            await business.save();

            await AuditLog.create({
                userId: req.user._id, userEmail: req.user.email, userRole: req.user.role,
                action: 'QR_REGENERATED', module: 'BUSINESS', description: `Regenerated QR ver ${business.qrVersion}`,
                metadata: { businessId: business._id },
                ipAddress: req.ip, userAgent: req.headers['user-agent']
            });

            return successResponse(res, 'QR Code Regenerated', { qrImage: business.qrImage, qrToken: business.qrToken, version: business.qrVersion });
        } catch (error) {
            next(error);
        }
    }

    // Public Resolution (Limited info)
    async resolvePublic(req, res, next) {
        try {
            const { token } = req.params;
            const business = await FoodBusiness.findOne({
                $or: [
                    { qrToken: token },
                    ...(token.length === 24 ? [{ _id: token }] : [])
                ]
            });
            if (!business) return errorResponse(res, 'Invalid QR Code', 404);

            return successResponse(res, 'Business verified', {
                businessName: business.businessName,
                businessStatus: business.businessStatus,
                licenseNumber: business.licenseNumber,
                riskCategory: business.riskCategory,
                lastInspectionDate: business.lastInspectionDate,
                nextDueDate: business.nextDueDate,
                verifiedBy: 'GVMC Public Health Department'
            });
        } catch (error) {
            next(error);
        }
    }

    // Secure Resolution (Inspector only)
    async resolveSecure(req, res, next) {
        try {
            const { token } = req.params;
            const business = await FoodBusiness.findOne({
                $or: [
                    { qrToken: token },
                    ...(token.length === 24 ? [{ _id: token }] : [])
                ]
            });
            if (!business) return errorResponse(res, 'Invalid QR Code', 404);

            await AuditLog.create({
                userId: req.user._id, userEmail: req.user.email, userRole: req.user.role,
                action: 'QR_SCANNED', module: 'INSPECTION', description: `Inspector scanned QR code`,
                metadata: { businessId: business._id },
                ipAddress: req.ip, userAgent: req.headers['user-agent']
            });

            // Return full business object for inspection
            return successResponse(res, 'Authorized Business Data', business);
        } catch (error) {
            next(error);
        }
    }
}

export default new QRController();
