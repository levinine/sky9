const development = {
  apiUrl: 'http://localhost:4000',
  baseUrl: 'http://localhost:3000',
  cognitoUrl: 'sky9-test-srb-test.auth.eu-west-1.amazoncognito.com',
  cognitoAuthProvider: 'levi9',
  cognitoRegion: 'eu-west-1',
  cognitoClientId: '35q3n2iho6cj6t7pvq5qaat5vr',
  cognitoUserPoolId: 'eu-west-1_7OYE8xKWh',
  cognitoSignOutUrl: 'https://myapps.microsoft.com/',
  organization: 'AWS-SRB'
};

const production = {
  apiUrl: 'https://4jyps2dv72.execute-api.eu-west-1.amazonaws.com/test',
  baseUrl: 'https://d17g91atz8xbnt.cloudfront.net',
  cognitoUrl: 'sky9-test-srb-test.auth.eu-west-1.amazoncognito.com',
  cognitoAuthProvider: 'levi9',
  cognitoRegion: 'eu-west-1',
  cognitoClientId: '35q3n2iho6cj6t7pvq5qaat5vr',
  cognitoUserPoolId: 'eu-west-1_7OYE8xKWh',
  cognitoSignOutUrl: 'https://myapps.microsoft.com/',
  organization: 'AWS-SRB'
};

const ukraine = {
  apiUrl: 'https://m3acht020b.execute-api.eu-west-1.amazonaws.com/prod',
  baseUrl: 'https://d1v2l35tsvly8d.cloudfront.net',
  cognitoUrl: 'sky9-ukr-prod.auth.eu-west-1.amazoncognito.com',
  cognitoAuthProvider: 'levi9',
  cognitoRegion: 'eu-west-1',
  cognitoClientId: '2j0isfs3ku88lt3s3hbr7gbos1',
  cognitoUserPoolId: 'eu-west-1_UBS81GXuk',
  cognitoSignOutUrl: 'https://myapps.microsoft.com/',
  appName: 'Ukraine',
  organization: 'AWS-UKR'
};

const serbia = {
  apiUrl: 'https://4jyps2dv72.execute-api.eu-west-1.amazonaws.com/test',
  baseUrl: 'https://d17g91atz8xbnt.cloudfront.net',
  cognitoUrl: 'sky9-test-srb-test.auth.eu-west-1.amazoncognito.com',
  cognitoAuthProvider: 'levi9',
  cognitoRegion: 'eu-west-1',
  cognitoClientId: '35q3n2iho6cj6t7pvq5qaat5vr',
  cognitoUserPoolId: 'eu-west-1_7OYE8xKWh',
  cognitoSignOutUrl: 'https://myapps.microsoft.com/',
  appName: 'Serbia',
  organization: 'AWS-SRB'
};

const romania = {
  apiUrl: 'https://drrzkufmmb.execute-api.eu-west-1.amazonaws.com/prod',
  baseUrl: 'https://d282c23hv2vqjq.cloudfront.net',
  cognitoUrl: 'sky9-rou-prod.auth.eu-west-1.amazoncognito.com',
  cognitoAuthProvider: 'levi9',
  cognitoRegion: 'eu-west-1',
  cognitoClientId: '22g9jne3sbm5m1fdc5ihejt3ki',
  cognitoUserPoolId: 'eu-west-1_b5rlHKXqc',
  cognitoSignOutUrl: 'https://myapps.microsoft.com/',
  appName: 'Romania',
  organization: 'AWS-ROU'
};

const thoughtleadership = {
  apiUrl: 'https://jb3ydqz6wl.execute-api.eu-west-1.amazonaws.com/prod',
  baseUrl: 'https://dgto2nyc5k782.cloudfront.net',
  cognitoUrl: 'sky9-thoughtleadership-prod.auth.eu-west-1.amazoncognito.com',
  cognitoAuthProvider: 'levi9',
  cognitoRegion: 'eu-west-1',
  cognitoClientId: '6bl5ksn1i6ih3qko1q46mofbuh',
  cognitoUserPoolId: 'eu-west-1_O93Bywg5J',
  cognitoSignOutUrl: 'https://myapps.microsoft.com/',
  appName: 'ThoughtLeadership / Hack9',
  organization: 'AWS-ThoughtLeadership' 
};

const recruitment = {
  apiUrl: 'https://g9qg4js5e6.execute-api.eu-west-1.amazonaws.com/test',
  baseUrl: 'https://d2yq8msbown10h.cloudfront.net',
  cognitoUrl: 'sky9-test-srb-recruitment-test.auth.eu-west-1.amazoncognito.com',
  cognitoAuthProvider: 'levi9',
  cognitoRegion: 'eu-west-1',
  cognitoClientId: '4pqhm1hnt9u8mcvcoc2e30a6eb',
  cognitoUserPoolId: 'eu-west-1_zyxKbrgO3',
  cognitoSignOutUrl: 'https://myapps.microsoft.com/',
  appName: 'Recruitment',
  organization: 'AWS-SRB-Recruitment'
};

const stage = process.env.NODE_ENV === 'production' ? serbia : serbia;

export default {
  ...stage
}
