import { useEffect, useMemo, useState } from 'react';
import { Alert, Box } from '@mui/material';
import ResourcePage from '../../components/common/ResourcePage';
import { unitService } from '../../services/unitService';
import { getDepartments } from '../../services/departmentService';
import { getErrorMessage } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { isDepartmentScoped } from '../../utils/permissions';

export default function Units() {
  const { user } = useAuth();
  const scoped = isDepartmentScoped(user);
  const scopeFilter = useMemo(() => (scoped ? (row) => row.departmentName === user?.department : null), [scoped, user?.department]);
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => { getDepartments().then(setDepartments).catch((e) => setError(getErrorMessage(e, 'Unable to load departments.'))); }, []);
  const options = useMemo(() => departments
    .filter((department) => !scoped || department.departmentName === user?.department)
    .map((department) => ({ value: department.id, label: department.departmentName })), [departments, scoped, user?.department]);
  if (error) return <Box><Alert severity="error">{error}</Alert></Box>;
  return <ResourcePage title="Units" subtitle="Manage operational units" resource="units" scopeFilter={scopeFilter} service={{ list: unitService.getAllUnits, create: unitService.createUnit, update: unitService.updateUnit, remove: unitService.deleteUnit }}
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
