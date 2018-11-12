const can = ({ permissions, roles }, action) =>
  ~roles.indexOf('admin') || ~permissions.indexOf(action);

export default { can };
