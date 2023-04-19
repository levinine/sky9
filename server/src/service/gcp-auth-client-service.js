const { JWT } = require('google-auth-library');

let client = null;

const getGcpAccountKeys = async () => {
  try {
    return JSON.parse(process.env.GCP_SERVICE_ACCOUNT_KEYS);
  } catch (e) {
    console.log('error while fetching gcp keys', e);
    return null;
  }
}

const getGcpAuthClient = async () => {
  try {
    const gcpAccountKeys = await getGcpAccountKeys();
    if (gcpAccountKeys === null) {
      console.log('failed to fetched gcp keys');
      return null;
    }
    if (client === null) {
      client = new JWT({
        email: gcpAccountKeys.client_email,
        key: gcpAccountKeys.private_key,
        scopes: ['https://www.googleapis.com/auth/cloud-platform'],
      });
      return client;
    } else {
      return client;
    }
  } catch (e) {
    console.log('error while fetching gcp creds', e);
    return null;
  }

}

module.exports = {
  getGcpAuthClient,
  getGcpAccountKeys
};
