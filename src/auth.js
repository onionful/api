import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { errors } from './utils';

const AUTH0_DOMAIN = '...';
const AUTH0_CLIENT_ID = '...';
const JWKS_URI = '...';

const generatePolicy = (principalId, effect, resource) => ({
  principalId,
  policyDocument: effect && resource ? {
    Version: '2012-10-17',
    Statement: [{
      Action: 'execute-api:Invoke',
      Effect: effect,
      Resource: resource,
    }],
  } : null,
});

const client = jwksClient({
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 10,
  jwksUri: JWKS_URI,
});

const check = ({ authorizationToken, methodArn }, context, callback) => {
  const [bearer, token] = (authorizationToken || '').split(' ');
  if (!(bearer.toLowerCase() === 'bearer' && token)) {
    callback(new errors.Unauthorized());
  }

  const { header: { kid }} = jwt.decode(token, { complete: true });
  client.getSigningKey(kid, function (err, { publicKey, rsaPublicKey }) {
    if (err) {
      callback(new errors.Unauthorized());
    }

    try {
      jwt.verify(token, publicKey || rsaPublicKey, {
        audience: AUTH0_CLIENT_ID,
        issuer: `https://${AUTH0_DOMAIN}/`,
      }, (verifyError, { sub }) => {
        if (verifyError) {
          callback(new errors.Unauthorized());
        }
        callback(null, generatePolicy(sub, 'Allow', methodArn));
      })
    } catch (e) {
      callback(new errors.Unauthorized());
    }
  });
};

module.exports = {
  check: check,
};
