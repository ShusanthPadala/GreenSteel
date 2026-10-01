import { useEffect, useMemo, useState } from 'react';
import { Alert, Box, TextField } from '@mui/material';
import ResourcePage from '../../components/common/ResourcePage';
import UnitRatePanel from '../../components/emissions/UnitRatePanel';
import StatusChip from '../../components/ui/StatusChip';
import { emissionRecordService } from '../../services/emissionRecordService';
import { unitService } from '../../services/unitService';
import { getErrorMessage } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { isDepartmentScoped } from '../../utils/permissions';
import usePlantData from '../../hooks/usePlantData';
import { classify, inDateRange, recordStatus } from '../../utils/emissionAnalytics';
import { statusMeta } from '../../constants/statusMeta';

const numericFields = [
  { name: 'cox', label: 'COx', min: 0 },
  { name: 'nox', label: 'NOx', min: 0 },
  { name: 'sox', label: 'SOx', min: 0 },
  { name: 'pm', label: 'PM', min: 0 },
  { name: 'flyAsh', label: 'Fly ash', min: 0 },
  { name: 'temperature', label: 'Temperature', min: -50, max: 2000 },
  { name: 'efficiency', label: 'Efficiency', min: 0, max: 100 },
  { name: 'healthScore', label: 'Health score', min: 0, max: 100 },
];

export default function EmissionRecords() {
  const { user } = useAuth();
  const scoped = isDepartmentScoped(user);
  const [units, setUnits] = useState([]);
  const [error, setError] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const { limits, analysis, loading: plantLoading } = usePlantData();
  useEffect(() => { unitService.getAllUnits().then(setUnits).catch((e) => setError(getErrorMessage(e, 'Unable to load units.'))); }, []);
  const myUnits = useMemo(() => (scoped ? units.filter((unit) => unit.departmentName === user?.department) : units), [units, scoped, user?.department]);
  const unitOptions = useMemo(() => myUnits.map((unit) => ({ value: unit.id, label: unit.unitName })), [myUnits]);
  const scopeFilter = useMemo(() => {
    if (!scoped) return null;
    const ids = new Set(myUnits.map((unit) => String(unit.id)));
    return (row) => ids.has(String(row.unitId));
  }, [scoped, myUnits]);
  const rowFilter = useMemo(() => (from || to ? (row) => inDateRange(row, from, to) : null), [from, to]);
  const unitStats = useMemo(() => (analysis?.unitStats || []).filter((u) => !scoped || u.unit.departmentName === user?.department), [analysis, scoped, user?.department]);

  // Pollutant cells are coloured green / amber / red against the limit
  const pollutantCol = (key, label) => ({
    key, label,
    render: (row) => {
      const v = row[key];
      const s = classify(v, limits[key]?.limit);
      return (
        <Box component="span" sx={{ color: s === 'unknown' ? 'inherit' : statusMeta(s).color, fontWeight: s === 'breach' ? 800 : 650 }}>
          {typeof v === 'number' ? v.toFixed(1) : '—'}
        </Box>
      );
    },
    sortValue: (row) => row[key],
  });

  if (error) return <Box><Alert severity="error">{error}</Alert></Box>;
  return <ResourcePage title="Emission Records" subtitle="Monitor pollutant and operating measurements" resource="emission-records" scopeFilter={scopeFilter} service={{ list: emissionRecordService.getAllEmissionRecords, create: emissionRecordService.createEmissionRecord, update: emissionRecordService.updateEmissionRecord, remove: emissionRecordService.deleteEmissionRecord }}
    searchKeys={['unitName', 'status', 'recordedAt']} searchPlaceholder="Search records" filterOptions={unitOptions} filterKey="unitId"
    rowFilter={rowFilter}
    defaultSort={{ key: 'recordedAt', dir: 'desc' }}
    beforeTable={<UnitRatePanel unitStats={unitStats} limits={limits} loading={plantLoading && !analysis} />}
    toolbarExtra={(
      <>
        <TextField type="date" label="From" value={from} onChange={(e) => setFrom(e.target.value)} slotProps={{ inputLabel: { shrink: true } }} sx={{ width: { xs: '100%', sm: 160 }, '& .MuiOutlinedInput-root': { minHeight: 44 } }} />
        <TextField type="date" label="To" value={to} onChange={(e) => setTo(e.target.value)} slotProps={{ inputLabel: { shrink: true } }} sx={{ width: { xs: '100%', sm: 160 }, '& .MuiOutlinedInput-root': { minHeight: 44 } }} />
      </>
    )}
    fields={[
      { name: 'unitId', label: 'Unit', type: 'select', coerce: 'number', required: true, options: unitOptions },
      ...numericFields.map((f) => ({ ...f, type: 'number', required: true })),
      { name: 'status', label: 'Status', required: true },
    ]}
    initialValues={{ status: 'NORMAL' }}
    omitOnEdit={['unitId']} writeRoles={null}
    columns={[
      { key: 'unitName', label: 'Unit' },
      pollutantCol('cox', 'COx'), pollutantCol('nox', 'NOx'), pollutantCol('sox', 'SOx'), pollutantCol('pm', 'PM'),
      { key: 'efficiency', label: 'Efficiency' },
      { key: 'limitStatus', label: 'Limits', render: (row) => <StatusChip status={recordStatus(row, limits).status} size="sm" />, sortValue: (row) => ['normal', 'warning', 'breach'].indexOf(recordStatus(row, limits).status) },
      { key: 'status', label: 'Status' },
      { key: 'recordedAt', label: 'Recorded', render: (row) => row.recordedAt ? new Date(row.recordedAt).toLocaleString() : '—' },
    ]} />;
}
