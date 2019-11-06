'use strict';
const accountService = require('../service/account-service');
const responseHandler = require('../../infrastructure/response-handler');

const getAccount =  async event => {
  const id = event.pathParameters.id;
  const account = await accountService.getAccount(id)
  return responseHandler(account);
};

const getAccounts = async () => {
  const accounts = await accountService.getAccounts();
  return responseHandler(accounts);
};

const createAccount= async event => {
  const data = JSON.parse(event.body);
  const account = await accountService.createAccount(data);
  return responseHandler(account);
}

module.exports = {
  getAccount,
  getAccounts,
  createAccount
};

