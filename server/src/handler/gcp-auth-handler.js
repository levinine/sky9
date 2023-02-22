const { okResponse, errorResponse } = require('./responses');
const { getGcpAuthClient, getGcpAccountKeys } = require('../service/gcp-auth-client-service');
const { BigQuery } = require('@google-cloud/bigquery');

// const options = {
//   keyFilename: './root-srb-project-56264-195e99a6d9ea (1).json',
//   projectId: 'root-srb-project-56264',
// };

// const bigquery = new BigQuery(options);

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

const runBigQuery = async (event) => {
  try {

  // const query = `SELECT * from ${project_id}.${datasetId}.${tableId} LIMIT 1000`;
  const gcpAccountKeys = await getGcpAccountKeys();

  const creds = {
    client_email: gcpAccountKeys.client_email,
    private_key: gcpAccountKeys.private_key,
    projectId: gcpAccountKeys.project_id,
  };

  const bigquery = new BigQuery(credentials = creds);


  const query = `SELECT * FROM $${gcpAccountKeys.project_id}.${'all_billing_data_srb'}.${'gcp_billing_export_resource_v1_0157C8_014F5A_85A508'}`;
  const options = {
    query,
    // location // add it
  };
  // GOOGLE_APPLICATION_CREDENTIALS='C:/path/to/project/client_secret.json'
  // const [job] = await bigquery.createQueryJob(options);
  const [job] = await bigquery.query(options);
  console.log('job', job);

  const [rows] = await job.getQueryResults();
  console.log('rows', rows);
  return okResponse({bigquery: true, success: true, result: rows});

  } catch (error) {
    console.log('retreiving error', error);
    return errorResponse({ statusCode: 500, message: 'Can not retrieve data'});
  }
};

module.exports = {
  gcpAuth,
  runBigQuery
};
