const axios = require('axios');

const clientId = process.env.AD_CLIENT_ID;
const clientSecret = process.env.AD_CLIENT_SECRET;
const tenantId = process.env.AD_TENANT_ID;

const runbookUrl = process.env.AD_RUNBOOK_URL;
const runbookKey = process.env.AD_RUNBOOK_KEY;
const organization = process.env.ORGANIZATION;
const organizationDomain = process.env.ORGANIZATION_DOMAIN;
const gcpOrganization = process.env.GCP_ORGANIZATION;

const scope = 'https://graph.microsoft.com/.default';
const grantType = 'client_credentials';
const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
const groupsUrl = 'https://graph.microsoft.com/v1.0/groups';
const usersUrl = 'https://graph.microsoft.com/v1.0/users';

const getToken = async () => {
  const params = `client_id=${clientId}&scope=${scope}&client_secret=${clientSecret}&grant_type=${grantType}`
  const token = await axios.post(tokenUrl, params).then(response => {
    // console.log('token response: ', response.data.access_token);
    return response.data.access_token;
  }).catch(error => {
    console.log('Error getting AD access token', error);
    return null;
  });
  return token;
}

const findGroupByName = async (name) => {
  const token = await getToken();
  const group = await axios.get(`${groupsUrl}?$filter=displayName eq '${name}-Administrators'`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(response => {
    // console.log(`Find AD group '${name}': ${JSON.stringify(response.data.value[0])}`);
    return response.data.value[0] || null;
  }).catch(error => {
    console.log(`Error finding AD group ${name}`, error);
    return null;
  });
  return group;
}

const findGroupOwners = async (id) => {
  const token = await getToken();
  const owners = await axios.get(`${groupsUrl}/${id}/owners`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(response => {
    // console.log(`Find AD group owners '${id}': ${JSON.stringify(response.data)}`);
    return response.data.value.map(user => user.mail);
  }).catch(error => {
    console.log(`Error finding AD group owners ${id}`, error);
    return null;
  });
  return owners;
}

const findUserByEmail = async (email) => {
  const token = await getToken();
  const user = await axios.get(`${usersUrl}?$filter=mail eq '${email}'`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(response => {
    // console.log(`Find AD user '${email}': ${JSON.stringify(response.data.value[0])}`);
    return response.data.value[0] || null;
  }).catch(error => {
    console.log(`Error finding AD user ${email}`, error);
    return null;
  });
  return user;
}

const findGroupMemberEmails = async (name) => {
  const group = await findGroupByName(name);
  if (group) {
    const token = await getToken();
    const members = await axios.get(`${groupsUrl}/${group.id}/members`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(membersResponse => {
      return membersResponse.data.value;
    });
    // console.log('findGroupMembers', JSON.stringify(members, null, 2));
    return members.filter(member => member['@odata.type'] === '#microsoft.graph.user').map(member => member.mail);
  }
  return [];
}

// TODO: adjust for GCP (gcpOrganization, runbookKey)
const execAdRunbook = async (accountName, owner) => {
  const data = {
    'GroupName': `${accountName}-Administrators`,
    'Owner': owner,
    'AWS_Account_Email': `${accountName}@${organizationDomain}`,
    // 'GCP_Account_Email': ``
  };
  const config = {
    headers: {
      'content-type': 'application/json',
      'from': `Sky9-${organization}`, // gcpOrganization
      'Date': new Date().toISOString(),
      'Key': runbookKey
    }
  }
  const result = await axios.post(runbookUrl, data, config).then(response => {
    // console.log('AD runbook OK response', response);
    return response.status === 202;
  }).catch(error => {
    console.log('AD runbook error response', error);
    return false;
  });
  return result;
}

module.exports = {
  findGroupByName,
  findUserByEmail,
  findGroupMemberEmails,
  findGroupOwners,
  execAdRunbook
}
