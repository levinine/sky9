# Sky9

Frontend for Sky9. React application.

## Prerequisites
    - NodeJS
    - AWS CLI

## Local development

```
npm start
```

## Deploying

To deploy this application one must first prepare needed infrastructure. This is done only once per environment. Next the app needs to be built and finally deployment can be done.

### Infrastructure

Infrastructure for hosting UI is created with CloudFront:

```
aws cloudformation deploy --stack-name website-test --template-file website.yml --parameter-overrides Environment=test
```

### Build for deployment

```
npm run build
```


Builds the app for production to the `build` folder.

### Deploy

S3 bucket name and CloudFront distribution ID can be obtained with following commands:

```
export bucket=$(aws cloudformation describe-stacks \
  --query "Stacks[?StackName=='website-test'] | [0] | Outputs[?OutputKey=='BucketName'].OutputValue" \
  --output text \
  | cut -d'/' -f2)

export distribution=$(aws cloudformation describe-stacks \
  --query "Stacks[?StackName=='website-test'] | [0] | Outputs[?OutputKey=='CloudfrontDistributionId'].OutputValue" \
  --output text \
  | cut -d'/' -f2)
```

After that you can deploy new version of UI app and invalidate cache:

```
aws s3 sync build s3://$bucket --delete
aws cloudfront create-invalidation --distribution-id $distribution --paths "/*"
```