/* eslint-disable strict */
/* eslint-disable new-cap */
/* eslint-disable camelcase */
'use strict';

const mongoose = require('mongoose');
require('./products.js');

const productsSchema = mongoose.Schema({
  name: { type: String, required: true },
  display_name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
}, { toObject: { virtuals: true }, toJson: { virtuals: true } });

/**
 * virtual modleing for products
 */
productsSchema.virtual('actualCategory', {
  ref: 'categories',// collection/model name (categories)
  localField: 'category',// category inside products schema
  foreignField: 'name',// name inside categories schema
  justOne: false,
});

/**
 * the (pre) hook method to invoke callback function before go to database and applying (findOne) method
 */
productsSchema.pre('findOne', function () {
  try {
    this.populte('actualCategory');// the virtual name (property) we created
  } catch (err) {
    console.error(err);
  }
});

module.exports = mongoose.model('products', productsSchema);
