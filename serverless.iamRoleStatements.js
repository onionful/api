const { AWS_ACCOUNT_ID, AWS_REGION, ENVIRONMENT = 'development' } = process.env;

module.exports = [
  {
    Effect: 'Allow',
    Action: ['secretsmanager:GetSecretValue'],
    Resource: `arn:aws:secretsmanager:${AWS_REGION}:${AWS_ACCOUNT_ID}:secret:${ENVIRONMENT}/onionful*`,
  },

  {
    Effect: 'Allow',
    Action: [
      'dynamodb:DescribeTable',
      'dynamodb:Scan',
      'dynamodb:GetItem',
      'dynamodb:PutItem',
      'dynamodb:UpdateItem',
      'dynamodb:DeleteItem',
    ],
    Resource: `arn:aws:dynamodb:${AWS_REGION}:${AWS_ACCOUNT_ID}:table/${ENVIRONMENT}_Onionful_*`,
  },
];
