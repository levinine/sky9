# Sky9

AWS accounts and users management.

## First time deployment procedure

When Sky9 application is initially deployed, SSO needs to be configured in 3 places: frontend (directory `client` in this repo), backend (directory `server`) + Cognito, and Azure AD. There are two SSO's happening during authentication&authorization: 
1. Azure AD application <-> Cognito
2. Cognito <-> Sky9 application

Here are the steps to deploy everything for the first time and configure both SSOs:
1. Start creating `server/config.json` for new deployment. Never commit this file to Git, as it contains sensitive info.
  At this point you should prepare the following configuration properties: `organization`, `organizationDomain`, `cognitoDomain`, `adTenantId`. If available these two as well: `adRunbookUrl` and `adRunbookKey`
2. Deploy infrastructure for the client. This will create S3 bucket and CloudFront distribution. Interesting values to pick-up here is CloudFront distribution public URL, which will be used to configure client build, Cognito's redirectURL config parameter, and AD application Hone page URL.
3. Create Azure AD application. Value assigned to `Application (client) ID` should be noted in `server/config.json` -> `adAppClientId`
  * Under `Overview` -> `Managed application in local directory` -> 
    * `Properties` -> User assignment required = true
    * `Users and groups` -> Assign group
  This will limit who can login to Sky9 application to people who are part of the assigned group.
  * Under `Branding` -> Home page URL = CloudFront distribution public URL
  * Under `Authentication` add platform (Web): 
    * Redirect URI = https://{cognitoDomain}.auth.eu-west-1.amazoncognito.com/oauth2/idpresponse
    * Implicit Grant -> Access tokens = true
    * Implicit Grant -> ID tokens = true
  * Under `Certificates & secrets` create two client secrets: for Cognito integration and access to GraphAPI, and add them to `server/config.json` under `adAppClientSecretSso` and `adAppClientSecretGraph`.
4. Deploy backend. This will create APIs and Cognito. Cognito should be configured for both SSOs: Cognito <-> Sky9 and Azure <-> Cognito.
5. Deploy frontend. First, populate `client/config.js`. The following values should be obtained and updated: 
  * `apiUrl` is API Gateway endpoint
  * `baseUrl` is CloudFront distribution public URL
  * `cognitoUrl`, `cognitoClientId`, `cognitoUserPoolId` should be taken from Cognito user pool
  Data in this file is not sensitive and can be commited to Git.
  After preparing config file you can build and deploy the client application.
6. One SNS topic for alerts is created as part of the backend, without any subscribers. Any interested parties should be manually added to listen for alerts Sky9 application emits.
