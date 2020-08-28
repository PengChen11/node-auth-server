'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const isEmail = require('validator').isEmail;

const users = new mongoose.Schema({
  username: { type: String, requried: true, unique: true},
  password: { type: String, required: true},
  email: {type: String, validate: [ isEmail, 'invalid email' ]},
  role: { type: String, required: true, default: 'user', enum: ['admin', 'editor', 'user']},
});

users.pre('save', async function(){
  if (this.isModified('password')){
    this.password = await bcrypt.hash(this.password, 5);
  }
});


users.statics.authenticateBasic = function(username, password) {
  let query = { username };
  return this.findOne(query)
    .then( user => user && user.comparePassword(password))
    .catch(err=>console.error(err));
};


users.methods.comparePassword = function(plainPassword) {
  return bcrypt.compare(plainPassword, this.password)
    .then(valid => valid ? this : null)
    .catch(err=>console.error(err));
};

users.methods.tokenGenerator = function(){
  let tokenData = {
    id: this._id,
    username: this.username,
    role: this.role,
  };

  const signed = jwt.sign(tokenData, process.env.SECRET);

  return signed;
};

users.methods.validation = function(username) {
  let query = { username };
  console.log('validation this is: ', this);
  return this.findOne(query);
  // return result;
};


users.statics.createFromOauth = async function(email){

  if(!email){
    return Promise.reject('Validation Error');
  }

  let query = { email };
  let findUser = await this.findOne(query);
  if(!findUser){
    try {
      return this.create({username:email, password:'none', email:email});
    }
    catch (error){
      return error;
    }
  }
  return findUser;
};

users.statics.authenticateToken = function (token) {

  /* Additional Security Measure */
  // if (usedTokens.has(token)) {
  //   return Promise.reject('Invalid Token');
  // }

  let parsedToken = jwt.verify(token, process.env.SECRET);

  /* Additional Security Measure */
  // Add to the scrap heap if we are in "one use token mode"
  // if(SINGLE_USE_TOKENS) {
  //   usedTokens.add(token);
  // }

  return this.findById(parsedToken.id);

};



module.exports = mongoose.model('users', users);

