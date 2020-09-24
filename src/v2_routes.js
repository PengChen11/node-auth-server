'use strict';
const express = require('express');
const bearerAuth = require('./auth/middleware/bearer');
const router = express.Router();
const permissions = require('./auth/middleware/acl.js');


router.get('/secret', bearerAuth, (req,res) => {
  res.status(200).send('access allowed');
} );




/*
  - `router.get('/public')` should be visible by anyone
  - `router.get('/private')` should require only a valid login
  - `router.get('/readonly')` should require the `read` capability
  - `router.get('/create)` should require the `create` capability
  - `router.put('/update)` should require the `update` capability
  - `router.patch('/delete)` should require the `update` capability
*/

router.get('/public', routeHandler);
router.get('/private', bearerAuth, routeHandler);
router.get('/readonly', bearerAuth, permissions('read'), routeHandler);
router.post('/create', bearerAuth, permissions('create'), routeHandler);
router.put('/update', bearerAuth, permissions('update'), routeHandler);
router.delete('/delete', bearerAuth, permissions('delete'), routeHandler);

function routeHandler(req, res) {
  res.status(200).send('Access Granted');
}

module.exports = router;
