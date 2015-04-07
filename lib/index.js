/**
 * original code from http-signature package by Joyent, Inc.
 *
 * rewrite by Ruben de Vries <ruben@blocktrail.com> to work with superagent
 */
var sprintf = require('util').format;

function getHeader(request, header) {
  return request.get ? request.get(header) : request.getHeader(header);
}

///--- Specific Errors
function MissingHeaderError(message) {
  this.name = 'MissingHeaderError';
  this.message = message;
  this.stack = (new Error()).stack;
}

MissingHeaderError.prototype = new Error();


function InvalidAlgorithmError(message) {
  this.name = 'InvalidAlgorithmError';
  this.message = message;
  this.stack = (new Error()).stack;
}

InvalidAlgorithmError.prototype = new Error();

///--- Globals
var Algorithms = {
  'rsa-sha1': true,
  'rsa-sha256': true,
  'rsa-sha512': true,
  'dsa-sha1': true,
  'hmac-sha1': true,
  'hmac-sha256': true,
  'hmac-sha512': true
};

var Authorization = 'Signature keyId="%s",algorithm="%s",headers="%s",signature="%s"';

function pathFromURL(path) {
  var match = path.match(/^(?:(.*?):\/\/?)?\/?(?:[^\/\.]+\.)*?([^\/\.]+)\.?([^\/]*)(?:([^?]*)?(?:\?(‌​[^#]*))?)?(.*)?/);

  if (!match) {
    return false;
  }

  return match[4] + (match[6] || "");
}


///--- Internal Functions
function _pad(val) {
  if (parseInt(val, 10) < 10) {
    val = '0' + val;
  }
  return val;
}

function _rfc1123() {
  var date = new Date();

  var months = ['Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'];
  var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[date.getUTCDay()] + ', ' +
    _pad(date.getUTCDate()) + ' ' +
    months[date.getUTCMonth()] + ' ' +
    date.getUTCFullYear() + ' ' +
    _pad(date.getUTCHours()) + ':' +
    _pad(date.getUTCMinutes()) + ':' +
    _pad(date.getUTCSeconds()) +
    ' GMT';
}

function sign(request, options) {
  if (!options.headers) {
    options.headers = ['date'];
  }
  if (!getHeader(request, 'Date') && options.headers.indexOf('date') !== -1) {
    request.set('Date', _rfc1123());
  }
  if (!options.algorithm) {
    options.algorithm = 'rsa-sha256';
  }
  if (!options.httpVersion) {
    options.httpVersion = '1.1';
  }

  options.algorithm = options.algorithm.toLowerCase();

  if (!Algorithms[options.algorithm]) {
    throw new InvalidAlgorithmError(options.algorithm + ' is not supported');
  }

  var i;
  var stringToSign = '';
  var value;
  for (i = 0; i < options.headers.length; i++) {
    if (typeof (options.headers[i]) !== 'string') {
      throw new TypeError('options.headers must be an array of Strings');
    }

    var h = options.headers[i].toLowerCase();

    if (h === 'request-line') {
      value =
        stringToSign +=
          request.method + ' ' + pathFromURL(request.url) + ' HTTP/' + options.httpVersion;
    } else if (h === '(request-target)') {
      value =
        stringToSign +=
          '(request-target): ' + request.method.toLowerCase() + ' ' + pathFromURL(request.url);
    } else {
      value = getHeader(request, h);
      if (!value) {
        throw new MissingHeaderError(h + ' was not in the request');
      }
      stringToSign += h + ': ' + value;
    }

    if ((i + 1) < options.headers.length) {
      stringToSign += '\n';
    }
  }

  var signature = options.signer(stringToSign, options);

  request.set('Authorization', sprintf(Authorization,
    options.keyId,
    options.algorithm,
    options.headers.join(' '),
    signature));

  return true;
};

module.exports = function (options) {

  return function (request) {
    sign(request, options);

    return request;
  };
}
