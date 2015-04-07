var createHmac = require('create-hmac');
var createSign = require('browserify-sign').createSign;

module.exports = function (stringToSign, options) {
  var alg = options.algorithm.match(/(hmac|rsa)-(\w+)/);
  var signature;
  if (alg[1] === 'hmac') {
    var hmac = createHmac(alg[2].toUpperCase(), options.key);
    hmac.update(stringToSign);
    signature = hmac.digest('base64');
  } else {
    var signer = createSign(options.algorithm.toUpperCase());
    signer.update(stringToSign);
    signature = signer.sign(options.key, 'base64');
  }

  return signature;
};
