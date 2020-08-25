'use strict';

const base64 = require('base-64');

const users = require('../models/users-model');

module.exports = (req, res, next)=>{

  if (! req.headers.authorization) {
    next('Invalid Login');
    return;
  }

  let basic = req.headers.authorization.split(' ').pop();

  // decodes to user:pass and splits it to an array
  let [user, pass] = base64.decode(basic).split(':');

  // Is this user ok?
  users.authenticateBssic(user, pass)
    .then(validUser => {
      req.token = users.generateToken(validUser);
      next();
    })
    .catch(err => next('Invalid Login'));

};
