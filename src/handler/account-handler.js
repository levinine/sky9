'use strict';
const accountService = require('../service/account-service');
const errorHandler = require('../../infrastructure/error-handler');
const responseHandler = require('../../infrastructure/response-handler');

const GetAccount =  async event => {
  try{
    const id = event.pathParameters.id;
    const account = await accountService.getAccount(id)
    return responseHandler(account);
  } catch(error) {
    return errorHandler(error);
  }
};

const GetAccounts = async () => {
  try {
    const accounts = await accountService.getAccounts();
    return responseHandler(accounts);
  } catch(error) {
    return errorHandler(error);
  }
};

const CreateAccount= async event => {
  try{
    const data = JSON.parse(event.body);
    const account = await accountService.createAccount(data);
    return responseHandler(account);
  } catch(error) {
    return errorHandler(error);
  }
}

const UpdateAccount = async event => {
  try {
    const data = JSON.parse(event.body);
    const account = await accountService.UpdateAccount(data);
    return responseHandler(account);
  } catch(error) {
    return errorHandler(error);
  }
}

module.exports = {
  GetAccount,
  GetAccounts,
  CreateAccount,
  UpdateAccount
};