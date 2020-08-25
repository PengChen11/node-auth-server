'use strict';

require('dotenv').config;

const express = require('express');

const router = express.Router();

const auth = require('./middleware/auth');

const users = require('./models/users-model');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET;

const handleSignUp = async (req, res, next)=>{
  let user = req.body;
  if(!users[user.username]){
    user.password = await bcrypt.hash(req.body.password, 10);

    users[user.username]=user;

    let token = await jwt.sign({username: user.username}, SECRET);

    res.status(200).send(token);
  } else {
    res.status(403).send('Username taken, please choose another one');
  }
};


router.post('/signup', handleSignUp);
router.post('/signin', auth, handleSignin);

// function handleSignup (req, res, next) {
//   // create nw user
//   //save it
//   //response ???
//   const user = new users(req.body);
//   user.save()
//     .then(user => {
//       let token = users.generateToken(user);
//       res.status(200).send(token);
//     })
//     .catch(e => { res.status(403).send('Error Creating User'); });
// }



function handleSignin(req, res, next){
  res.cookie('auth', req.token);
  res.send(req.token);
}

module.exports = router;
