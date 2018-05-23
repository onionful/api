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
