import ResourcePage from '../../components/common/ResourcePage';
import { emissionTypeService } from '../../services/emissionTypeService';
import { POLLUTANTS } from '../../constants/plantModel';
import { pollutantKeyFor } from '../../utils/emissionAnalytics';

// Limit shown for a type: its own `limitValue` from the database, else the plant default
const limitLabel = (row) => {
  if (typeof row.limitValue === 'number' && row.limitValue > 0) return `${row.limitValue} ${row.unit || ''}`.trim();
  const p = POLLUTANTS.find((x) => x.key === pollutantKeyFor(row.emissionType));
  return p ? `${p.limit} ${p.unit} (default)` : '—';
};

export default function EmissionTypes() {
  return <ResourcePage title="Emission Types" subtitle="Define monitored pollutants" resource="emission-types" service={{ list: emissionTypeService.getAllEmissionTypes, create: emissionTypeService.createEmissionType, update: emissionTypeService.updateEmissionType, remove: emissionTypeService.deleteEmissionType }}
    searchKeys={['emissionType', 'unit', 'description']} searchPlaceholder="Search emission types"
    fields={[{ name: 'emissionType', label: 'Emission type', required: true }, { name: 'unit', label: 'Unit', required: true }, { name: 'limitValue', label: 'Emission limit (max allowed)', type: 'number', min: 0 }, { name: 'description', label: 'Description', multiline: true }, { name: 'active', label: 'Active', type: 'select', coerce: 'boolean', options: [{ value: true, label: 'Active' }, { value: false, label: 'Inactive' }] }]}
    initialValues={{ active: true }} omitOnCreate={['active']}
    columns={[{ key: 'emissionType', label: 'Emission type' }, { key: 'unit', label: 'Unit' }, { key: 'limitValue', label: 'Limit', render: limitLabel, sortValue: (row) => row.limitValue ?? null }, { key: 'description', label: 'Description' }, { key: 'active', label: 'Status', render: (row) => row.active ? 'Active' : 'Inactive' }]} />;
}
