'use strict';

const spawn = require('child_process').spawn;
const { spawnPromise } = require('./spawn');
const fs = require('fs-extra');
const BbPromise = require('bluebird');
const AWS = require('aws-sdk');

const remove = BbPromise.promisify(fs.remove);
const s3 = new AWS.S3();

const defaultParams = {
  width: 585,
  encoding: 'utf8',
  quality: 90,
  format: 'jpg',
};

const output = `/tmp/${Date.now()}.${defaultParams.format}`; // check '-' option

const parseParams = (params) =>
  Object.keys(params)
    .map(key => `--${key} ${params[key]}`)
    .join(' ');

const wkhtmltoimage = (input) =>
  spawnPromise(spawn('./bin/wkhtmltoimage',
    (`${parseParams(defaultParams)} - ${output}`).split(' ')),
    input);

const convert = ({ Key }) =>
  wkhtmltoimage('<div>hello</div>')
    .then(() =>
      s3.putObject({
        Bucket: process.env.IMAGES_BUCKET,
        Key,
        Body: fs.readFileSync(output),
        ContentType: `image/${defaultParams.format}`,
      }).promise())
    .then(() =>
      remove(output));

module.exports = {
  convert,
};
