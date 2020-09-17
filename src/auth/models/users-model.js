'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const isEmail = require('validator').isEmail;
const TOKEN_EXPIRE = process.env.TOKEN_EXPIRE || '60m';
const SECRET = process.env.SECRET || 'supersecret';

const usedTokens = new Set();

const users = new mongoose.Schema({
  username: { type: String, requried: true, unique: true},
  password: { type: String, required: true},
  fullname: { type: String },
  email: {type: String, validate: [ isEmail, 'invalid email' ]},
  role: { type: String, required: true, default: 'user', enum: ['admin', 'editor', 'user']},
  capabilities: { type: Array, required: true, default: [] },
});

users.pre('save', async function(){
  if (this.isModified('password')){
    this.password = await bcrypt.hash(this.password, 5);
  }
  let role = this.role;

  if(this.isModified('role')) {

    switch (role) {
    case 'admin':
      this.capabilities = ['create', 'read', 'update', 'delete'];
      break;
    case 'editor':
      this.capabilities = ['create', 'read', 'update'];
      break;
    case 'writer':
      this.capabilities = ['create', 'read'];
      break;
    case 'user':
      this.capabilities = ['read'];
      break;
    }
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

users.methods.tokenGenerator = function (type) {

  /* Lab 14 - add capabilities */
  let token = {
    id: this._id,
    role: this.role,
    capabilities: this.capabilities,
  };

  /* Additional Security Measure */
  let options = {};
  if (type !== 'key' && !!TOKEN_EXPIRE) {
    options = { expiresIn: TOKEN_EXPIRE };
  }

  return jwt.sign(token, SECRET, options);
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
  if (usedTokens.has(token)) {
    console.log('unique fail');
    return Promise.reject('Invalid Token');
  }

  try {

    let parsedToken = jwt.verify(token, SECRET);

    /* Additional Security Measure */
    if (parsedToken.type !== 'key') usedTokens.add(token);

    let query = { _id: parsedToken.id };
    return this.findOne(query);
  } catch (e) { throw new Error('Invalid Token'); }

};

users.methods.generateKey = function () {
  return this.generateToken('key');
};



module.exports = mongoose.model('users', users);

