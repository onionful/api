import { kebabCase, mapValues } from 'lodash';
import { ContentType } from './models';
import { errors, wrapper, verify } from './utils';

const create = ({ headers: { Space: space }, body: { title, ...rest } }) =>
  ContentType.create({ ...rest, title, slug: kebabCase(title), space });

const update = ({ headers: { Space: space }, body, pathParameters: { slug } }) =>
  ContentType.update({ space, slug }, body, { condition: 'attribute_exists(slug)' }).catch(
    ({ message }) => {
      throw new errors.NotFound(message);
    },
  );

const get = ({ headers: { Space: space }, pathParameters: { id } }) =>
  ContentType.get({ space, id }).then(verify.presence);

const list = () =>
  ContentType.scan()
    .exec()
    .then(() => [
      {
        id: 'page',
        name: 'Page',
        description: 'Regular page type',
        fields: [],
      },
    ]);

module.exports = mapValues({ create, update, get, list }, wrapper);
