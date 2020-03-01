# Sky9

AWS accounts and users management

## Prerequisites
  - NodeJS
  - Serverless
  - Configured AWS account

## AWS Services used
  - Lambda
  - DynamoDB
  - CloudWatch
  - CloudFormation
  - API Gateway

## Development

Run unit tests `npm test`
Run linter `npm run lint`

### Run server locally

Download local DynamoDB: `sls dynamodb install`
Run local DyanmoDB: `sls dynamodb start --migrate --stage local`
Run serverless offline: `sls offline --stage local`

### Useful commands

Delete account from DynamoDB:
`sls invoke local -s test -f DeleteAccount -e accountId=[accountId]`

## Deploy

This will build and deploy application to AWS. You must have AWS account configured for this.

```sls deploy --stage [test|prod]```
