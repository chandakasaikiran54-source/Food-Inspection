/**
 * src/utils/response.js
 * Standardised HTTP response helpers.
 *
 * Success: { success, message, data }
 * Error:   { success, message, error }
 * Paginated: { success, message, data, pagination }
 */

export function successResponse(res, message = 'Success', data = null, statusCode = 200) {
    return res.status(statusCode).json({ success: true, message, data });
}

export function createdResponse(res, message = 'Created', data = null) {
    return res.status(201).json({ success: true, message, data });
}

export function errorResponse(res, message = 'An error occurred', statusCode = 500, error = null) {
    const body = { success: false, message };
    if (error) body.error = error;
    return res.status(statusCode).json(body);
}

export function paginatedResponse(res, message, data, { page, limit, total }) {
    return res.status(200).json({
        success: true,
        message,
        data,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page * limit < total,
            hasPrevPage: page > 1,
        },
    });
}
