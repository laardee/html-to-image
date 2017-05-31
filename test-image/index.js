'use strict';

const { convert } = require('../lib/convert');

module.exports.handler =
  (event, context, callback) =>
    convert({ Key: 'dirname/file.jpg' })
      .then(callback);
