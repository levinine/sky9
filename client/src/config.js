const development = {
  apiGateway: {
    URL: "http://localhost:4000"
  },
  baseUrl: 'http://localhost:3000'
};

const production = {
  apiGateway: {
    REGION: "eu-west-2",
    URL: "https://dludyym8kf.execute-api.eu-west-2.amazonaws.com/dev"
  },
  baseUrl: 'https://d387u71rqfkaz0.cloudfront.net'
};

const stage = process.env.NODE_ENV === "production" ? production : development;

export default {
  stage
}