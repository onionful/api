import dynamoose from 'dynamoose';
import errors from 'http-errors';
import { isPlainObject, mapValues, set } from 'lodash';
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

  return dynamoose.model(table, handleValidators(schema), {
    useDocumentTypes: true,
    ...options,
  });
};

export default {
  model,
  dynamoose,
};
