/* eslint-disable strict */
'use strict';

/**
 * errorHandler middleware
 * @param {Object} error
 * @param {Object} req
 * @param {Object} res
 * @param {MM} next
 */
function errorHandler(err, req, res, next) {
  // res.status(500);
  // res.statusMessage = 'Server Error';
  // res.Message = 'server error';
  // res.json(err);
  // next();
  let pageError = { error: err };
  res.statusCode = 500;
  res.statusMessage = 'Server Error';
  res.setHeader('Content-Type', 'application/json');
  res.write( JSON.stringify(pageError) );
  res.end();
}

module.exports = errorHandler;
