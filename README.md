# superagent-http-signature
A plugin for superagent that signs requests using Joyent's [HTTP Signature Scheme](https://github.com/joyent/node-http-signature/blob/master/http_signing.md).
Forked from [joyent/node-http-signature](https://github.com/joyent/node-http-signature) to be used with superagent.

## Supported algorithms
 - rsa-sha1
 - rsa-sha256
 - rsa-sha512
 - dsa-sha1
 - hmac-sha1
 - hmac-sha256
 - hmac-sha512

## HMAC-only version
For usage with browserify using the `index-hmac-only.js` version is recommended because it's a lot smaller without all the other signing code included!

## Installation
Install with [npm](http://npmjs.org):
```
$ npm install superagent-http-signature
```

## Usage
```javascript
var superagent = require('superagent');
var superagentHttpSignature = require('superagent-http-signature');

superagent
    .get('http://www.example.com')
    .use(superagentHttpSignature({
         headers: ['(request-target)', 'content-md5'],
         algorithm: 'hmac-sha256',
         key: 'YOUR_KEY',
         keyId: 'YOUR_SECRET'
     }))
    .end(function(err, res) {});
```
