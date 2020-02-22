/* eslint-disable new-cap */
/* eslint-disable strict */
'use strict';

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const categories = require('../models/categories/categories.js');
const products = require('../models/products/products.js');

const acl = require('../auth/acl/acl.js');
const basicMiddleware = require('../auth/basic/basic.js');
const bearerMiddleware = require('../auth/bearer/bearer.js');
const faceOauthMiddleware = require('../auth/oauth/face-oauth.js');
const githubOauthMiddleware = require('../auth/oauth/github-oauth.js');
const User = require('../auth/users-schema.js');

/**
 * Model must be a proper model, found in /models folder
 * @param {object} req
 * @param {object} res
 * @param {MM} next
 * @returns instance of specific model
 */
function getModel(req, res, next) {
  let model = req.params.model;

  switch (model) {
  case 'categories':
    req.model = categories;
    next();
    return;
  case 'products':
    req.model = products;
    next();
    return;
  default:
    next('invalid');
    return;
  }
}

/**
 * param route to find a proper model
 * Evaluates req.params.model /api/v1/:model
 */
router.param('model', getModel);

/**
 * sign up route => the user should add name and pass
 * the user not required to add email and role
 * the admin should add the role
 */
router.post('/signup', signup);

/**
 * sign in route => the user should add name and pass
 */
router.post('/signin', basicMiddleware, signin);

/**
 * bearer route to make sure the user is signed in
 */
router.get('/user', bearerMiddleware, (req, res) => {
  User.list()
    .then(data => {
      // console.log('data => ',data);
      res.status(200).json(data);
    });
});

router.get('/oauth', faceOauthMiddleware, oauth);
router.get('/githubOauth', githubOauthMiddleware, githubOauth);


/**
 * routs /:model
 * @param {model} model categories/products model must be one of models in /models folder
 */
router.get('/:model', getAllModel);

/**
 * routs /:model
 * @param {model} model categories/products model must be one of models in /models folder
 * @param {id} id _id of categories/products model to get a specific model
 */
router.get('/:model/:id', getOneModel);

router.post('/:model', createModel);
router.put('/:model/:id', updateModel);
router.delete('/:model/:id', deleteModel);

/**
 * to post a new category product by the admin
 */
router.post('/:model', bearerMiddleware, acl('create'), createModel);

/**
 * to update a category or product by admin
 */
router.put('/:model/:id', bearerMiddleware, acl('update'), updateModel);

/**
 * to delete category or product by admin
 */
router.delete('/:model/:id', bearerMiddleware, acl('delete'), deleteModel);


/*********************************************************************/
// data to be store in categories schema
// {
//   "name": "cellphone",
//   "display_name": "M20",
//   "description": "has 2 cameras"
// }

// data to be store in products schema
// {
//   "name": "cellphone",
//   "display_name": "M20",
//   "description": "has 2 cameras",
//   "category": "phones"
// }
// {
//   "name": "blue phone",
//   "display_name": "S10",
//   "description": "super cameras",
//   "category": "phones"
// }




/**
 * Signup function
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
function signup(req, res, next) {
  let user = new User(req.body);
  user.save()
    .then((dbuser) => {
    //   console.log('hashedpass inside sign up', dbuser.pass);
      let user = {
        id: dbuser._id,
      };
      return jwt.sign(user, 'ser123');
    })
    .then((token) => {
    //   console.log('sign-up token :', token);
      res.status(200).send('successfully sign-up ');
    });
}


/**
 * Sign in function
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
function signin(req, res, next) {
//   console.log(req.token);
  // res.status(200).send('successfully sign-in, your token is:  ')
  res.status(200).json(req.token);

}

function oauth(req, res) {
  // console.log('token => ', req.token);
  let response = {
    status: 'you successfully signed with facebook',
    token: req.faceToken,
  };
  res.status(200).json(response);
}

function githubOauth(req, res) {
  // console.log('token => ', req.token);
  let response = {
    status: 'you successfully signed with github',
    token: req.githubToken,
  };
  res.status(200).json(response);
}

/**
 * retrieve all data
 * @param {object} req
 * @param {object} res
 * @param {MM} next
 * @returns {object} 200 - Count of results and an array of results
 * @returns {Error}  500 - Unexpected error
 */
function getAllModel(req, res, next) {
  req.model.get()
    .then(results => {
      let count = results.length;
      res.status(200).json({ count, results });
    })
    .catch(next);
}

/**
 * retreive one item
 * @param {object} req
 * @param {object} res
 * @param {MM} next
 * @returns {object} 200 - results
 * @returns {Error}  500 - Unexpected error
 */
function getOneModel(req, res, next) {
  let _id = req.params.id;
  req.model.get(_id)
    .then(results => {
      res.status(200).json(results);
    })
    .catch(next);
}

/**
 * create new item
 * @param {object} req
 * @param {object} res
 * @param {MM} next
 * @returns {object} 201 - results
 * @returns {Error}  500 - Unexpected error
 */
function createModel(req, res, next) {
  req.model.create(req.body)
    .then(results => {
      res.status(201).json(results);
    })
    .catch(next);
}

/**
 * update item
 * @param {object} req
 * @param {object} res
 * @param {MM} next
 * @returns {object} 201 - results
 * @returns {Error}  500 - Unexpected error
 */
function updateModel(req, res, next) {
  let _id = req.params.id;
  req.model.update(_id, req.body)
    .then(results => {
      res.status(201).json(results);
    })
    .catch(next);
}

/**
 * delete item
 * @param {object} req
 * @param {object} res
 * @param {MM} next
 * @returns {object} 201 - { confirm: deleted }
 * @returns {Error}  500 - Unexpected error
 */
function deleteModel(req, res, next) {
  let message = 'deleted';
  let _id = req.params.id;
  req.model.delete(_id)
    .then(() => {
      res.status(201).json({ confirm: message });
    })
    .catch(next);
}

module.exports = router;
