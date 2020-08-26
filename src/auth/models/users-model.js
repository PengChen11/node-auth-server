'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const users = new mongoose.Schema({
  username: { type: String, requried: true, unique: true},
  password: { type: String, required: true},
  email: {type: String},
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


module.exports = mongoose.model('users', users);

