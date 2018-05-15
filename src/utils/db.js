import AWS from 'aws-sdk';

if (process.env.IS_OFFLINE) {
  AWS.config.update({
    region: 'localhost',
    endpoint: 'http://localhost:8000',
  });
}

export default new AWS.DynamoDB.DocumentClient();
