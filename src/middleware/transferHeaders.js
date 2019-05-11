const createError = require('http-errors');

/**
 * Transfers the specified header from the request object
 * and sets that header value in the response object
 *
 * @param {Array<string>} headerNames names of request headers
 */
const transferHeaders = (...headerNames) => {
  return (req, res, next) => {
    for (let i = 0; i < headerNames.length; i += 1) {
      const headerName = headerNames[i];
      const headerValue = req.get(headerName);

      if (!headerValue && headerValue !== null) {
        return next(createError(400, new ReferenceError(`req.get(${headerName}) is undefined`)));
      }

      res.set(headerName, headerValue);
    }

    next();
  };
};

module.exports = { transferHeaders };
