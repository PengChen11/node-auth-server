'use strict';

const User = require('../models/users-model');

module.exports = async (req, res, next) => {


  if (!req.headers.authorization) { next('Invalid Login: Missing Headers'); return; }

  let token = req.headers.authorization.split(' ').pop();

  try {

    const validUser = await User.authenticateToken(token);

    req.user = validUser;
    req.token = token;

    /* Lab 14 - add capabilities key/value pair */
    req.user = {
      username: validUser.username,
      fullname: validUser.fullname,
      email: validUser.email,
      capabilities: validUser.capabilities,
    };

    next();

  } catch (err) {

    next('Invalid Login');
  }
};
