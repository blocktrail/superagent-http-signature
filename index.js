module.exports = function (options) {
  options.signer = options.signer || require('./lib/signer');

  return require('./lib/index.js')(options);
}
