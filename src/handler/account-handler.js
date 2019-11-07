'use strict';
const accountService = require('../service/account-service');

const getAccount =  async event => {
  const id = event.pathParameters;
  return accountService.getAccount(id);
};

const getAccounts = async event => {
  const accounts = await accountService.getAccounts();
  return {
    statusCode:200,
    body: JSON.stringify(accounts)
  } 
};

const createAccount= async event => {
  const data = JSON.parse(event.body);
  return accountService.createAccount(data);
}

module.exports = {
  getAccount,
  getAccounts,
  createAccount
};
