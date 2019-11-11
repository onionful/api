import errors, { HttpErrorConstructor } from 'http-errors';
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
export const _ = (path: string, params = {}) => template(get(messages, path))(params);

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
 */
export const verifier: {
  <T>(params: { error: HttpErrorConstructor; message?: string; condition: (item: T) => boolean }): (
    item: T,
  ) => T;
} = ({ error, message, condition }) => item => {
  if (condition(item)) {
    throw new error(message);
  }
  return item;
};

/**
 * Common verifiers - checks initialized using {@link verifier}.
 *
 */
export const verify = {
  presence: verifier({
    error: errors.NotFound,
    condition: item => isEmpty(item),
  }),
  conflict: verifier({
    error: errors.Conflict,
    condition: item => !!item,
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
