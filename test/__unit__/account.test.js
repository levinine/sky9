/* eslint-disable no-undef */
const request = require('supertest')
const createAccount = {
    "email": "pera@email.com",
    "name": "Pera",
    "status": "inactive",
    "IAMUsers": [
        "djura@email.com",
        "user2@email.com",
        "user6@email.com"
    ]
}
let testAccount = {
    "email":"zika@email.com",
    "name": "Zika",
    "status": "active",
    "IAMUsers": [
        "lola@email.com",
        "user2@email.com",
        "user3@email.com"
    ]
};

describe('Create Account API Test', () => {
    it('should return the created account', async () => {
        const res = await request(process.env.API_ENDPOINT)
        .post('/accounts')
        .send(createAccount)
        const account = JSON.parse(res.text);
        testAccount.id = account.id;
        expect(res.statusCode).toEqual(200)
        expect(account.name).toEqual(createAccount.name)
        expect(account.email).toEqual(createAccount.email)
        expect(account.status).toEqual(createAccount.status)
        expect(account.IAMUsers).toEqual(createAccount.IAMUsers)
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
          expect(Object.keys(account).sort()).toEqual([
            'IAMUsers',
            'email',
            'id',
            'name',
            'status',
          ])

          expect(typeof account.name).toEqual('string')
          expect(typeof account.email).toEqual('string')
          expect(typeof account.status).toEqual('string')
          expect(typeof account.id).toEqual('string')
          expect(Array.isArray(account.IAMUsers)).toEqual(true)
      });
    });
  });

describe('Get Account API Test', () => {
    it('should return a given account', async () => {
        const res = await request(process.env.API_ENDPOINT)
        .get('/accounts/' + testAccount.id )
        .send();
        const account = JSON.parse(res.text).Item;
        expect(res.statusCode).toEqual(200)
        expect(account.id).toEqual(testAccount.id);
    });
});

describe('Update Account API Test', () => {
    it('should return updated account', async () => {
        const res = await request(process.env.API_ENDPOINT)
        .put('/accounts/' + testAccount.id)
        .send(testAccount);
        const updatedAccount = JSON.parse(res.text).Attributes;
        expect(res.statusCode).toEqual(200)
        expect(updatedAccount.id).toEqual(testAccount.id)
    });
});

describe('Delete Account API Test', () => {
    it('should fail to find account after deletion', async () => {
        const res = await request(process.env.API_ENDPOINT)
        .delete('/accounts/' + testAccount.id)
        .send();
        expect(res.statusCode).toEqual(200)
    })
});