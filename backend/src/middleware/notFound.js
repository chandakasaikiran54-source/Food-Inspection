/**
 * src/middleware/notFound.js
 * 404 handler for unknown routes.
 */

import { errorResponse } from '../utils/response.js';

const notFound = (req, res) => {
    errorResponse(res, `Cannot ${req.method} ${req.originalUrl}`, 404);
};

export default notFound;
