import { describe, expect, it } from 'vitest';
import { canAccessPage, canDo, isDepartmentScoped } from '../utils/permissions';
import { ROLE_ACCESS } from '../constants/permissions';

// The 14 demo users from the project brief
const ROLES = [
  'SUPER_ADMIN', 'PLANT_ADMIN', 'BLAST_FURNACE_ENGINEER', 'COKE_OVEN_ENGINEER', 'SINTER_PLANT_ENGINEER',
  'SMS_ENGINEER', 'POWER_PLANT_ENGINEER', 'ESG_OFFICER', 'ENVIRONMENTAL_OFFICER', 'SAFETY_OFFICER',
  'MAINTENANCE_ENGINEER', 'PRODUCTION_MANAGER', 'QUALITY_ENGINEER', 'UTILITIES_ENGINEER',
];
const as = (role) => ({ role });

describe('role access matrix', () => {
  it('defines every demo role', () => {
    ROLES.forEach((r) => expect(ROLE_ACCESS[r], r).toBeTruthy());
  });

  it('gives every role the dashboard, plant map, alerts and settings', () => {
    ROLES.forEach((r) => ['dashboard', 'plant-map', 'alerts', 'settings'].forEach((page) => expect(canAccessPage(as(r), page), `${r} ${page}`).toBe(true)));
  });

  it('keeps users and roles SUPER_ADMIN-only (matches backend)', () => {
    ROLES.filter((r) => r !== 'SUPER_ADMIN').forEach((r) => {
      expect(canAccessPage(as(r), '/users'), r).toBe(false);
      expect(canAccessPage(as(r), '/roles'), r).toBe(false);
      ['users', 'roles', 'departments', 'emission-types'].forEach((res) => ['create', 'edit', 'delete'].forEach((a) => expect(canDo(as(r), res, a), `${r} ${res} ${a}`).toBe(false)));
    });
    expect(canDo(as('SUPER_ADMIN'), 'users', 'delete')).toBe(true);
  });

  it('lets plant engineers add/edit records in their own department only, never delete', () => {
    ['BLAST_FURNACE_ENGINEER', 'COKE_OVEN_ENGINEER', 'SINTER_PLANT_ENGINEER', 'SMS_ENGINEER', 'POWER_PLANT_ENGINEER', 'UTILITIES_ENGINEER'].forEach((r) => {
      expect(isDepartmentScoped(as(r)), r).toBe(true);
      expect(canDo(as(r), 'emission-records', 'create')).toBe(true);
      expect(canDo(as(r), 'emission-records', 'edit')).toBe(true);
      expect(canDo(as(r), 'emission-records', 'delete')).toBe(false);
      expect(canDo(as(r), 'units', 'create')).toBe(false);
    });
  });

  it('gives officers the right tools', () => {
    expect(canDo(as('ENVIRONMENTAL_OFFICER'), 'emission-records', 'create')).toBe(true);
    expect(canDo(as('ESG_OFFICER'), 'reports', 'delete')).toBe(true);
    expect(canAccessPage(as('SAFETY_OFFICER'), 'emission-records')).toBe(false);
    expect(canDo(as('MAINTENANCE_ENGINEER'), 'units', 'edit')).toBe(true);
    expect(canDo(as('QUALITY_ENGINEER'), 'emission-records', 'edit')).toBe(true);
    expect(canDo(as('QUALITY_ENGINEER'), 'emission-records', 'create')).toBe(false);
  });

  it('lets the right roles resolve alerts (matches backend AccessPolicy)', () => {
    ['SUPER_ADMIN', 'PLANT_ADMIN', 'ENVIRONMENTAL_OFFICER', 'SAFETY_OFFICER', 'BLAST_FURNACE_ENGINEER', 'UTILITIES_ENGINEER']
      .forEach((r) => expect(canDo(as(r), 'alerts', 'resolve'), r).toBe(true));
    ['ESG_OFFICER', 'MAINTENANCE_ENGINEER', 'PRODUCTION_MANAGER', 'QUALITY_ENGINEER']
      .forEach((r) => expect(canDo(as(r), 'alerts', 'resolve'), r).toBe(false));
  });

  it('treats unknown roles as read-only and accepts ROLE_ prefixes', () => {
    expect(canAccessPage(as('VISITOR'), 'dashboard')).toBe(true);
    expect(canAccessPage(as('VISITOR'), 'units')).toBe(false);
    expect(canDo(as('ROLE_SUPER_ADMIN'), 'units', 'delete')).toBe(true);
    expect(canAccessPage(null, 'dashboard')).toBe(false);
  });
});
