import { omitBy } from 'lodash';
import { wrapper, userFields } from './utils';

export const pagination = wrapper(
  ({ limit, page, sort, order, q }) =>
    omitBy(
      {
        include_totals: true,
        search_engine: 'v3',
        per_page: limit,
        page,
        sort: sort && `${sort}:${(order || '').toLowerCase().startsWith('desc') ? -1 : 1}`,
        q,
      },
      v => v === undefined,
    ),
  { withAuth0: true, checkPermission: 'users:list' },
);

export const list = wrapper(
  ({ queryStringParameters }, { Auth0 }) =>
    Auth0.getUsers({ ...pagination(queryStringParameters), fields: userFields.join() }),
  { withAuth0: true, checkPermission: 'users:list' },
);
