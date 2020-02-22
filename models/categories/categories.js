

const schema = require('./categories-schema.js');
const Model = require('../mongo.js');

/**
 * Class representing a categories Item.
 * @extends Model
 */
class Categories extends Model {}

module.exports = new Categories(schema);
