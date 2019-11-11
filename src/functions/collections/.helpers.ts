import { sortBy } from 'lodash';
import { Collection } from 'types';

export const parse = ({ fields, ...content }: Collection): Collection => ({
  fields: sortBy(fields || [], 'order'),
  ...content,
});
