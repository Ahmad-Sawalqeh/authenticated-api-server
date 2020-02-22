/* eslint-disable strict */
'use strict';

const mongoose = require('mongoose');
const server = require('./lib/server.js');
require('dotenv').config();

// const PORT = process.env.PORT;
// const MONGODB_URI = 'mongodb://localhost:27017/class09';
const MONGODB_URI = process.env.MONGODB_URI;

const mongooseOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  // useFindAndModify: false,
};

// mongoose.connect(MONGODB_URI)
mongoose.connect(MONGODB_URI, mongooseOptions)
  .then(() => {
    //connection established successfully
    console.log('Database connected');
  })
  .catch((error) => {
    //catch any error during the initial connection
    console.log('Failed to connect to database: ', error);
  });


server.start();
