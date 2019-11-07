# sky9
AWS accounts and users management

## Unit Testing
 Run the test with # npm test command 

## Deploy
     
    sls deploy

To set environment deploy with:
```sh
    NODE_ENV=production sls deploy
```
If for some reason you can't set NODE_ENV, you could always just pass it in as an option:
```sh
    sls deploy --env production
```
## Services used
    - Lambda
    - DynamoDB
    - CloudWatch
    - CloudFormation
    - API Gateway

## Run locally

Download local DynamoDB:
```sh
    sls dynamodb install
```
Run local DyanmoDB:
```sh
    sls dynamodb start 
```
Run serverless offline:
```sh
    sls offline
```
Run ESLint:
```sh
    esLint .
```