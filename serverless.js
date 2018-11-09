const functions = require('./serverless.functions');

const {
  AWS_ACCOUNT_ID,
  AWS_KMS_KEY_ARN,
  AWS_REGION,
  FUNCTION,
  DOMAIN,
  ENVIRONMENT = 'development',
  OFFLINE_HOST,
  OFFLINE_PORT,
  SERVICE,
} = process.env;

const service = [SERVICE, FUNCTION].join('-');

module.exports = {
  service,
  awsKmsKeyArn: AWS_KMS_KEY_ARN,
  provider: {
    name: 'aws',
    runtime: 'nodejs8.10',
    region: 'eu-west-1',
    stage: ENVIRONMENT,
    environment: { STAGE: ENVIRONMENT },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['secretsmanager:GetSecretValue'],
        Resource: `arn:aws:secretsmanager:${AWS_REGION}:${AWS_ACCOUNT_ID}:secret:${ENVIRONMENT}/onionful*`,
      },
    ],
    apiName: service,
    stackName: service,
  },
  plugins: [
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
      basePath: FUNCTION,
      domainName: DOMAIN,
      stage: ENVIRONMENT,
    },
  },
  functions,
};
