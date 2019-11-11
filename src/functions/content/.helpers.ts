import { Content } from 'types';

export const parse = ({ key, data, ...content }: Content): Content => {
  const [space, collection] = key.split(':');
  return {
    ...data,
    ...content,
    space,
    collection,
  };
};
