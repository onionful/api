import { mapValues } from 'lodash';
import { Joi } from 'utils';
import UserAppMetadata from './UserAppMetadata';
import UserFind from './UserFind';

// TODO handle types properly
export default mapValues({ UserAppMetadata, UserFind }, schema => (data: any) =>
  new Promise((resolve, reject) =>
    // @ts-ignore
    Joi.validate(data, schema, (error, value) => {
      if (error) {
        reject(error);
      }
      resolve(value);
    }),
  ),
);
