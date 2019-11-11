import AWS from 'aws-sdk';
import axios from 'axios';
import { wrapper } from 'utils';

const { ENVIRONMENT } = process.env;

export default wrapper(
  (params, { config: { auth0 } }) =>
    axios
      .post(
        `https://${auth0.domain}/oauth/token`,
        {
          client_id: auth0.api.clientId,
          client_secret: auth0.api.clientSecret,
          audience: `https://${auth0.domain}/api/v2/`,
          grant_type: 'client_credentials',
        },
        { headers: { 'content-type': 'application/json' } },
      )
      .then(
        ({ data: { access_token: token } }) =>
          new Promise((resolve, reject) =>
            new AWS.SecretsManager().putSecretValue(
              {
                SecretId: `${ENVIRONMENT}/onionful/token`,
                SecretString: JSON.stringify({ token }),
              },
              error => (error ? reject(error) : resolve('OK')),
            ),
          ),
      ),
  { withConfig: true },
);
