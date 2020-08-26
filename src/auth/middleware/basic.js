'use strict';

const base64 = require('base-64');

const users = require('../models/users-model');

module.exports = async (req, res, next)=>{

  if (! req.headers.authorization) {
    next('Invalid Login');
    return;
  }

  let basic = req.headers.authorization.split(' ').pop();

  let [user, pass] = base64.decode(basic).split(':');

  const validUser = await users.authenticateBasic(user, pass);

  if (validUser) {
    const token = validUser.tokenGenerator();

    req.token = token;

    next();

  } else {

    next({ 'message': 'Invalid User ID/Password', 'status': 401, 'statusMessage': 'Unauthorized' });
  }
};
