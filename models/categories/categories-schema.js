/* eslint-disable strict */
/* eslint-disable new-cap */
/* eslint-disable camelcase */
'use strict';

const mongoose = require('mongoose');
require('./categories.js');

const categoriesSchema = mongoose.Schema({
  name: { type: String, required: true },
  display_name: { type: String, required: true },
  description: { type: String, required: true },
}, { toObject: { virtuals: true }, toJson: { virtuals: true } });

/**
 * virtual modleing for categories
 */
categoriesSchema.virtual('actualProducts', {
  ref: 'products',// collection/model name (products)
  localField: 'name',// category inside categories schema
  foreignField: 'category',// name inside products schema
  justOne: false,
});

/**
 * the (pre) hook method to invoke callback function before go to database and applying (findOne) method
 */
categoriesSchema.pre('findOne', function () {
  try {
    // the virtual name (property) we created
    this.populate('actualProducts');
  } catch (err) {
    console.error(err);
  }
});

module.exports = mongoose.model('categories', categoriesSchema);
