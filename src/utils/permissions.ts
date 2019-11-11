// TODO introduce typed permissions/roles
const can = ({ permissions, roles }: { permissions: string[]; roles: string[] }, action: string) =>
  ~roles.indexOf('admin') || ~permissions.indexOf(action);

export default { can };
