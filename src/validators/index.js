import Joi from 'joi';
import { mapValues } from 'lodash';
import UserAppMetadata from './UserAppMetadata';

export default mapValues({ UserAppMetadata }, schema => data =>
  new Promise((resolve, reject) =>
    Joi.validate(data, schema, (error, value) => {
      if (error) {
        reject(error);
      }
      resolve(value);
    }),
  ),
);
