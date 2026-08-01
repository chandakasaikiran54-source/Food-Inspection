/**
 * src/config/config.js
 * Single source of truth for frontend environment configuration.
 * Avoids hardcoding any static IPs directly inside the source code.
 */

const getEnv = (key) => import.meta.env[key];

export const config = {
    // Core Application URL (Used for QR resolution and external deep links)
    appUrl: getEnv('VITE_APP_URL'),

    // API Gateway (Where Axios points)
    apiUrl: getEnv('VITE_API_URL'),

    // Add future configurations (MapBox Keys, Sentry DSN, Analytics) here
};

// Start-up Validations preventing silent localhost fallbacks on bad networks
if (!config.appUrl) console.warn('⚠️ WARNING: VITE_APP_URL is not configured in .env');
if (!config.apiUrl) console.warn('⚠️ WARNING: VITE_API_URL is not configured in .env');

export default config;
