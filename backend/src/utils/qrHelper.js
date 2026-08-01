import qrcode from 'qrcode';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateSecureQR = async (businessId) => {
    // Generates a cryptographically strong 16-byte hex token
    const qrToken = crypto.randomBytes(16).toString('hex');

    // Mobile-Ready Configuration: Reads directly from backend env parameter strictly without fallbacks
    const baseUrl = process.env.APP_URL;
    if (!baseUrl) {
        throw new Error('APP_URL environment variable not configured.');
    }
    const scanUrl = `${baseUrl}/scan/${qrToken}`;

    // Directory mapping
    const uploadDir = path.join(__dirname, '../../uploads/qrcodes');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `qr_${businessId}_${Date.now()}.png`;
    const filePath = path.join(uploadDir, fileName);

    // Generate official PNG
    await qrcode.toFile(filePath, scanUrl, {
        color: {
            dark: '#1e293b',  // Gov Navy
            light: '#ffffff' // White background
        },
        width: 400,
        margin: 2
    });

    return {
        qrToken,
        qrImage: `/uploads/qrcodes/${fileName}`
    };
};
