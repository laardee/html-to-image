'use strict';

const spawn = require('child_process').spawn;
const { spawnPromise } = require('./spawn');
const fs = require('fs-extra');
const BbPromise = require('bluebird');
const AWS = require('aws-sdk');
const path = require('path');

const remove = BbPromise.promisify(fs.remove);
const ensureDir = BbPromise.promisify(fs.ensureDir);

const s3 = new AWS.S3();

const defaultParams = {
  width: 585,
  encoding: 'utf8',
  quality: 90,
  format: 'jpg',
};

const parseParams = (params) =>
  Object.keys(params)
    .map(key => `--${key} ${params[key]}`)
    .join(' ');

const wkhtmltoimage = ({ input, params, output }) =>
  spawnPromise(spawn('./bin/wkhtmltoimage',
    (`${parseParams(params)} - ${output}`).split(' ')),
    input);

const convert = ({ Key, params }) => {
  const output = path.join('/tmp', Key); // check '-' option for buffer
  const conversionParams = Object.assign({}, defaultParams, params);
  return ensureDir(path.dirname(output))
    .then(() =>
      wkhtmltoimage({
        params: conversionParams,
        input: '<div><h1>Hello World!</h1><p>Hello World!</p></div>',
        output,
      }))
    .then(() =>
      s3.putObject({
        Bucket: process.env.IMAGES_BUCKET,
        Key,
        Body: fs.readFileSync(output),
        ContentType: `image/${conversionParams.format}`,
      }).promise())
    .then(() =>
      remove(output));
};

module.exports = {
  convert,
};
