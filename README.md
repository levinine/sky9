# Sky9

AWS accounts and users management.

## First time deployment procedure

When Sky9 application is initially deployed, SSO needs to be configured in 3 places: frontend (directory `client` in this repo), backend (directory `server`) + Cognito, and Azure AD. There are two SSO's happening during authentication&authorization: 
1. Azure AD application <-> Cognito
2. Cognito <-> Sky9 application

Here are the steps to deploy everything for the first time and configure both SSOs:
1. Start creating `server/config.json` for new deployment. Never commit this file to Git, as it contains sensitive info.
2. Create Azure AD application. Note app's clinetId and secrets and add them to `server/config.json`.
3. Deploy backend. This will create APIs and Cognito. Cognito <-> Azure connection should be now in place. Still, Cognito is not yet configured for the frontend as we don't know it's URL until it is deployed for the first time.
4. Populate `client/config.js`. At least the following values should be obtained and updated: `apiUrl` (API Gateway endpoint), `cognitoUrl`, `cognitoClientId`, `cognitoUserPoolId`. Data in this file is not sensitive and can be commited to Git.
5. Deploy the client. This will create CloudFront distribution for the first time. Only now the Cognito configuration can be updated to accept the URL of client application as redirect URL in authentication requests.
6. Deploy the backend once again. CloudFront URL should be automatically picked-up and configured in Cognito.
