'use strict';

require('dotenv').config;

const express = require('express');

const router = express.Router();

const basicAuth = require('./middleware/basic');

const oAuth = require('./middleware/oAuth');

const users = require('./models/users-model');

const bearerAuth = require('./middleware/bearer');

const handleSignUp = async (req, res, next)=>{
  let user = new users(req.body);
  let valid = await users.findOne({username: user.username});
  // let valid = users.validation(user.username);
  if(!valid){

    try{

      let savedUser = await user.save();

      let token = savedUser.tokenGenerator();

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
router.post('/signin', basicAuth, handleSignin);
// router.get('/users',(req,res)=>{
//   users.find({})
//     .then(results => res.json(results));
// });
router.get('/oauth', oAuth, (req, res)=>{
  res.status(200).send(req.token);
});

router.get('/user', bearerAuth, (req, res) => {
  res.status(200).json(req.user);
});


module.exports = router;
