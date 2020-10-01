'use strict';

require('dotenv').config();

const mongoose = require('mongoose');

const server = require('./src/server');

// const MONGODB_URL = 'mongodb://localhost:27017/auth-server';
const MONGODB_URL = process.env.DB_URL;

const mongooseOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

mongoose.connect(MONGODB_URL, mongooseOptions)
  .then(console.log('connected to db'))
  .catch(e=>console.error(e));

server.start();
