const development = {
  apiUrl: 'http://localhost:4000',
  baseUrl: 'http://localhost:3000',
  cognitoUrl: 'https://sky9.auth.eu-west-1.amazoncognito.com',
  cognitoClientId: '4bchs6l7hecm64t6n8blhb5qbp'
};

const production = {
  apiUrl: 'https://4jyps2dv72.execute-api.eu-west-1.amazonaws.com/test',
  baseUrl: 'https://d17g91atz8xbnt.cloudfront.net',
  cognitoUrl: 'https://sky9.auth.eu-west-1.amazoncognito.com',
  cognitoClientId: '4bchs6l7hecm64t6n8blhb5qbp'
};

const stage = process.env.NODE_ENV === "production" ? production : development;

export default {
  ...stage
}
