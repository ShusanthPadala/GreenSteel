import ResourcePage from '../../components/common/ResourcePage';
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from '../../services/departmentService';

const service = { list: getDepartments, create: createDepartment, update: updateDepartment, remove: deleteDepartment };

export default function Departments() {
  return <ResourcePage title="Departments" subtitle="Manage plant departments" service={service} resource="departments"
    searchKeys={['departmentName', 'departmentCode', 'description']} searchPlaceholder="Search departments"
    fields={[
      { name: 'departmentName', label: 'Department name', required: true },
      { name: 'departmentCode', label: 'Department code', required: true },
      { name: 'description', label: 'Description', multiline: true },
      { name: 'active', label: 'Active', type: 'select', coerce: 'boolean', options: [{ value: true, label: 'Active' }, { value: false, label: 'Inactive' }] },
    ]}
    initialValues={{ active: true }}
    columns={[
      { key: 'departmentName', label: 'Department' }, { key: 'departmentCode', label: 'Code' },
      { key: 'description', label: 'Description' }, { key: 'active', label: 'Status', render: (row) => row.active ? 'Active' : 'Inactive' },
    ]} />;
}
