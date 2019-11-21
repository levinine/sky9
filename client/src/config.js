const development = {
  apiGateway: {
    URL: "http://localhost:4000"
  }
};

const production = {
  apiGateway: {
    REGION: "eu-west-2",
    URL: ""
  }
};

const stage = process.env.NODE_ENV === "production" ? production : development;

export default {
  stage
}