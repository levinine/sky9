/* eslint-disable no-undef */
const request = require('supertest');
let accountID = null;

describe('Get Accounts API Test', () => {
    it('should return all users', async () => {
      const res = await request(process.env.API_ENDPOINT).get('/accounts').send()
      expect(res.statusCode).toEqual(200)
      accountID = (JSON.parse(res.text).Items[0].id);
      console.log(accountID);
    })
  })

describe('Get Account API Test', () => {
    it('should return a given user', async () => {
        const res = await request(process.env.API_ENDPOINT).get('/accounts/' + accountID ).send();
        const account = JSON.parse(res.text).Item;
        expect(res.statusCode).toEqual(200)
        expect(account.id).toEqual(accountID);
    })
})
