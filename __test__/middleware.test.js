/* eslint-disable strict */
'use strict';

const { server } = require('../lib/server.js');
const supergoose = require('@code-fellows/supergoose');
const mockRequest = supergoose(server);
// const mockRequest = supertest(server);

describe('testing middleware', () => {

  it('testing error 500 ', () => {
    return mockRequest
      .get('/error')
      .then(response => {
        expect(response.status).toEqual(500);
      });
  });

  it('testing not found route 404 ', () => {
    return mockRequest
      .get('/main')
      .then(data => {
        expect(data.status).toBe(500);
      });
  });

});
