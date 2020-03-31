const AWS = require('aws-sdk');

const sns = new AWS.SNS();
const alertTopic = process.env.SNS_ALERTS_TOPIC;

const publish = (topicArn, message) => {
  if (process.env.IS_OFFLINE || process.env.IS_LOCAL) {
    console.log(`Offline/Local: send message [${JSON.stringify(message)}] to SNS topic ${topicArn}`);
  } else {
    return sns.publish({
      Message: JSON.stringify(message),
      TopicArn: topicArn
    }).promise();
  }
}

const publishAlert = (message) => {
  return publish(alertTopic, message);
}

module.exports = {
  publish,
  publishAlert
};
