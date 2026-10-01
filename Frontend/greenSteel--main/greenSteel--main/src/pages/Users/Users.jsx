import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Box } from '@mui/material';
import ResourcePage from '../../components/common/ResourcePage';
import { userService } from '../../services/userService';
import { getDepartments } from '../../services/departmentService';
import { roleService } from '../../services/roleService';
import { getErrorMessage } from '../../services/api';

export default function Users() {
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    Promise.all([getDepartments(), roleService.getAllRoles()])
      .then(([departmentData, roleData]) => { setDepartments(departmentData); setRoles(roleData); })
      .catch((loadError) => setError(getErrorMessage(loadError, 'Unable to load user form options.')));
  }, []);
  const departmentOptions = useMemo(() => departments.map((item) => ({ value: item.id, label: item.departmentName })), [departments]);
  const roleOptions = useMemo(() => roles.map((item) => ({ value: item.id, label: item.roleName })), [roles]);
  // The API returns departmentName/roleName; the edit form needs departmentId/roleId.
  const normalize = useCallback((value) => (value || []).map((row) => ({
    ...row,
    departmentId: row.departmentId ?? departments.find((d) => d.departmentName === row.departmentName)?.id ?? '',
    roleId: row.roleId ?? roles.find((r) => r.roleName === row.roleName)?.id ?? '',
  })), [departments, roles]);
  if (error) return <Box><Alert severity="error">{error}</Alert></Box>;
  return <ResourcePage title="Users" subtitle="Manage platform users" resource="users" normalize={normalize} service={{ list: userService.getAllUsers, create: userService.createUser, update: userService.updateUser, remove: userService.deleteUser }}
    searchKeys={['employeeCode', 'firstName', 'lastName', 'email', 'departmentName', 'roleName', 'status']} searchPlaceholder="Search users"
    fields={[
      { name: 'employeeCode', label: 'Employee code', required: true }, { name: 'firstName', label: 'First name', required: true },
      { name: 'lastName', label: 'Last name', required: true }, { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'phone', label: 'Phone', required: true },       { name: 'password', label: 'Password', type: 'password', required: true },
      { name: 'departmentId', label: 'Department', type: 'select', coerce: 'number', required: true, options: departmentOptions },
      { name: 'roleId', label: 'Role', type: 'select', coerce: 'number', required: true, options: roleOptions },
      { name: 'status', label: 'Status', type: 'select', options: [{ value: 'ACTIVE', label: 'Active' }, { value: 'INACTIVE', label: 'Inactive' }, { value: 'LOCKED', label: 'Locked' }] },
    ]}
    initialValues={{ status: 'ACTIVE' }}
    omitOnEdit={['password', 'employeeCode']} omitOnCreate={['status']}
    columns={[
      { key: 'employeeCode', label: 'Employee code' }, { key: 'firstName', label: 'Name', render: (row) => `${row.firstName} ${row.lastName}` },
      { key: 'email', label: 'Email' }, { key: 'departmentName', label: 'Department' }, { key: 'roleName', label: 'Role' }, { key: 'status', label: 'Status' },
    ]} />;
}
