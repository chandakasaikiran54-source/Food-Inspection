import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import config from '../config/config.js';

export const generateQRCertificate = async (business) => {
    const doc = new jsPDF('p', 'mm', 'a4');

    // Page dimensions
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Gov Theme Colors
    const primaryColor = [61, 64, 91]; // #3D405B
    const bgFill = [240, 244, 248];

    // Background block
    doc.setFillColor(...bgFill);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Header Banner
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Government of Andhra Pradesh", pageWidth / 2, 18, { align: 'center' });
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("GVMC Public Health Department", pageWidth / 2, 28, { align: 'center' });

    // Official Title
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.text("OFFICIAL FOOD SAFETY", pageWidth / 2, 70, { align: 'center' });
    doc.text("INSPECTION QR CODE", pageWidth / 2, 85, { align: 'center' });

    // Business Details Box
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(20, 110, pageWidth - 40, 50, 5, 5, 'FD');

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(business.name, pageWidth / 2, 125, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`FSSAI License No: ${business.licenseNo}`, pageWidth / 2, 137, { align: 'center' });
    doc.text(`Business Type: ${business.type} | District: ${business.district}`, pageWidth / 2, 147, { align: 'center' });

    // Generate QR Image Data URL
    // Enforce environment APP_URL directly connecting with the specific business token or ID safely
    const secureToken = business.qrToken || business._id || business.id;
    const scanUrl = `${config.appUrl}/scan/${secureToken}`;

    try {
        const qrDataUrl = await QRCode.toDataURL(scanUrl, {
            errorCorrectionLevel: 'H',
            margin: 1,
            width: 250,
            color: { dark: '#000000', light: '#ffffff' }
        });

        // Draw QR Code
        const qrSize = 90;
        const qrX = (pageWidth - qrSize) / 2;
        const qrY = 175;
        doc.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);

        // Final instructions
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text("SCAN FOR OFFICIAL FOOD SAFETY INSPECTION", pageWidth / 2, 280, { align: 'center' });

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(120, 120, 120);
        doc.text("Mandatory under GVMC Health & Sanitation Regulations", pageWidth / 2, 287, { align: 'center' });

        // Save
        doc.save(`GVMC_QR_Certificate_${business.licenseNo}.pdf`);

    } catch (err) {
        console.error("Failed to render QR Code inside PDF", err);
        throw err;
    }
};
