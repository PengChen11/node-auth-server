'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const users = mongoose.Schema({
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

class Users {
  constructor(){
    this.schema = mongoose.model('users', users);
  }

  static authenticateBasic(username, password) {
    let query = { username };
    return this.schema.findOne(query)
      .then( user => user && user.comparePassword(password))
      .catch(err=>console.error(err));
  }

  comparePassword(plainPassword) {
    return bcrypt.compare(plainPassword, this.schema.password)
      .then(valid => valid ? this.schema : null)
      .catch(err=>console.error(err));
  }

  tokenGenerator(){
    let tokenData = {
      id: this.schema._id,
      username: this.schema.username,
      role: this.schema.role,
    };
    const signed = jwt.sign(tokenData, process.env.SECRET);
    return signed;
  }

  validation(username) {
    let query = { username };
    console.log('validation this is: ', this.schema);
    return this.schema.findOne(query);
  }

  // create(user){
  //   let newUser = new this.schema(user);
  //   return newUser.save();
  // }
}


module.exports = new Users();

