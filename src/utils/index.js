import errors from 'http-errors';

export { default as db } from './db';
export { default as wrapper } from './wrapper';
export { errors };

export const verify = {
  presence: data => {
    if (!data) {
      throw new errors.NotFound();
    }
    return data;
  },
};

export const userFields = [
  'email',
  'name',
  'nickname',
  'picture',
  'created_at',
  'last_login',
  'logins_count',
  'identities',
  'user_metadata',
  'user_id',
];
