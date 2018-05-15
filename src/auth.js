import AWS from 'aws-sdk';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { errors, wrapper } from './utils';

const { STAGE } = process.env;
const wrapperOptions = { secretName: `${STAGE}/onionful`, raw: true };

const generatePolicy = (principalId, Effect, Resource) => ({
  principalId,
  policyDocument: Effect && Resource ? {
    Version: '2012-10-17',
    Statement: [{ Action: 'execute-api:Invoke', Effect, Resource }],
  } : null,
});

const check = ({ authorizationToken, methodArn }, { config }) => new Promise((resolve, reject) => {
  const [bearer, token] = (authorizationToken || '').split(' ');
  if (!(bearer.toLowerCase() === 'bearer' && token)) {
    console.error('Invalid token', { bearer, token });
    reject(new errors.Unauthorized());
  }

  const { header: { kid } } = jwt.decode(token, { complete: true });

  jwksClient({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 10,
    jwksUri: config.auth0.jwksUri,
  }).getSigningKey(kid, (err, { publicKey, rsaPublicKey } = {}) => {
    if (err) {
      console.error('JWKS error', err);
      reject(new errors.Unauthorized());
    }

    try {
      jwt.verify(token, publicKey || rsaPublicKey, {
        audience: config.auth0.clientId,
        issuer: `https://${config.auth0.domain}/`,
      }, (verifyError, { sub } = {}) => {
        if (verifyError) {
          console.error('VerifyError', verifyError);
          reject(new errors.Unauthorized());
        }

        resolve(generatePolicy(sub, 'Allow', methodArn));
      });
    } catch (e) {
      console.error('JWT error', e);
      reject(new errors.Unauthorized());
    }
  });
});

const rotateToken = (params, { config: { auth0 } }) =>
  axios.post(`https://${auth0.domain}/oauth/token`, {
    client_id: auth0.api.clientId,
    client_secret: auth0.api.clientSecret,
    audience: `https://${auth0.domain}/api/v2/`,
    grant_type: 'client_credentials',
  }, { headers: { 'content-type': 'application/json' } })
    .then(({ data: { access_token } }) =>
      new Promise((resolve, reject) => new AWS.SecretsManager().putSecretValue({
        SecretId: `${STAGE}/onionful/token`,
        SecretString: access_token,
      }, (error, data) => (error ? reject(error) : resolve(data))))
    );

module.exports = {
  check: wrapper(check, wrapperOptions),
  rotateToken: wrapper(rotateToken, wrapperOptions),
};
