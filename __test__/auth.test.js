/* eslint-disable strict */
/* eslint-disable camelcase */
'use strict';

const { server } = require('../lib/server.js');
// const server = require('../lib/server.js');
const supergoose = require('@code-fellows/supergoose');
const mockRequest = supergoose(server);
const jwt = require('jsonwebtoken');
let SECRET = process.env.SECRET;

describe('Testing API router', () => {

  // eslint-disable-next-line no-unused-vars
  let id;

  it('user can sign-up', () => {
    let user = { name: 'saja', pass: '123456' };
    return mockRequest
      .post('/signup')
      .send(user)
      .then(response => {
        // console.log('response.text : ', response.text);
        // var token = jwt.verify(response.text, 'successfully sign-up');
        // console.log('token : ', token);
        // id = token.iat;
        expect(response.text).toMatch('successfully sign-up');
        expect(response.statusCode).toEqual(200);
      });
  });

  it('user can signin with basic authenticate', () => {
    let user = { name: 'saja', pass: '123456' };
    return mockRequest
      .post('/signin')
      .auth(user.name, user.pass)
      .then(response => {
        // console.log('response.text : ', response.text);
        expect(response.status).toEqual(200);

        // var token = jwt.verify(response.text, process.env.SECRET);
        // console.log('id : ', id);
        // expect(token.iat).toEqual(id);
        // expect(token.name).toBeDefined();
      });
  });

});
