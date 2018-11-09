import { kebabCase } from 'lodash';
import { Collection } from 'models';
import { verify, wrapper } from 'utils';
import { parse } from './.helpers';

export default wrapper(({ headers: { Space: space }, body }) => {
  const id = kebabCase(body.id || body.name);

  return Collection.get({ space, id })
    .then(verify.conflict)
    .then(() => Collection.create({ ...body, id, space }).then(parse));
});
