'use strict';

const users = require('../models/users-model');

module.exports = (req, res, next) => {

  if (!req.headers.authorization) {
    next('Invalid Login: Missing Headers');
    return;
  }

  // Pull out just the encoded part by splitting the header into an array on the space and popping off the 2nd element
  let token = req.headers.authorization.split(' ').pop();

  // Notice that here, we're catching the errors from the user model.
  users.authenticateToken(token)
    .then(validUser => {
      req.user = validUser;
      next();
    })
    .catch(err => next('Invalid Login'));

};
