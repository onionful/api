import errors from 'http-errors';
import { isEmpty } from 'lodash';

export { default as db } from './db';
export { default as wrapper } from './wrapper';
export { errors };

/**
 * Creates a verifier that throws given error if condition is met.
 *
 * @example
 * const verifier = verifier({
 *   error = errors.NotFound,
 *   message = errors.NotFound.message,
 *   condition = item => !item,
 * })
 *
 * @param error
 * @param message
 * @param condition
 * @returns {function(*=): *}
 */
export const verifier = ({ error, message, condition }) => item => {
  if (condition(item)) {
    throw error(message);
  }
  return item;
};

/**
 * Common verifiers - checks initialized using {@link verifier}.
 *
 * @type {{presence: (function(*=): *), conflict: (function(*=): *)}}
 */
export const verify = {
  presence: verifier({
    error: errors.NotFound,
    message: errors.NotFound.message,
    condition: item => isEmpty(item),
  }),
  conflict: verifier({
    error: errors.Conflict,
    message: errors.Conflict.message,
    condition: item => item,
  }),
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
