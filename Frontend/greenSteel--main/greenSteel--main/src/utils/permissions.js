import { PERMISSIONS } from "../constants/permissions";

export const hasPermission = (user, permission) => {

    if (!user) {

        return false;

    }

    const rolePermissions = PERMISSIONS[user.role];

    if (!rolePermissions) {

        return false;

    }

    return rolePermissions[permission];

};