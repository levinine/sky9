const AWS = require('aws-sdk');

const sns = new AWS.SNS();
const alertTopic = process.env.SNS_ALERTS_TOPIC;

const publish = (topicArn, subject, message) => {
  if (process.env.IS_OFFLINE || process.env.IS_LOCAL) {
    console.log(`Offline/Local: send message [${JSON.stringify(message)}] to SNS topic ${topicArn}`);
  } else {
    return sns.publish({
      Subject: subject,
      Message: JSON.stringify(message),
      TopicArn: topicArn
    }).promise();
  }
}

const publishAlert = (subject, message) => {
  return publish(alertTopic, `Sky9 ${process.env.ORGANIZATION}: ${subject}`, message);
}

module.exports = {
  publish,
  publishAlert
};
