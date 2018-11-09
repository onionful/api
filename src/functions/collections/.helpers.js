import { sortBy } from 'lodash';

export const parse = ({ fields, ...content }) => ({
  fields: sortBy(fields || [], 'order').map(({ order, ...field }) => field),
  ...content,
});
