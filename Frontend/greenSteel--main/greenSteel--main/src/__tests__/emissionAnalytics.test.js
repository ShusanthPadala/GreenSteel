import { describe, expect, it } from 'vitest';
import { analysePlant, buildLimits, classify, pollutantKeyFor, pollutantTrend, inDateRange, nodeForDepartment } from '../utils/emissionAnalytics';

describe('limits', () => {
  it('maps emission type names to pollutants', () => {
    expect(pollutantKeyFor('COx')).toBe('cox');
    expect(pollutantKeyFor('Sulphur Dioxide')).toBe('sox');
    expect(pollutantKeyFor('PM10')).toBe('pm');
    expect(pollutantKeyFor('Mercury')).toBe(null);
  });

  it('uses database limits when present, defaults otherwise', () => {
    const l = buildLimits([{ emissionType: 'PM', unit: 'mg/Nm3', limitValue: 30 }, { emissionType: 'NOx', limitValue: null }]);
    expect(l.pm.limit).toBe(30);
    expect(l.pm.source).toBe('database');
    expect(l.nox.limit).toBe(300);
    expect(l.nox.source).toBe('default');
  });

  it('classifies readings against a limit', () => {
    expect(classify(30, 50)).toBe('normal');
    expect(classify(40, 50)).toBe('warning');
    expect(classify(50, 50)).toBe('breach');
    expect(classify(null, 50)).toBe('unknown');
  });
});

describe('emission rate', () => {
  const recs = [
    { recordedAt: '2026-09-01T00:00:00', pm: 40 },
    { recordedAt: '2026-09-11T00:00:00', pm: 44 },
    { recordedAt: '2026-09-13T00:00:00', pm: 48 },
  ];
  it('computes change since previous reading and per-day rate', () => {
    const t = pollutantTrend(recs, 'pm');
    expect(t.latest).toBe(48);
    expect(t.change).toBe(4);
    expect(t.changePct).toBeCloseTo(9.09, 1);
    expect(t.perDay).toBeCloseTo(2, 5);
  });
  it('filters by date range', () => {
    expect(recs.filter((r) => inDateRange(r, '2026-09-10', '2026-09-12'))).toHaveLength(1);
  });
});

describe('plant analysis', () => {
  const units = [
    { id: 1, unitName: 'Coke Battery 1', departmentName: 'Coke Oven', status: 'OPERATIONAL' },
    { id: 2, unitName: 'BF 1', departmentName: 'Blast Furnace', status: 'OPERATIONAL' },
    { id: 3, unitName: 'Turbine', departmentName: 'Power Plant', status: 'OPERATIONAL' },
  ];
  const records = [
    { unitId: 1, recordedAt: '2026-09-01T00:00:00', cox: 520, nox: 100, sox: 100, pm: 20, healthScore: 70, efficiency: 80 },
    { unitId: 2, recordedAt: '2026-09-01T00:00:00', cox: 300, nox: 100, sox: 100, pm: 20, healthScore: 90, efficiency: 90 },
    { unitId: 3, recordedAt: '2026-09-01T00:00:00', cox: 300, nox: 100, sox: 100, pm: 20, healthScore: 95, efficiency: 95 },
  ];
  const a = analysePlant({ units, records, alerts: [], limits: buildLimits([]) });

  it('flags the department over its limit', () => {
    expect(a.departments['Coke Oven'].status).toBe('breach');
    expect(a.departments['Blast Furnace'].status).toBe('normal');
    expect(a.totalBreaches).toBe(1);
  });

  it('propagates risk to departments fed by a breaching department', () => {
    const bf = a.nodes.find((n) => n.id === 'bf');
    const power = a.nodes.find((n) => n.id === 'power');
    expect(bf.upstreamRisk.map((r) => r.from)).toContain('coke');
    expect(power.upstreamRisk.map((r) => r.from)).toContain('coke');
  });

  it('puts the breaching unit first in the fix-first list', () => {
    expect(a.priorities[0].unit.unitName).toBe('Coke Battery 1');
  });

  it('matches department name variants', () => {
    expect(nodeForDepartment('Steel Melting Shop').id).toBe('sms');
    expect(nodeForDepartment('steel melt shop').id).toBe('sms');
    expect(nodeForDepartment('Administration')).toBe(null);
  });
});
