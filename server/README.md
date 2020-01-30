# sky9  

AWS accounts and users management  

## Prerequisites
  - NodeJS
  - Serverless
  - Configured AWS account  

## Unit Testing  

``` npm test ```

## Deploy  

```sls deploy --stage [test|prod]```

This will build and deploy application to AWS. You must have AWS account configured for this.

## Services used
  - Lambda
  - DynamoDB
  - CloudWatch
  - CloudFormation
  - API Gateway  

## Run locally  

Download local DynamoDB:  
```sls dynamodb install```

Run local DyanmoDB:  
```sls dynamodb start --migrate --stage local```

Run serverless offline:  
```sls offline --stage local```

## Linting

Install ESlint globally:  
```npm install eslint -g```  

Run ESLint:  
```eslint .```