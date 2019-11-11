const functions = require('./serverless.functions');
const iamRoleStatements = require('./serverless.iamRoleStatements');

const {
  AWS_ACCOUNT_ID,
  AWS_REGION,
  FUNCTION,
  DOMAIN,
  ENVIRONMENT = 'development',
  OFFLINE_HOST,
  OFFLINE_PORT,
  SERVICE,
} = process.env;

const service = [SERVICE, FUNCTION].join('-');
const domainPrefix = ENVIRONMENT === 'development' ? ['dev'] : [];
const domainName = domainPrefix.concat(DOMAIN).join('-');

module.exports = {
  service,
  provider: {
    name: 'aws',
    runtime: 'nodejs10.x',
    region: AWS_REGION,
    stage: ENVIRONMENT,
    environment: { ENVIRONMENT },
    role: `arn:aws:iam::${AWS_ACCOUNT_ID}:role/${SERVICE}`,
    iamRoleStatements,
    apiName: service,
    stackName: service,
  },
  plugins: [
    // 'serverless-plugin-typescript',
    'serverless-webpack',
    'serverless-offline',
    'serverless-domain-manager',
    'serverless-aws-alias',
  ],
  custom: {
    'serverless-offline': {
      host: OFFLINE_HOST,
      port: OFFLINE_PORT,
    },
    customDomain: {
      domainName,
      basePath: FUNCTION,
      stage: ENVIRONMENT,
    },
    webpack: {
      includeModules: true,
      packagerOptions: {
        scripts: ['rm -rf node_modules/aws-sdk'],
      },
    },
  },
  functions,
};
