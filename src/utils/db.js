import dynamoose from 'dynamoose';
import errors from 'http-errors';
import Joi from 'joi';
import { mapValues, isPlainObject, set } from 'lodash';

dynamoose.setDefaults({
  prefix: `${process.env.ENVIRONMENT}_Onionful_`,
});

const model = (table, schema, options = {}) => {
  const handleValidators = (subschema, path = []) => mapValues(subschema, (entry, key) => {
    const _path = path.concat(key);
    if (!isPlainObject(entry)) {
      return entry;
    }

    if (!('validator' in entry)) {
      return handleValidators(entry, _path);
    }

    return {
      ...entry,
      validate: (value) => {
        const { error } = Joi.validate(set({}, _path, value), set({}, _path, entry.validator));
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
  Joi,
}
