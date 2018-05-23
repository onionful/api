import { kebabCase, mapValues } from 'lodash';
import { Content } from './models';
import { errors, wrapper, verify } from './utils';

const create = ({ headers: { Space: space }, body: { title, ...rest } }) =>
  Content.create({ ...rest, title, slug: kebabCase(title), space });

const update = ({ headers: { Space: space }, body, pathParameters: { slug } }) =>
  Content.update({ space, slug }, body, { condition: 'attribute_exists(slug)' }).catch(
    ({ message }) => {
      throw new errors.NotFound(message);
    },
  );

const get = ({ headers: { Space: space }, pathParameters: { slug } }) =>
  Content.get({ space, slug }).then(verify.presence);

const list = () => Content.scan().exec();

module.exports = mapValues({ create, update, get, list }, wrapper);
