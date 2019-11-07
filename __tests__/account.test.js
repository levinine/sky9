/* eslint-disable no-undef */
const request = require('supertest');
const testAccount = {
    "email": "test@email.com",
    "name": "test skripta",
    "status": "inactive",
    "IAMUsers": [
        "user3",
        "user2",
        "user6"
    ]
}
let testGetAccount = {};

describe('Create Account API Test', () => {
    it('should return the created account', async () => {
        const res = await request(process.env.API_ENDPOINT)
        .post('/accounts/')
        .send(testAccount);
        const account = JSON.parse(res.text);
        testGetAccount = account;
        expect(res.statusCode).toEqual(200)
        expect(account.name).toEqual(testAccount.name)
        expect(account.email).toEqual(testAccount.email)
    });
});

describe('Get Accounts API Test', () => {
    it('should return all accounts', async () => {
      const res = await request(process.env.API_ENDPOINT)
      .get('/accounts')
      .send()
      expect(res.statusCode).toEqual(200)
      const accounts = JSON.parse(res.text).Items;
      expect(Array.isArray(accounts)).toEqual(true)
      accounts.forEach((account) => {
          expect(typeof account).toEqual('object')
          console.log(Object.keys(account));
          expect(Object.keys(account)).toEqual([
            'IAMUsers',
            'id',
            'email',
            'name',
            'status',
          ])

          expect(typeof account.name).toEqual('string');
          expect(typeof account.email).toEqual('string');
          expect(typeof account.status).toEqual('string');
      });
    });
  });

describe('Get Account API Test', () => {
    it('should return a given account', async () => {
        const res = await request(process.env.API_ENDPOINT)
        .get('/accounts/' + testGetAccount.id )
        .send();
        const account = JSON.parse(res.text).Item;
        expect(res.statusCode).toEqual(200)
        expect(account.id).toEqual(testGetAccount.id);
    });
});


