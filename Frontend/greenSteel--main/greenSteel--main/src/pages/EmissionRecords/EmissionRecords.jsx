import { useEffect, useMemo, useState } from 'react';
import { Alert, Box } from '@mui/material';
import ResourcePage from '../../components/common/ResourcePage';
import { emissionRecordService } from '../../services/emissionRecordService';
import { unitService } from '../../services/unitService';
import { getErrorMessage } from '../../services/api';

const numericFields = ['cox', 'nox', 'sox', 'pm', 'flyAsh', 'temperature', 'efficiency', 'healthScore'];

export default function EmissionRecords() {
  const [units, setUnits] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => { unitService.getAllUnits().then(setUnits).catch((e) => setError(getErrorMessage(e, 'Unable to load units.'))); }, []);
  const unitOptions = useMemo(() => units.map((unit) => ({ value: unit.id, label: unit.unitName })), [units]);
  if (error) return <Box><Alert severity="error">{error}</Alert></Box>;
  return <ResourcePage title="Emission Records" subtitle="Monitor pollutant and operating measurements" service={{ list: emissionRecordService.getAllEmissionRecords, create: emissionRecordService.createEmissionRecord, update: emissionRecordService.updateEmissionRecord, remove: emissionRecordService.deleteEmissionRecord }}
    searchKeys={['unitName', 'status', 'recordedAt']} searchPlaceholder="Search records" filterOptions={unitOptions} filterKey="unitId"
    fields={[
      { name: 'unitId', label: 'Unit', type: 'select', coerce: 'number', required: true, options: unitOptions },
      ...numericFields.map((name) => ({ name, label: name === 'flyAsh' ? 'Fly ash' : name.toUpperCase(), type: 'number', required: true })),
      { name: 'status', label: 'Status', required: true },
    ]}
    initialValues={{ status: 'NORMAL' }}
    omitOnEdit={['unitId']} writeRoles={null}
    columns={[
      { key: 'unitName', label: 'Unit' }, { key: 'cox', label: 'COx' }, { key: 'nox', label: 'NOx' }, { key: 'sox', label: 'SOx' },
      { key: 'pm', label: 'PM' }, { key: 'efficiency', label: 'Efficiency' }, { key: 'status', label: 'Status' },
      { key: 'recordedAt', label: 'Recorded', render: (row) => row.recordedAt ? new Date(row.recordedAt).toLocaleString() : '—' },
    ]} />;
}
