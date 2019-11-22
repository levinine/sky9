# Sky9
UI React application
## Prerequisites
    - NodeJS
## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `aws s3 sync build s3://sky9.levi9.com --delete`

Deploy build output to S3 bucket for hosting.

### `aws cloudfront create-invalidation --distribution-id E2E4T7WEJHVVQA --paths "/*"`

Invalidate caches.

### npm run deploy

Runs all commands needed for deployment of client. If one of the commands fails the script will stop and will not execute later commands.