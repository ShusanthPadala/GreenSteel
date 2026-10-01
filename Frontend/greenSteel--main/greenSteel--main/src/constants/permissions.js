// =====================================================================
// GreenSteel role-based access matrix
// ---------------------------------------------------------------------
// Each role lists the pages it can open and, per resource, which actions
// it may perform. The UI (sidebar, route guards, Add/Edit/Delete buttons)
// reads ONLY from here. It never grants more than the backend allows:
// users, roles, departments and emission types are SUPER_ADMIN-only on
// the API, so only SUPER_ADMIN can manage them here.
//
// `scope: 'department'` limits units and emission records to the user's
// own department (plant engineers see only their area of the plant).
//
// The backend enforces the same matrix in security/access/AccessPolicy.java.
// =====================================================================

const ALL = ['create', 'edit', 'delete'];
const CREATE_EDIT = ['create', 'edit'];
const EDIT = ['edit'];
const VIEW = [];
const RESOLVE = ['resolve'];

export const ROLE_ACCESS = {
    SUPER_ADMIN: {
        pages: ['dashboard', 'plant-map', 'departments', 'units', 'emission-records', 'emission-types', 'esg', 'users', 'roles', 'reports', 'alerts', 'settings'],
        actions: { departments: ALL, units: ALL, 'emission-records': ALL, 'emission-types': ALL, users: ALL, roles: ALL, reports: ALL, alerts: RESOLVE },
    },
    PLANT_ADMIN: {
        pages: ['dashboard', 'plant-map', 'departments', 'units', 'emission-records', 'emission-types', 'esg', 'reports', 'alerts', 'settings'],
        actions: { departments: VIEW, units: ALL, 'emission-records': ALL, 'emission-types': VIEW, reports: ALL, alerts: RESOLVE },
    },

    // ---- Plant engineers: record emissions for their own department ----
    BLAST_FURNACE_ENGINEER: { pages: ['dashboard', 'plant-map', 'units', 'emission-records', 'emission-types', 'alerts', 'settings'], actions: { units: EDIT, 'emission-records': CREATE_EDIT, alerts: RESOLVE }, scope: 'department' },
    COKE_OVEN_ENGINEER: { pages: ['dashboard', 'plant-map', 'units', 'emission-records', 'emission-types', 'alerts', 'settings'], actions: { units: EDIT, 'emission-records': CREATE_EDIT, alerts: RESOLVE }, scope: 'department' },
    SINTER_PLANT_ENGINEER: { pages: ['dashboard', 'plant-map', 'units', 'emission-records', 'emission-types', 'alerts', 'settings'], actions: { units: EDIT, 'emission-records': CREATE_EDIT, alerts: RESOLVE }, scope: 'department' },
    SMS_ENGINEER: { pages: ['dashboard', 'plant-map', 'units', 'emission-records', 'emission-types', 'alerts', 'settings'], actions: { units: EDIT, 'emission-records': CREATE_EDIT, alerts: RESOLVE }, scope: 'department' },
    POWER_PLANT_ENGINEER: { pages: ['dashboard', 'plant-map', 'units', 'emission-records', 'emission-types', 'alerts', 'settings'], actions: { units: EDIT, 'emission-records': CREATE_EDIT, alerts: RESOLVE }, scope: 'department' },
    UTILITIES_ENGINEER: { pages: ['dashboard', 'plant-map', 'units', 'emission-records', 'emission-types', 'alerts', 'settings'], actions: { units: EDIT, 'emission-records': CREATE_EDIT, alerts: RESOLVE }, scope: 'department' },

    // ---- Sustainability & compliance ----
    ESG_OFFICER: {
        pages: ['dashboard', 'plant-map', 'units', 'emission-records', 'emission-types', 'esg', 'reports', 'alerts', 'settings'],
        actions: { reports: ALL },
    },
    ENVIRONMENTAL_OFFICER: {
        pages: ['dashboard', 'plant-map', 'units', 'emission-records', 'emission-types', 'esg', 'reports', 'alerts', 'settings'],
        actions: { 'emission-records': CREATE_EDIT, reports: CREATE_EDIT, alerts: RESOLVE },
    },
    SAFETY_OFFICER: {
        pages: ['dashboard', 'plant-map', 'units', 'esg', 'reports', 'alerts', 'settings'],
        actions: { reports: CREATE_EDIT, alerts: RESOLVE },
    },

    // ---- Operations ----
    MAINTENANCE_ENGINEER: {
        pages: ['dashboard', 'plant-map', 'units', 'emission-records', 'alerts', 'settings'],
        actions: { units: EDIT },
    },
    PRODUCTION_MANAGER: {
        pages: ['dashboard', 'plant-map', 'departments', 'units', 'emission-records', 'esg', 'reports', 'alerts', 'settings'],
        actions: { reports: CREATE_EDIT },
    },
    QUALITY_ENGINEER: {
        pages: ['dashboard', 'plant-map', 'units', 'emission-records', 'emission-types', 'reports', 'alerts', 'settings'],
        actions: { 'emission-records': EDIT, reports: CREATE_EDIT },
    },
};

// Any role not listed above gets a safe, read-only experience.
export const DEFAULT_ACCESS = {
    pages: ['dashboard', 'plant-map', 'alerts', 'settings'],
    actions: {},
};

// Legacy shape kept for older code paths (hasPermission(user, 'canCreate')).
export const PERMISSIONS = Object.fromEntries(
    Object.entries(ROLE_ACCESS).map(([role, access]) => {
        const all = Object.values(access.actions).flat();
        return [role, { canCreate: all.includes('create'), canEdit: all.includes('edit'), canDelete: all.includes('delete') }];
    })
);
