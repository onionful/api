import { omitBy } from 'lodash';

export { default as errors } from 'http-errors';
export { default as wrapper } from './wrapper';

export const pagination = ({ limit, page, sort, order, q }) => omitBy({
  include_totals: true,
  search_engine: 'v3',
  per_page: limit,
  page,
  sort: sort && `${sort}:${(order || '').toLowerCase().startsWith('desc') ? -1 : 1}`,
  q,
}, v => v === undefined);