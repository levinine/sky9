const { okResponse, errorResponse } = require('./responses');
const { getGcpAuthClient, getGcpAccountKeys } = require('../service/gcp-auth-client-service');

// TODO: remove before release (GCP AUTH example)
const gcpAuth = async (event) => {
  try {
    const gcpClient = await getGcpAuthClient();
    const gcpAccountKeys = await getGcpAccountKeys();
    if (gcpClient && gcpAccountKeys) {
      const url = `https://cloudresourcemanager.googleapis.com/v3/projects/${gcpAccountKeys.project_id}`;
      const res = await gcpClient.request({url});
      return okResponse({gcp: true, success: true, result: res.data});
    } else {
      throw new Error('Cannot fetch gcp account keys or client');
    }
  } catch (error) {
    console.log('auth error', error);
    return errorResponse({ statusCode: 500, message: 'Cannot fetch gcp account keys or client'});
  }
};

module.exports = {
  gcpAuth,
};
