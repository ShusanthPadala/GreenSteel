import { GAS_FLOWS, PLANT_NODES, POLLUTANTS, WARNING_RATIO } from '../constants/plantModel';

// ---------- small helpers ----------
const norm = (s) => String(s ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');
const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : null);
const time = (r) => {
    const t = Date.parse(r?.recordedAt);
    return Number.isFinite(t) ? t : 0;
};
const DAY = 86400000;

export const STATUS_RANK = { normal: 0, unknown: 0, maintenance: 1, warning: 2, breach: 3 };
export const worst = (...statuses) => statuses.reduce((a, b) => (STATUS_RANK[b] > STATUS_RANK[a] ? b : a), 'normal');

// ---------- limits ----------
/** Map an emission-type name ("CO2", "Sulphur Dioxide"…) to a pollutant key. */
export const pollutantKeyFor = (name) => {
    const n = norm(name);
    if (!n) return null;
    const hit = POLLUTANTS.find((p) => p.aliases.includes(n) || p.key === n);
    if (hit) return hit.key;
    return POLLUTANTS.find((p) => p.aliases.some((a) => a.length > 2 && n.includes(a)))?.key ?? null;
};

/**
 * Limits per pollutant: defaults, overridden by Emission Types that carry a
 * positive `limitValue` (and their `unit`) from the backend.
 */
export const buildLimits = (emissionTypes = []) => {
    const limits = Object.fromEntries(POLLUTANTS.map((p) => [p.key, { ...p, source: 'default' }]));
    (emissionTypes || []).forEach((t) => {
        const key = pollutantKeyFor(t?.emissionType);
        const limit = num(t?.limitValue);
        if (key && limit && limit > 0) {
            limits[key] = { ...limits[key], limit, unit: t.unit || limits[key].unit, source: 'database' };
        }
    });
    return limits;
};

/** "normal" | "warning" (≥80% of limit) | "breach" (≥ limit) | "unknown" */
export const classify = (value, limit) => {
    const v = num(value);
    if (v === null || !limit) return 'unknown';
    if (v >= limit) return 'breach';
    if (v >= limit * WARNING_RATIO) return 'warning';
    return 'normal';
};

/** Worst status across all pollutants in one record + per-pollutant detail. */
export const recordStatus = (record, limits) => {
    const detail = {};
    let status = 'normal';
    POLLUTANTS.forEach(({ key }) => {
        const s = classify(record?.[key], limits[key]?.limit);
        detail[key] = s;
        status = worst(status, s);
    });
    return { status, detail };
};

// ---------- grouping ----------
export const recordsByUnit = (records = []) => {
    const map = new Map();
    (records || []).forEach((r) => {
        const id = String(r.unitId);
        if (!map.has(id)) map.set(id, []);
        map.get(id).push(r);
    });
    map.forEach((list) => list.sort((a, b) => time(a) - time(b)));
    return map;
};

const avg = (list) => (list.length ? list.reduce((a, b) => a + b, 0) / list.length : null);

/**
 * Emission rate for one unit + pollutant from its time-ordered records:
 *  - latest / previous reading
 *  - change since previous (absolute and %)
 *  - rate of change per day (units/day) between the two readings
 *  - 7-day average vs the 7 days before it (% change)
 */
export const pollutantTrend = (sortedRecords, key) => {
    const withValue = sortedRecords.filter((r) => num(r[key]) !== null);
    const latest = withValue[withValue.length - 1];
    const previous = withValue[withValue.length - 2];
    const out = { latest: latest ? latest[key] : null, previous: previous ? previous[key] : null, change: null, changePct: null, perDay: null, avg7: null, avgPrev7: null, change7Pct: null };
    if (latest && previous) {
        out.change = latest[key] - previous[key];
        out.changePct = previous[key] ? (out.change / previous[key]) * 100 : null;
        const days = (time(latest) - time(previous)) / DAY;
        out.perDay = days > 0 ? out.change / days : null;
    }
    if (latest) {
        const end = time(latest);
        const last7 = withValue.filter((r) => time(r) > end - 7 * DAY).map((r) => r[key]);
        const prev7 = withValue.filter((r) => time(r) <= end - 7 * DAY && time(r) > end - 14 * DAY).map((r) => r[key]);
        out.avg7 = avg(last7);
        out.avgPrev7 = avg(prev7);
        if (out.avg7 !== null && out.avgPrev7) out.change7Pct = ((out.avg7 - out.avgPrev7) / out.avgPrev7) * 100;
    }
    return out;
};

// ---------- departments ----------
export const nodeForDepartment = (departmentName) => {
    const n = norm(departmentName);
    return PLANT_NODES.find((node) => node.aliases.some((a) => norm(a) === n)) || null;
};

export const upstreamOf = (nodeId) => GAS_FLOWS.filter((f) => f.to === nodeId);
export const downstreamOf = (nodeId) => GAS_FLOWS.filter((f) => f.from === nodeId);

/**
 * Full plant picture used by the map, dashboards and ESG breakdown.
 * Returns per-unit and per-department status, breaches and contributions.
 */
export const analysePlant = ({ units = [], records = [], alerts = [], limits }) => {
    const byUnit = recordsByUnit(records);
    const activeAlerts = (alerts || []).filter((a) => !a.resolved);

    const unitStats = (units || []).map((unit) => {
        const list = byUnit.get(String(unit.id)) || [];
        const latest = list[list.length - 1] || null;
        const latestStatus = latest ? recordStatus(latest, limits) : { status: 'unknown', detail: {} };
        const breaches = list.reduce((n, r) => n + POLLUTANTS.filter(({ key }) => classify(r[key], limits[key]?.limit) === 'breach').length, 0);
        const unitAlerts = activeAlerts.filter((a) => String(a.unitId) === String(unit.id) || (a.unitName && a.unitName === unit.unitName));
        const critical = unitAlerts.some((a) => /critical|high/i.test(String(a.severity)));
        let status = latestStatus.status === 'unknown' ? 'normal' : latestStatus.status;
        if (unit.status === 'WARNING') status = worst(status, 'warning');
        if (unit.status === 'MAINTENANCE') status = worst(status, 'maintenance');
        if (unitAlerts.length) status = worst(status, critical ? 'breach' : 'warning');
        const trends = Object.fromEntries(POLLUTANTS.map(({ key }) => [key, pollutantTrend(list, key)]));
        return {
            unit, latest, records: list, status, detail: latestStatus.detail, breaches, alerts: unitAlerts, trends,
            healthScore: num(latest?.healthScore), efficiency: num(latest?.efficiency),
        };
    });

    const departments = {};
    unitStats.forEach((u) => {
        const name = u.unit.departmentName || 'Unassigned';
        if (!departments[name]) departments[name] = { name, node: nodeForDepartment(name), units: [], status: 'normal', breaches: 0, alerts: 0 };
        const d = departments[name];
        d.units.push(u);
        d.status = worst(d.status, u.status);
        d.breaches += u.breaches;
        d.alerts += u.alerts.length;
    });
    Object.values(departments).forEach((d) => {
        d.healthScore = avg(d.units.map((u) => u.healthScore).filter((v) => v !== null));
        d.efficiency = avg(d.units.map((u) => u.efficiency).filter((v) => v !== null));
        d.averages = Object.fromEntries(POLLUTANTS.map(({ key }) => [key, avg(d.units.map((u) => num(u.latest?.[key])).filter((v) => v !== null))]));
    });

    // Plant-node view (map): status + "at risk because an upstream department is in trouble"
    const nodes = PLANT_NODES.map((node) => {
        const dept = Object.values(departments).find((d) => d.node?.id === node.id) || null;
        return { ...node, dept, status: dept ? dept.status : 'unknown' };
    });
    const nodeStatus = Object.fromEntries(nodes.map((n) => [n.id, n.status]));
    nodes.forEach((n) => {
        n.upstreamRisk = upstreamOf(n.id).filter((f) => ['warning', 'breach'].includes(nodeStatus[f.from])).map((f) => ({ ...f, status: nodeStatus[f.from] }));
    });

    const totalBreaches = unitStats.reduce((n, u) => n + u.breaches, 0);
    const breachesByPollutant = Object.fromEntries(POLLUTANTS.map(({ key }) => [key, (records || []).filter((r) => classify(r[key], limits[key]?.limit) === 'breach').length]));

    // "What to fix first": breaches, then active alerts, then lowest health
    const priorities = [...unitStats]
        .filter((u) => u.breaches > 0 || u.alerts.length > 0 || u.status === 'warning' || u.status === 'breach' || (u.healthScore !== null && u.healthScore < 70))
        .sort((a, b) => (b.breaches - a.breaches) || (b.alerts.length - a.alerts.length) || ((a.healthScore ?? 100) - (b.healthScore ?? 100)))
        .slice(0, 6);

    return { unitStats, departments, nodes, totalBreaches, breachesByPollutant, priorities };
};

/** Records inside [from, to] (ISO date strings, inclusive, either optional). */
export const inDateRange = (record, from, to) => {
    const t = time(record);
    if (!t) return !from && !to;
    if (from && t < Date.parse(`${from}T00:00:00`)) return false;
    if (to && t > Date.parse(`${to}T23:59:59`)) return false;
    return true;
};
