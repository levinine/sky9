'use strict';
const accountService = require('../service/account-service');
const errorHandler = require('../../infrastructure/error-handler');
const responseHandler = require('../../infrastructure/response-handler');


//opening new merge to develop, will remove this later


const getAccount =  async event => {
  try{
    const id = event.pathParameters.id;
    const account = await accountService.getAccount(id)
    return responseHandler(account);
  } catch(error) {
    return errorHandler(error);
  }
};

const getAccounts = async () => {
  try {
    const accounts = await accountService.getAccounts();
    return responseHandler(accounts);
  } catch(error) {
    return errorHandler(error);
  }
};

const createAccount = async event => {
  try{
    const data = JSON.parse(event.body);
    const account = await accountService.createAccount(data);
    return responseHandler(account);
  } catch(error) {
    return errorHandler(error);
  }
};

const updateAccount = async event => {
  try {
    const id = event.pathParameters.id;
    const data = JSON.parse(event.body);
    if(id === data.id){
      const account = await accountService.updateAccount(data);
      return responseHandler(account);
    }else{
      return errorHandler("Id doesnt match");
    }
  } catch(error) {
    return errorHandler(error);
  }
};

const deleteAccount = async event => {
  try{
    const id = event.pathParameters.id;
    const account = await accountService.deleteAccount(id);
    return responseHandler(account);
  }catch(error) {
    return errorHandler(error);
  }
};

module.exports = {
  getAccount,
  getAccounts,
  createAccount,
  updateAccount,
  deleteAccount
};
