'use strict';

require('dotenv').config;

const express = require('express');

const router = express.Router();

const auth = require('./middleware/basic');

const users = require('./models/users-model');

// const bcrypt = require('bcrypt');

// const jwt = require('jsonwebtoken');

// const SECRET = process.env.SECRET;

const handleSignUp = async (req, res, next)=>{
  let user = new users(req.body);
  let valid = await users.findOne({username: user.username});
  // let valid = users.validation(user.username);
  console.log('valid: ', valid );
  if(!valid){

    try{

      let savedUser = await user.save();

      let token = savedUser.tokenGenerator(savedUser);

      res.status(200).send(token);
    } catch (error) {
      console.error(error);
    }
  } else {
    res.status(403).send('Username taken, please choose another one');
  }
};



function handleSignin(req, res, next){
  res.cookie('auth', req.token);
  res.send(req.token);
}

router.post('/signup', handleSignUp);
router.post('/signin', auth, handleSignin);
router.get('/users',(req,res)=>{
  users.find({})
    .then(results => res.json(results));
});


module.exports = router;
