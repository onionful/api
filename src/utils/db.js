import dynamoose from 'dynamoose';
import errors from 'http-errors';
import { isFunction, isPlainObject, kebabCase, mapValues, set, toPairs } from 'lodash';
import { verify } from 'utils';
import Joi from './joi';

const { ENVIRONMENT } = process.env;

dynamoose.setDefaults({
  prefix: `${ENVIRONMENT}_Onionful_`,
});

const model = (table, schema, options = {}) => {
  const handleValidators = (subschema, path = []) =>
    mapValues(subschema, (entry, key) => {
      const nextPath = path.concat(key);
      if (!isPlainObject(entry)) {
        return entry;
      }

      if (!('validator' in entry)) {
        return handleValidators(entry, nextPath);
      }

      const { validator, ...rest } = entry;

      return {
        ...rest,
        validate: value => {
          const { error } = Joi.validate(set({}, nextPath, value), set({}, nextPath, validator));
          if (error && error.details) {
            throw new errors.BadRequest(error.details);
          }
          return true;
        },
      };
    });

  const Schema = new dynamoose.Schema(handleValidators(schema));

  Schema.statics.updateWithId = function(index, pair, parseData, normalizer = kebabCase) {
    return this.get(index)
      .then(verify.presence)
      .then(previous => {
        const body = isFunction(parseData) ? parseData(previous) : parseData;
        const [[key, id]] = toPairs(pair);
        const newId = normalizer(body[key]);

        if (!newId || id === newId) {
          // regular update, no id changed
          return this.update(index, body, { condition: 'attribute_exists(id)' });
        }

        return this.get({ ...index, id: newId })
          .then(verify.conflict)
          .then(() => this.create({ ...previous, ...body, ...index, id: newId }))
          .then(collection => this.delete(index).then(() => collection));
      });
  };

  return dynamoose.model(table, Schema, { throughput: 'ON_DEMAND', ...options });
};

export default {
  model,
  dynamoose,
};
