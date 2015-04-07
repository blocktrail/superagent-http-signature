module.exports = function (options) {
  options.signer = options.signer || require('./lib/signer-hmac-only');

  return require('./lib/index')(options);
}
