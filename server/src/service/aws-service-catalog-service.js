const AWS = require('aws-sdk');

const serviceCatalog = new AWS.ServiceCatalog({region: 'eu-west-1', apiVersion: '2015-12-10'});

let portfolioId;
const getPortfolioId = async () => {
  if (!portfolioId) {
    const portfolios = await serviceCatalog.listPortfolios().promise();
    // console.log('portfolios', portfolios);
    portfolioId = portfolios.PortfolioDetails.find(portfolioDetails => portfolioDetails.ProviderName === 'AWS Control Tower').Id;
    console.log(`Using portfolioId ${portfolioId}`);
  }
  return portfolioId;
}

let accountFactoryProductId;
const getAccountFactoryProductId = async () => {
  if (!accountFactoryProductId) {
    const portfolioId = await getPortfolioId();
    const products = await serviceCatalog.searchProductsAsAdmin({ PortfolioId: portfolioId }).promise();
    // console.log('products', JSON.stringify(products, null, 2));
    const productViewDetails = products.ProductViewDetails.find(product => product.ProductViewSummary.Name === 'AWS Control Tower Account Factory');
    accountFactoryProductId = productViewDetails.ProductViewSummary.ProductId;
    console.log(`Using productId ${accountFactoryProductId}`);
  }
  return accountFactoryProductId;
}

let provisioningArtifactId;
const getProvisioningArtifactId = async () => {
  if (!provisioningArtifactId) {
    const productId = await getAccountFactoryProductId();
    const provisioningArtifacts = await serviceCatalog.listProvisioningArtifacts({ ProductId: productId }).promise();
    provisioningArtifactId = provisioningArtifacts.ProvisioningArtifactDetails.find(pad => pad.Active).Id;
    console.log(`Using artifactId ${provisioningArtifactId}`);
  }
  return provisioningArtifactId;
}

const grantPortfolioAccess = async () => {
  const portfolioId = await getPortfolioId();
  // const portfolioPrincipals = await serviceCatalog.listPrincipalsForPortfolio({ PortfolioId: portfolioId }).promise();
  // console.log('Portfolio principals', JSON.stringify(portfolioPrincipals, null, 2));
  await serviceCatalog.associatePrincipalWithPortfolio({
    PortfolioId: portfolioId,
    PrincipalARN: process.env.LAMBDA_ROLE,
    PrincipalType: 'IAM'
  }).promise();
}

let launchPathId;
const getLaunchPathId = async () => {
  if (!launchPathId) {
    const productId = await getAccountFactoryProductId();
    const launchPaths = await serviceCatalog.listLaunchPaths({ ProductId: productId }).promise();
    launchPathId = launchPaths.LaunchPathSummaries.find(lps => lps.Name === 'AWS Control Tower Account Factory Portfolio').Id;
    console.log('Using launchPathId: ', launchPathId);
  }
  return launchPathId;
}

const listProvisionedAccounts = async () => {
  await getLaunchPathId();
  const productId = await getAccountFactoryProductId();
  let provisionedProducts = [];
  let nextToken = null;
  do {
    const params = {
      AccessLevelFilter: { Key: 'Account', Value: 'self' },
      PageToken: nextToken
    };
    const provisionedProductsResponse = await serviceCatalog.scanProvisionedProducts(params).promise();
    provisionedProducts.push(...provisionedProductsResponse.ProvisionedProducts);
    nextToken = provisionedProductsResponse.NextPageToken;
  } while (nextToken);
  // console.log('Provisioned products in CatalogService:', provisionedProducts);
  return provisionedProducts.filter(provisionedProduct => provisionedProduct.ProductId === productId);
}

const provisionAccount = async (account) => {
  await grantPortfolioAccess();
  const organizationDomain = process.env.ORGANIZATION_DOMAIN;
  const productId = await getAccountFactoryProductId();
  const provisioningArtifactId = await getProvisioningArtifactId();
  const launchPathId = await getLaunchPathId();
  const parameters = {
    ProductId: productId,
    ProvisionedProductName: account.name,
    ProvisioningParameters: [
      { 'Key': 'SSOUserEmail', 'Value': account.owner },
      { 'Key': 'AccountEmail', 'Value': `${account.name}@${organizationDomain}` },
      { 'Key': 'SSOUserFirstName', 'Value': account.ownerFirstName },
      { 'Key': 'SSOUserLastName', 'Value': account.ownerLastName },
      { 'Key': 'ManagedOrganizationalUnit', 'Value': 'Custom' },
      // { 'Key': 'ManagedOrganizationalUnit', 'Value': 'Sandbox' }, // only for aws-srb-recruitment
      { 'Key': 'AccountName', 'Value': account.name }
    ],
    PathId: launchPathId,
    ProvisioningArtifactId: provisioningArtifactId
  }
  console.log('Provisioning AWS account with parameters:', JSON.stringify(parameters, null, 2))
  const provisionAccountResponse = await serviceCatalog.provisionProduct(parameters).promise();
  console.log('Provision account response', provisionAccountResponse);
}

module.exports = {
  listProvisionedAccounts,
  provisionAccount
};
