import { DEFAULT_ACCESS, PERMISSIONS, ROLE_ACCESS } from "../constants/permissions";

// Roles may arrive as "SUPER_ADMIN" or, from some clients, "ROLE_SUPER_ADMIN".
const normalizeRole = (role) => String(role || "").replace(/^ROLE_/, "").toUpperCase();

export const getAccess = (user) => (user && ROLE_ACCESS[normalizeRole(user.role)]) || DEFAULT_ACCESS;

/** "/emission-records" -> "emission-records" */
export const pageKeyFromPath = (path) => String(path || "").replace(/^\/+/, "").split(/[/?#]/)[0];

/** Can this user open the page at `path` (or page key)? */
export const canAccessPage = (user, pathOrKey) => {
    if (!user) return false;
    return getAccess(user).pages.includes(pageKeyFromPath(pathOrKey));
};

/** Can this user perform `action` ("create" | "edit" | "delete") on `resource`? */
export const canDo = (user, resource, action) => {
    if (!user || !resource) return false;
    return (getAccess(user).actions[resource] || []).includes(action);
};

/** True when the user should only see units/records from their own department. */
export const isDepartmentScoped = (user) => getAccess(user).scope === "department";

export const hasPermission = (user, permission) => {

    if (!user) {

        return false;

    }

    const rolePermissions = PERMISSIONS[normalizeRole(user.role)];

    if (!rolePermissions) {

        return false;

    }

    return rolePermissions[permission];

};
