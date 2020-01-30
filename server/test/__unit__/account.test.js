/* eslint-disable no-undef */
const request = require('supertest');

const createAccount = {
  'id': '' + Date.now(),
  'name': 'test-account',
  'owner': 'j.doe',
  'budget': '100'
}

describe('Create Account API Test', () => {
  it('should return the created account', async () => {
    console.log(API_ENDPOINT)
    const res = await request(API_ENDPOINT)
      .post('/accounts')
      .send(createAccount)
    const account = JSON.parse(res.text);
    expect(res.statusCode).toEqual(200);
    expect(account.id).toEqual(createAccount.id);
    expect(account.name).toEqual(createAccount.name);
    expect(account.owner).toEqual(createAccount.owner);
    expect(account.budget).toEqual(createAccount.budget);
  });
});

describe('Get Accounts API Test', () => {
  it('should return all accounts', async () => {
    const res = await request(API_ENDPOINT)
      .get('/accounts')
      .send()
    expect(res.statusCode).toEqual(200)
    const accounts = JSON.parse(res.text).Items;
    expect(Array.isArray(accounts)).toEqual(true);
    accounts.forEach((account) => {
      expect(typeof account).toEqual('object');
      expect(Object.keys(account).sort()).toEqual(expect.arrayContaining(['id', 'name']));

      expect(typeof account.name).toEqual('string');
      expect(typeof account.owner === 'string' || typeof account.owner === 'undefined').toBeTruthy();
      expect(typeof account.budget === 'string' || typeof account.budget === 'undefined').toBeTruthy();
      expect(typeof account.id).toEqual('string');
    });
  });
});

describe('Get Account API Test', () => {
  it('should return a given account', async () => {
    const res = await request(API_ENDPOINT)
      .get('/accounts/' + createAccount.id)
      .send();
    const account = JSON.parse(res.text).Item;
    expect(res.statusCode).toEqual(200);
    expect(account.id).toEqual(createAccount.id);
  });
});

describe('Update Account API Test', () => {
  it('should return updated account', async () => {
    const res = await request(API_ENDPOINT)
      .put('/accounts/' + createAccount.id)
      .send(createAccount);
    const updatedAccount = JSON.parse(res.text).Attributes;
    expect(res.statusCode).toEqual(200);
    expect(updatedAccount.id).toEqual(createAccount.id);
  });
});

describe('Delete Account API Test', () => {
  it('should fail to find account after deletion', async () => {
      const res = await request(API_ENDPOINT)
      .delete('/accounts/' + testAccount.id)
      .send();
      expect(res.statusCode).toEqual(200)
  })
});