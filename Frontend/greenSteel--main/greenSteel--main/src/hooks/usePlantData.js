import { useCallback, useEffect, useMemo, useState } from 'react';
import { unitService } from '../services/unitService';
import { emissionRecordService } from '../services/emissionRecordService';
import { emissionTypeService } from '../services/emissionTypeService';
import { alertService } from '../services/alertService';
import { getDepartments } from '../services/departmentService';
import { getErrorMessage } from '../services/api';
import { analysePlant, buildLimits } from '../utils/emissionAnalytics';

// Short shared cache so several widgets on one page don't refetch the same data
let cache = null;
let cacheTime = 0;
let inflight = null;
const TTL = 20000;

const fetchAll = async () => {
    const settle = (p) => p.then((v) => v || []).catch(() => []);
    const [units, records, emissionTypes, alerts, departments] = await Promise.all([
        unitService.getAllUnits(),
        emissionRecordService.getAllEmissionRecords(),
        settle(emissionTypeService.getAllEmissionTypes()),
        settle(alertService.getActiveAlerts()),
        settle(getDepartments()),
    ]);
    return { units: units || [], records: records || [], emissionTypes, alerts, departments };
};

export const invalidatePlantData = () => { cache = null; cacheTime = 0; };

/** Units, emission records, limits, alerts + full plant analysis in one hook. */
export default function usePlantData() {
    const [state, setState] = useState(() => ({ loading: !cache, error: '', data: cache }));

    const load = useCallback(async (force = false) => {
        if (!force && cache && Date.now() - cacheTime < TTL) {
            setState({ loading: false, error: '', data: cache });
            return;
        }
        setState((s) => ({ ...s, loading: true, error: '' }));
        try {
            inflight = inflight || fetchAll();
            const data = await inflight;
            cache = data;
            cacheTime = Date.now();
            setState({ loading: false, error: '', data });
        } catch (e) {
            setState((s) => ({ ...s, loading: false, error: getErrorMessage(e, 'Unable to load plant data.') }));
        } finally {
            inflight = null;
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => { load(); }, 0);
        return () => clearTimeout(timer);
    }, [load]);

    const limits = useMemo(() => buildLimits(state.data?.emissionTypes), [state.data]);
    const analysis = useMemo(() => (state.data ? analysePlant({ ...state.data, limits }) : null), [state.data, limits]);

    return {
        loading: state.loading,
        error: state.error,
        ...(state.data || { units: [], records: [], emissionTypes: [], alerts: [], departments: [] }),
        limits,
        analysis,
        reload: () => load(true),
    };
}
