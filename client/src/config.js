const development = {
  apiUrl: 'http://localhost:4000',
  baseUrl: 'http://localhost:3000',
  cognitoUrl: 'sky9-test-srb-test.auth.eu-west-1.amazoncognito.com',
  cognitoAuthProvider: 'levi9',
  cognitoRegion: 'eu-west-1',
  cognitoClientId: '35q3n2iho6cj6t7pvq5qaat5vr',
  cognitoUserPoolId: 'eu-west-1_7OYE8xKWh',
  cognitoSignOutUrl: 'https://myapps.microsoft.com/'
};

const production = {
  apiUrl: 'https://4jyps2dv72.execute-api.eu-west-1.amazonaws.com/test',
  baseUrl: 'https://d17g91atz8xbnt.cloudfront.net',
  cognitoUrl: 'sky9-test-srb-test.auth.eu-west-1.amazoncognito.com',
  cognitoAuthProvider: 'levi9',
  cognitoRegion: 'eu-west-1',
  cognitoClientId: '35q3n2iho6cj6t7pvq5qaat5vr',
  cognitoUserPoolId: 'eu-west-1_7OYE8xKWh',
  cognitoSignOutUrl: 'https://myapps.microsoft.com/'
};

const stage = process.env.NODE_ENV === 'production' ? production : development;

export default {
  ...stage
}
