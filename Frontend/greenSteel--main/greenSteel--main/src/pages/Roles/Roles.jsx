import ResourcePage from '../../components/common/ResourcePage';
import { roleService } from '../../services/roleService';

export default function Roles() {
  return <ResourcePage title="Roles" subtitle="Manage application roles" resource="roles" service={{ list: roleService.getAllRoles, create: roleService.addRole, update: roleService.updateRole, remove: roleService.deleteRole }}
    searchKeys={['roleName', 'description']} searchPlaceholder="Search roles"
    fields={[{ name: 'roleName', label: 'Role name', required: true }, { name: 'description', label: 'Description', multiline: true }]}
    columns={[{ key: 'roleName', label: 'Role' }, { key: 'description', label: 'Description' }]} />;
}
