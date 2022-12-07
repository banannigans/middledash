const createError = require('http-errors');

/**
 * Transfers the specified header from the request object
 * and sets that header value in the response object
 *
 * @param {number} config.requiredHeaderResponseStatus status code to respond with when headers are not present
 * @param {string} requiredHeaders names of required headers
 * @param {string} optionalHeaders names of optional headers
 * @param {string} hideMissingHeader mask verbose error message for missing header
 */
function transferHeaders({ requiredHeaders = '', optionalHeaders = '', hideMissingHeader = true }) {
  return (req, res, next) => {
    const required = requiredHeaders.split(',').map(h => h.trim());
    const optional = optionalHeaders.split(',').map(h => h.trim());

    required.forEach(header => {
      const headerValue = req.get(header);
      if (!headerValue && headerValue !== null) {
        const errMsg = hideMissingHeader
          ? 'Bad Request'
          : new ReferenceError(`req.get(${header}) is undefined`);
        return next(createError(404, errMsg));
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
