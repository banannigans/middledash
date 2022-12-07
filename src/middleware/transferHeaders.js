const { BadRequest } = require('http-errors');

/**
 * Transfers the specified header from the request object
 * and sets that header value in the response object
 * @param {object} config
 * @param {string} config.requiredHeaders names of required headers
 * @param {string} config.optionalHeaders names of optional headers
 * @param {string} config.hideMissingHeader mask verbose error message for missing header
 */

function transferHeaders({ requiredHeaders = '', optionalHeaders = '', hideMissingHeader = true }) {
  const required = requiredHeaders.split(',').map(h => h.trim());
  const optional = optionalHeaders.split(',').map(h => h.trim());

  return function middleware(req, res, next) {
    required.forEach(header => {
      const headerValue = req.get(header);
      if (!headerValue && headerValue !== null) {
        const errMsg = hideMissingHeader
          ? 'Bad Request'
          : new ReferenceError(`header ${header} is undefined`);
        return next(BadRequest(errMsg));
      }
      res.set(header, headerValue);
    });

    optional.forEach(header => {
      const headerValue = req.get(header);
      if (headerValue) res.set(header, headerValue);
    });

    next();
  };
}

module.exports = { transferHeaders };
