/* eslint-disable camelcase */
/* eslint-disable strict */
'use strict';

require('dotenv').config();
const superagent = require('superagent');
const jwt = require('jsonwebtoken');
const Users = require('../users-schema.js');

let GITHUB_TOKEN_URL = process.env.GITHUB_TOKEN_URL;
let GITHUB_REMOTE_API = process.env.GITHUB_REMOTE_API;

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_API_SERVER = process.env.GITHUB_API_SERVER;

let SECRET = process.env.SECRET;

module.exports = async function authorize(req, res, next) {
  try {
    // console.log('hello from github authorize');
    let code = req.query.code;
    // console.log('req.query.code => ',req.query.code);
    let remoteToken = await codeTokenExchanger(code);
    let remoteUser = await getRemoteUserInfo(remoteToken);
    let [user, token] = await getUser(remoteUser);
    req.githubUser = user;
    req.githubToken = token;
    next();
  } catch (e) {
    // console.log('error');
    next(e);
  }
};

async function codeTokenExchanger(code) {
  let tokenResponse = await superagent.post(GITHUB_TOKEN_URL).send({
    code: code,
    client_id: GITHUB_CLIENT_ID,
    client_secret: GITHUB_CLIENT_SECRET,
    redirect_uri: GITHUB_API_SERVER,
    grant_type: 'authorization_code',
  });

  let access_token = tokenResponse.body.access_token;
  // console.log('access_token => ',access_token);
  return access_token;
}

async function getRemoteUserInfo(token) {
  let userResponse = await superagent.get(GITHUB_REMOTE_API)
    .set('user-agent', 'express-app')
    .set('Authorization', `token ${token}`);

  let user = userResponse.body;
  // console.log(user);
  return user;
}

async function getUser(remoteUser) {
  let userRecord = {
    name: remoteUser.login,
    pass: '123456789',
  };
  let newUser = new Users(userRecord);
  let user = await newUser.save();
  // let token = await newUser.tokenGenerator(user);

  let usreInfo = {
    id: user._id,
  };
  let token = jwt.sign(usreInfo,SECRET);

  return [user, token];
}
