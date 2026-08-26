import ResourcePage from '../../components/common/ResourcePage';
import { emissionTypeService } from '../../services/emissionTypeService';

export default function EmissionTypes() {
  return <ResourcePage title="Emission Types" subtitle="Define monitored pollutants" service={{ list: emissionTypeService.getAllEmissionTypes, create: emissionTypeService.createEmissionType, update: emissionTypeService.updateEmissionType, remove: emissionTypeService.deleteEmissionType }}
    searchKeys={['emissionType', 'unit', 'description']} searchPlaceholder="Search emission types"
    fields={[{ name: 'emissionType', label: 'Emission type', required: true }, { name: 'unit', label: 'Unit', required: true }, { name: 'description', label: 'Description', multiline: true }, { name: 'active', label: 'Active', type: 'select', coerce: 'boolean', options: [{ value: true, label: 'Active' }, { value: false, label: 'Inactive' }] }]}
    initialValues={{ active: true }} omitOnCreate={['active']}
    columns={[{ key: 'emissionType', label: 'Emission type' }, { key: 'unit', label: 'Unit' }, { key: 'description', label: 'Description' }, { key: 'active', label: 'Status', render: (row) => row.active ? 'Active' : 'Inactive' }]} />;
}
