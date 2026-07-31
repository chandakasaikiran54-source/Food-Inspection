// abstract Notification Adapter Pattern mapped for future extensions
class INotificationAdapter {
    async sendEmail(to, subject, body) {
        console.log(`[Notification Stub] Email prepared for ${to} | Subject: ${subject}`);
        // Future: integrate SendGrid/AWS SES
        return true;
    }

    async sendSMS(phoneNumber, message) {
        console.log(`[Notification Stub] SMS prepared for ${phoneNumber}`);
        // Future: integrate Twilio/Plivo
        return true;
    }

    async sendPushNotification(deviceToken, title, message) {
        console.log(`[Notification Stub] Push initialized for ${deviceToken}`);
        // Future: integrate FCM/APNs
        return true;
    }
}

export default new INotificationAdapter();
