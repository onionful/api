import errors from 'http-errors';
import { get, isEmpty, template } from 'lodash';
import messages from './messages';

export { default as uuid } from 'uuid/v4';
export { default as db } from './db';
export { default as Joi } from './joi';
export { default as permissions } from './permissions';
export { default as validators } from './validators';
export { default as wrapper } from './wrapper';
export { errors };

/**
 * Loads message from {@link messages} by given path and converts it using {@link template}.
 *
 * @param path string key
 * @param params additional parameters
 * @returns {string} converted message
 */
export const _ = (path, params = {}) => template(get(messages, path))(params);

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
 * @param error to throw
 * @param message additional error message
 * @param condition to check
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
