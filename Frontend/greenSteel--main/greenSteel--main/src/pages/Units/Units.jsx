import { useEffect, useMemo, useState } from 'react';
import { Alert, Box } from '@mui/material';
import ResourcePage from '../../components/common/ResourcePage';
import { unitService } from '../../services/unitService';
import { getDepartments } from '../../services/departmentService';
import { getErrorMessage } from '../../services/api';

export default function Units() {
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => { getDepartments().then(setDepartments).catch((e) => setError(getErrorMessage(e, 'Unable to load departments.'))); }, []);
  const options = useMemo(() => departments.map((department) => ({ value: department.id, label: department.departmentName })), [departments]);
  if (error) return <Box><Alert severity="error">{error}</Alert></Box>;
  return <ResourcePage title="Units" subtitle="Manage operational units" service={{ list: unitService.getAllUnits, create: unitService.createUnit, update: unitService.updateUnit, remove: unitService.deleteUnit }}
    searchKeys={['unitName', 'unitCode', 'departmentName', 'status']} searchPlaceholder="Search units"
    fields={[
      { name: 'unitName', label: 'Unit name', required: true }, { name: 'unitCode', label: 'Unit code', required: true },
      { name: 'departmentId', label: 'Department', type: 'select', coerce: 'number', required: true, options },
      { name: 'status', label: 'Status', type: 'select', required: true, options: [{ value: 'OPERATIONAL', label: 'Operational' }, { value: 'MAINTENANCE', label: 'Maintenance' }, { value: 'WARNING', label: 'Warning' }] },
      { name: 'active', label: 'Active', type: 'select', coerce: 'boolean', options: [{ value: true, label: 'Active' }, { value: false, label: 'Inactive' }] },
    ]}
    initialValues={{ status: 'OPERATIONAL', active: true }}
    omitOnCreate={['status', 'active']} writeRoles={null}
    columns={[{ key: 'unitName', label: 'Unit' }, { key: 'unitCode', label: 'Code' }, { key: 'departmentName', label: 'Department' }, { key: 'status', label: 'Status' }, { key: 'active', label: 'Active', render: (row) => row.active ? 'Yes' : 'No' }]} />;
}
