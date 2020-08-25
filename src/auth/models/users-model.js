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

users.pre('save', async ()=>{
  if (this.isModified('password')){

    this.password = await bcrypt.hash(this.password, 10);
  }
});

users.statics.authenticateBssic = (username, password) =>{
  let query = { username };
  return this.findOne(query)
    .then( user => user && user.comparePassword(password))
    .catch(console.error);
};


users.method.comparePassword = (plainPassword) =>{
  return bcrypt.compare(plainPassword, this.password)
    .then(valid => valid ? this : null)
    .catch(console.error);
};

users.method.tokenGenerator = () =>{
  let tokenData = {
    id: this._id,
  };

  const signed = jwt.sign(tokenData, process.env.SECRET);

  return signed;
};

module.exports = mongoose.model('users', users);
