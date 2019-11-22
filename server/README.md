# sky9  
AWS accounts and users management  
## Prerequisites
    - NodeJS
    - Serverless
    - Configured AWS account  
## Unit Testing  
``` npm test ```
## Deploy  
```sls deploy```

To set environment deploy with:  
```NODE_ENV=production sls deploy```

If for some reason you can't set NODE_ENV, you could always just pass it in as an option:  
```sls deploy --env production```  
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
```sls dynamodb start --stage local```

Run serverless offline:  
```sls offline --stage local```

Install ESlint globally:  
```npm install eslint -g```  

Run ESLint:  
```esLint .```