/**
 * src/middleware/validate.middleware.js
 * Generic Zod validation middleware factory.
 * Usage: validate(schema, 'body' | 'query' | 'params')
 */

import { ZodError } from 'zod';
import { errorResponse } from '../utils/response.js';

const validate = (schema, source = 'body') => (req, res, next) => {
    try {
        const parsed = schema.parse(req[source]);
        req[source] = parsed; // replace with coerced/transformed values
        next();
    } catch (err) {
        if (err instanceof ZodError) {
            const errors = err.errors.map((e) => ({
                field: e.path.join('.'),
                message: e.message,
            }));
            return errorResponse(res, 'Validation failed', 422, errors);
        }
        next(err);
    }
};

export default validate;
