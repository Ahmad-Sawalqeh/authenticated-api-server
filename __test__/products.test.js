/* eslint-disable new-cap */
/* eslint-disable strict */
/* eslint-disable camelcase */
'use strict';

const { server } = require('../lib/server.js');
const supergoose = require('@code-fellows/supergoose');
const mockRequest = supergoose(server);

describe('Test API for Products', () => {

  it('testing get product route for all products', () => {
    return mockRequest
      .get('/products')
      .then(data => {
        expect(data.status).toBe(200);
        expect(typeof data.body).toMatch('object');
      });
  });

  it('testing get product route to get one product', () => {
    let obj = { name: 'cellphone', category:'phones', display_name: 'M20',description: 'has 2 cameras' };
    return mockRequest
      .post('/products')
      .send(obj)
      .then(data => {
        expect(typeof data.body).toMatch('object');
        // return mockRequest
        //   .get(`/api/v1/products/${data.body._id}`)
        //   .then(data => {
        //     let record = data.body[0];
        //     Object.keys(obj).forEach(key => {
        //       expect(record[key]).toEqual(obj[key]);
        //     });
        //   });
      });
  });

  it('testing post product route for new product', () => {
    let obj = { name: 'cellphone', category:'phones', display_name: 'M20',description: 'has 2 cameras' };
    return mockRequest
      .post('/products')
      .send(obj)
      .then(data => {
        let record = data.body;
        Object.keys(obj).forEach(key => {
          expect(record[key]).toEqual(obj[key]);
        });
      });
  });

  it('testing update product route', () => {
    let obj = { name: 'cellphone', category:'phones', display_name: 'M20',description: 'has 2 cameras' };
    return mockRequest
      .post('/products')
      .send(obj)
      .then(data => {
        return mockRequest
          .put(`/products/${data.body._id}`)
          .send({ description: 'has 2 cameras and full touch screen' })
          .then(results => {
            expect(results.status).toBe(201);
            expect(results.body.description).toEqual('has 2 cameras');
          });
      });
  });

  it('testing delete product route', () => {
    let obj = { name: 'cellphone', category:'phones', display_name: 'M20',description: 'has 2 cameras' };
    return mockRequest
      .post('/products')
      .send(obj)
      .then(data => {
        return mockRequest
          .delete(`/products/${data.body._id}`)
          .send(obj)
          .then((result) => {
            expect(result.body.confirm).toMatch('deleted');
          });
      });
  });

});
