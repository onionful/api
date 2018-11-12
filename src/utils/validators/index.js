import { mapValues } from 'lodash';
import { Joi } from 'utils';
import UserAppMetadata from './UserAppMetadata';
import UserFind from './UserFind';

export default mapValues({ UserAppMetadata, UserFind }, schema => data =>
  new Promise((resolve, reject) =>
    Joi.validate(data, schema, (error, value) => {
      if (error) {
        reject(error);
      }
      resolve(value);
    }),
  ),
);
