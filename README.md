# superagent-http-signature
A plugin for superagent that signs requests using Joyent's [HTTP Signature Scheme](https://github.com/joyent/node-http-signature/blob/master/http_signing.md).
Forked from [joyent/node-http-signature](https://github.com/joyent/node-http-signature) to be used with superagent.

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
