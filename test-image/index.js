'use strict';

const { convert } = require('../lib/convert');

module.exports.handler =
  (event, context, callback) =>
    convert({ Key: 'temp123.jpg' })
      .then(callback);
