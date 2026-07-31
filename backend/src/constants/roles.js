/**
 * src/constants/roles.js
 * Application user roles.
 * Single source of truth – import this everywhere roles are checked.
 */

const ROLES = Object.freeze({
    ADMIN: 'ADMIN',
    COMMISSIONER: 'COMMISSIONER',
    SUPERVISOR: 'SUPERVISOR',
    INSPECTOR: 'INSPECTOR',
    VIEWER: 'VIEWER',
});

export default ROLES;
