# Sky9

AWS/GCP accounts/projects and users management.

## First time deployment procedure

When Sky9 application is initially deployed, SSO needs to be configured in 3 places: frontend (directory `client` in this repo), backend (directory `server`) + Cognito, and Azure AD. There are two SSO's happening during authentication&authorization: 
1. Azure AD application <-> Cognito
2. Cognito <-> Sky9 application

Here are the steps to deploy everything for the first time and configure both SSOs:

1. Start adding configuration for new deployment to AWS Parameter Store.
  At this point you should prepare the following configuration properties: `organization`, `organizationDomain`, `cognitoDomain`, `adTenantId`. If available these two as well: `adRunbookUrl` and `adRunbookKey`.

  ```Bash
  # expected values are prod and test
  export stage=prod
  aws ssm put-parameter --type String --name "/sky9/$stage/organization" --value "<organization>"
  aws ssm put-parameter --type String --name "/sky9/$stage/organizationDomain" --value "<organizationDomain>"
  aws ssm put-parameter --type String --name "/sky9/$stage/cognitoDomain" --value "<cognitoDomain>"
  aws ssm put-parameter --type String --name "/sky9/$stage/cognitoOrganization" --value "<cognitoOrganization>"
  aws ssm put-parameter --type String --name "/sky9/$stage/adTenantId" --value "<adTenantId>"
  aws ssm put-parameter --type String --name "/sky9/$stage/adRunbookKey" --value "<adRunbookKey>"
  # longer format of command is required because the value is URL
  aws ssm put-parameter --type String --name "/sky9/$stage/adRunbookUrl" --cli-input-json '{ "Name": "/sky9/$stage/adRunbookUrl", "Value": "<adRunbookUrl>", "Type": "String" }'
  aws ssm put-parameter --type String --name " /sky9/$stage/gcpAccountKeys" --value '<gcpAccountKeys>'
  aws ssm put-parameter --type String --name " /sky9/$stage/gcpParentFolderValue" --value '<gcpParentFolderValue>'
  aws ssm put-parameter --type String --name " /sky9/$stage/gcpOrganization" --value '<gcpOrganization>'
  aws ssm put-parameter --type String --name " /sky9/$stage/gcpBillingAccountId" --value '<gcpBillingAccountId>'
  aws ssm put-parameter --type String --name " /sky9/$stage/gcpBudgetPubSubSubscriptionId" --value '<gcpBudgetPubSubSubscriptionId>'
  aws ssm put-parameter --type String --name " /sky9/$stage/gcpBudgetPubSubTopicId" --value '<gcpBudgetPubSubTopicId>'
  ```

2. Deploy infrastructure for the client. This will create S3 bucket and CloudFront distribution. Interesting values to pick-up here is CloudFront distribution public URL, which will be used to configure client build, Cognito's redirectURL config parameter, and AD application Home page URL.

  ```Bash
  aws cloudformation deploy --stack-name website-$stage --template-file client/website.yml --parameter-overrides Environment=$stage

  # Get CloudFront public URL:
  aws cloudformation describe-stacks \
    --query "Stacks[?StackName=='website-$stage'] | [0] | Outputs[?OutputKey=='CloudfrontEndpoint'].OutputValue" \
    --output text \
    | cut -d'/' -f2
  ```

3. Create Azure AD application. Value assigned to `Application (client) ID` should be noted in `server/config.json` -> `adAppClientId`
  * Under `Overview` -> `Managed application in local directory` -> 
    * `Properties` -> User assignment required = true
    * `Users and groups` -> Assign group (this requires admin consent when logging in for the first time)
  This will limit who can login to Sky9 application to people who are part of the assigned group.
  * Under `Branding` -> Home page URL = CloudFront distribution public URL
  * Under `Authentication` add platform (Web): 
    * Redirect URI = https://{cognitoDomain}-{stage}.auth.eu-west-1.amazoncognito.com/oauth2/idpresponse
    * Implicit Grant -> Access tokens = true
    * Implicit Grant -> ID tokens = true
  * Under `Certificates & secrets` create two client secrets: for Cognito integration and access to GraphAPI, and add them to AWS Parameter Store.

  ```Bash
  aws ssm put-parameter --type String --name "/sky9/$stage/adAppClientId" --value "<adAppClientId>"
  aws ssm put-parameter --type String --name "/sky9/$stage/adAppClientSecretSso" --value "<adAppClientSecretSso>"
  aws ssm put-parameter --type String --name "/sky9/$stage/adAppClientSecretGraph" --value "<adAppClientSecretGraph>"
  ```

  Ask Azure administrators to give this App `Group.Read.All` and `User.Read.All` permissions, as well as admin consent for using this app as SSO for Cognito.

4. Deploy backend. This will create APIs and Cognito. Cognito should be configured for both SSOs: Cognito <-> Sky9 and Azure <-> Cognito.

  ```Bash
  cd server
  npm install
  sls deploy --stage $stage
  cd -
  ```

5. Deploy frontend. First, populate `client/config.js`. The following values should be obtained and updated: 
  * `apiUrl` is API Gateway endpoint
  * `baseUrl` is CloudFront distribution public URL
  * `cognitoUrl`, `cognitoClientId`, `cognitoUserPoolId` should be taken from Cognito user pool
  Data in this file is not sensitive and can be commited to Git.
  After preparing config file you can build and deploy the client application.

  ```Bash
  cd client
  npm install
  npm run build

  export bucket=$(aws cloudformation describe-stacks \
    --query "Stacks[?StackName=='website-$stage'] | [0] | Outputs[?OutputKey=='BucketName'].OutputValue" \
    --output text \
    | cut -d'/' -f2)

  export distribution=$(aws cloudformation describe-stacks \
    --query "Stacks[?StackName=='website-$stage'] | [0] | Outputs[?OutputKey=='CloudfrontDistributionId'].OutputValue" \
    --output text \
    | cut -d'/' -f2)

  aws s3 sync build s3://$bucket --delete
  aws cloudfront create-invalidation --distribution-id $distribution --paths "/*"
  cd -
  ```

6. One SNS topic for alerts is created as part of the backend, without any subscribers. Any interested parties should be manually added to listen for alerts Sky9 application emits.

## Non-First time deployment procedure
According to deployed instances, atm we have 6 accounts where Sky9 app is deployed (AWS SRB, AWS UKR, AWS ROU, AWS ThoughtLeadership, AWS Levi9, AWS Recruitment).
For any of it, you should fetch access token for particular AWS account and then you can proceed with further instructions.

# Backend

  ```Bash
  cd server
  npm install
  sls deploy --stage $stage
  cd -
  ```

# Frontend

* First Step
Go to `client/src/config` and choose which configuration should be used during deployment. There are 6 different configuration according to different AWS accounts and their deployment parameters

* Second Step
After Step #1 is configured, proceed futher with these following calls according to desired AWS account

AWS Serbia
  ```Bash
  cd client
  npm run build
  aws s3 sync build s3://sky9-website-test --delete
  aws cloudfront create-invalidation --distribution-id EB6AE5K4KLR16 --paths "/*"
  ```

AWS Ukraine
  ```Bash
  cd client
  npm run build
  aws s3 sync build s3://sky9-website-prod-b141fb50 --delete
  aws cloudfront create-invalidation --distribution-id E1LRFWN7MA2OXD --paths "/*"
  ```

AWS Romania

  ```Bash
  cd client
  npm run build
  aws s3 sync build s3://sky9-website-prod-5f159470 --delete
  aws cloudfront create-invalidation --distribution-id E2RV99PYZ38HX --paths "/*"
  ```

AWS ThoughtLeadership

  ```Bash
  cd client
  npm run build
  aws s3 sync build s3://sky9-website-prod-67cbb2b0 --delete
  aws cloudfront create-invalidation --distribution-id E2X4HZ6EFKE93J --paths "/*"
  ```

AWS Recruitment

  ```Bash
  cd client
  npm run build
  aws s3 sync build s3://sky9-website-test-47f069b0 --delete
  aws cloudfront create-invalidation --distribution-id E1OXLHXIJM9QF0 --paths "/*"
  ```

AWS Levi9 (should not be redeployed, it stays on the previous version without GCP creation possibility)
