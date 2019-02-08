export const parse = ({ key, data, ...content }) => {
  const [space, collection] = key.split(':');
  return {
    ...data,
    ...content,
    space,
    collection,
  };
};
