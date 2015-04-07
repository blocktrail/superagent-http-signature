var createHmac = require('create-hmac');

module.exports = function (stringToSign, options) {
  var alg = options.algorithm.match(/(hmac|rsa)-(\w+)/);
  var signature;
  if (alg[1] === 'hmac') {
    var hmac = createHmac(alg[2].toUpperCase(), options.key);
    hmac.update(stringToSign);
    signature = hmac.digest('base64');
  } else {
    throw new Error("Only HMAC is supported!");
  }

  return signature;
};
