'use strict';
const accountService = require('../service/account-service');
const errorHandler = require('../../infrastructure/error-handler');

const getAccount =  async event => {
  try {
    const id = event.pathParameters;
    const account = accountService.getAccount(id);
    return account;
  } catch(error) {
    return errorHandler(error);
  }
  
};

const getAccounts = async event => {
  try {
    const accounts = await accountService.getAccounts();
    return accounts;
  } catch(error) {
    return errorHandler(error);
  }
  
  
};

const createAccount= async event => {
  try {
    const data = JSON.parse(event.body);
    const account = accountService.createAccount(data);
    return account;
  } catch(error) {
    return errorHandler(error);
  }
    
}

module.exports = {
  getAccount,
  getAccounts,
  createAccount
};