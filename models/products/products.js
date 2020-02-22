

const schema = require('./products-schema.js');
const Model = require('../mongo.js');

/**
 * Class representing a products Item.
 * @extends Model
 */
class Products extends Model {}

module.exports = new Products(schema);
