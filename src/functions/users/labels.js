import { wrapper } from 'utils';

export default wrapper(
  ({ pathParameters: { ids } }, { Auth0 }) =>
    Auth0.getUsers({
      search_engine: 'v3',
      include_totals: true,
      per_page: 10,
      fields: ['user_id', 'name', 'picture'].join(),
      q: decodeURIComponent(ids)
        .split(',')
        .map(id => `user_id:${id}`)
        .join(' OR '),
    }),
  { withAuth0: true, checkPermission: 'users:find' },
);
